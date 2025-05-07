import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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',
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    });

    return NextResponse.json({ 
      response: chatCompletion.choices[0].message,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Error processing your request' },
      { status: 500 }
    );
  }
} 