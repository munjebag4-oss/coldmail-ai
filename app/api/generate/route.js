import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request) {
  try {
    const { company, role, product, tone } = await request.json();

    if (!company || !role || !product) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const toneGuide = {
      professional:
        "Write in a polished, professional tone. Be respectful and concise.",
      casual:
        "Write in a casual, friendly tone. Like messaging a colleague, not a stranger.",
      bold: "Write in a bold, confident tone. Be direct and assertive. Stand out.",
      curious:
        "Write in a curious, intriguing tone. Ask a thought-provoking question to hook them.",
    };

    const systemPrompt = `You are an expert cold email copywriter. You write short, punchy cold emails that get replies.

Rules:
- Subject line first (on its own line, prefixed with "Subject: ")
- Keep the email body under 100 words
- No fluff, no filler, no corporate jargon
- Personalize based on the company and role
- Include one clear call-to-action
- ${toneGuide[tone] || toneGuide.professional}
- Do NOT use placeholder brackets like [Name] — write it as if ready to send
- Start with "Hi" or "Hey" followed by a natural greeting`;

    const userPrompt = `Write a cold email to the ${role} at ${company}.

I'm offering: ${product}

Write the subject line and email body. Make it compelling and specific to their role and company.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 400,
    });

    const email = completion.choices[0]?.message?.content?.trim();

    return NextResponse.json({ email });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate email. Check your API key." },
      { status: 500 }
    );
  }
}
