import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request) {
  try {
    const { company, role, product, tone, followUp, sequenceNum, previousEmail } = await request.json();

    if (!company || !role || !product) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const toneGuide = {
      professional: "Write in a polished, professional tone. Be respectful and concise.",
      casual: "Write in a casual, friendly tone. Like messaging a colleague, not a stranger.",
      bold: "Write in a bold, confident tone. Be direct and assertive. Stand out.",
      curious: "Write in a curious, intriguing tone. Ask a thought-provoking question to hook them.",
    };

    let systemPrompt, userPrompt;

    if (followUp && previousEmail) {
      // Follow-up email generation
      const dayLater = sequenceNum === 2 ? "3 days" : "7 days";
      systemPrompt = `You are an expert cold email copywriter specializing in follow-up sequences.

Rules:
- Subject line first (on its own line, prefixed with "Subject: ")
- This is follow-up #${sequenceNum - 1}, sent ${dayLater} after the previous email
- Reference the previous email naturally (don't copy it)
- Keep under 80 words
- Add new value or a different angle
- Be shorter than the original email
- Include one clear call-to-action
- ${toneGuide[tone] || tone || toneGuide.professional}
- Do NOT use placeholder brackets like [Name]`;

      userPrompt = `Write follow-up email #${sequenceNum - 1} to the ${role} at ${company}.
      
I'm offering: ${product}

Previous email I sent:
${previousEmail}

Write a shorter follow-up that adds new value or takes a different angle.`;
    } else {
      // Initial email generation
      systemPrompt = `You are an expert cold email copywriter. You write short, punchy cold emails that get replies.

Rules:
- Subject line first (on its own line, prefixed with "Subject: ")
- Keep the email body under 100 words
- No fluff, no filler, no corporate jargon
- Personalize based on the company and role
- Include one clear call-to-action
- ${toneGuide[tone] || `Write in this style: ${tone}`}
- Do NOT use placeholder brackets like [Name] — write it as if ready to send
- Start with "Hi" or "Hey" followed by a natural greeting`;

      userPrompt = `Write a cold email to the ${role} at ${company}.

I'm offering: ${product}

Write the subject line and email body. Make it compelling and specific to their role and company.`;
    }

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
    console.error("Generation error:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to generate email. Please try again in a moment." },
      { status: 500 }
    );
  }
}
