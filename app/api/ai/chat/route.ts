import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Lấy message cuối cùng từ người dùng
  const lastMessage = messages?.at(-1)?.content || "Hello!"

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant for general tasks." },
      ...messages,
      { role: "user", content: lastMessage },
    ],
  })

  const reply = completion.choices[0]?.message?.content || ""
  return NextResponse.json({ reply })
}
