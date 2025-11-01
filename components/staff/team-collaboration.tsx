"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

const mockDiscussions = [
    {
        id: 1,
        type: "chat",
        user: { name: "Emily Blunt", avatar: "/avatars/05.png" },
        content: "@here Just a reminder that the sprint planning meeting is tomorrow at 10 AM.",
        timestamp: "2h ago"
    },
    {
        id: 2,
        type: "meeting",
        title: "Weekly Sync - Notes",
        content: "- Discussed new design mockups.\n- Agreed on API schema for user profiles.",
        timestamp: "Yesterday"
    },
    {
        id: 3,
        type: "chat",
        user: { name: "John Krasinski", avatar: "/avatars/06.png" },
        content: "Has anyone looked into the performance issue on the staging server?",
        timestamp: "3d ago"
    },
]

export function TeamCollaboration() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Collaboration</CardTitle>
        <CardDescription>Recent discussions and meeting notes.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
            <div className="space-y-4">
            {mockDiscussions.map((item) => (
                <div key={item.id} className="flex items-start space-x-3">
                {item.type === 'chat' && item.user && (
                    <>
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={item.user.avatar} alt={item.user.name} />
                            <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-baseline justify-between">
                                <p className="font-semibold text-sm">{item.user.name}</p>
                                <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{item.content}</p>
                        </div>
                    </>
                )}
                {item.type === 'meeting' && (
                    <div className="flex-1 bg-muted/50 p-3 rounded-lg border">
                        <div className="flex items-baseline justify-between">
                            <p className="font-semibold text-sm">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-line mt-1">{item.content}</p>
                    </div>
                )}
                </div>
            ))}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
