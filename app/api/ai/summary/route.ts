import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: Request) {
  const { text, prompt, messages } = await req.json()

  let systemPrompt = ""
  let userPrompt = ""

  // Auto-detect by route name
  const url = new URL(req.url).pathname
  if (url.includes("summary")) systemPrompt = "Summarize meeting notes clearly and concisely."
  if (url.includes("content")) systemPrompt = "You are a creative marketing writer."
  if (url.includes("planning")) systemPrompt = "You are an assistant that creates structured schedules and plans."
  if (url.includes("chat")) systemPrompt = "You are a helpful assistant for general tasks."

  userPrompt = text || prompt || messages?.at(-1)?.content || "Hello!"

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  })

  const result = response.choices[0]?.message?.content || ""
  return NextResponse.json({ result })
}
