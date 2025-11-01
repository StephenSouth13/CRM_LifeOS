"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, User, Send, CornerDownLeft } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const suggestedQuestions = [
    "Where is my order?",
    "What is the return policy?",
    "How do I change my password?",
]

export function AiChatbot() {
    const [messages, setMessages] = React.useState<Message[]>([
        { sender: 'bot', text: 'Hello! How can I assist you today?' }
    ]);
    const [input, setInput] = React.useState('');

    const handleSend = (question: string = input) => {
        if (question.trim() === '') return;

        const newMessages: Message[] = [...messages, { sender: 'user', text: question }];
        setMessages(newMessages);
        setInput('');

        // Simulate bot response
        setTimeout(() => {
            let botResponse = "I'm sorry, I don't understand. Can you rephrase?";
            if (question.toLowerCase().includes("order")) {
                botResponse = "Your order ORD-2023-003 was shipped on Nov 22, 2023. The tracking number is 1Z999AA10123456789."
            } else if (question.toLowerCase().includes("return policy")) {
                botResponse = "You can return any item within 30 days of purchase. Please visit our returns page for more details."
            }
            setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
        }, 1000);
    };

    return (
        <Card className="flex flex-col h-[550px]">
            <CardHeader>
                <div className="flex items-center space-x-3">
                    <Bot className="h-6 w-6 text-primary" />
                    <div>
                        <CardTitle>AI Assistant</CardTitle>
                        <CardDescription>Ask me anything about your account or our services.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0"><Bot className="h-5 w-5"/></div>}
                                <div className={`px-4 py-2 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                                {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0"><User className="h-5 w-5"/></div>}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t">
                     {messages.length <= 2 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                            {suggestedQuestions.map(q => (
                                <Button key={q} variant="outline" size="sm" onClick={() => handleSend(q)}>{q}</Button>
                            ))}
                        </div>
                    )}
                    <div className="relative">
                        <Input 
                            placeholder="Type your message..." 
                            value={input} 
                            onChange={e => setInput(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <Button size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7" onClick={() => handleSend()} disabled={!input.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
