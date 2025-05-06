import { NextResponse } from 'next/server';
import openai from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { skills, resumeText, requestType } = await request.json();
    
    if (!skills || !resumeText || !requestType) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    let prompt = '';
    
    if (requestType === 'project_ideas') {
      prompt = `Based on these skills: ${skills.join(', ')} and this resume: "${resumeText}", 
      suggest 3 project ideas that would showcase and improve these skills. For each project, 
      provide a title, brief description, key technologies to use, and learning outcomes.`;
    } else if (requestType === 'project_help') {
      prompt = `Based on these skills: ${skills.join(', ')} and this resume: "${resumeText}", 
      provide detailed guidance on how to build a project with these skills. Include steps, 
      resources, and best practices.`;
    } else {
      return NextResponse.json(
        { error: 'Invalid request type' },
        { status: 400 }
      );
    }
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful career advisor and technical mentor.' },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-3.5-turbo',
    });
    
    const response = completion.choices[0].message.content;
    
    // Store the conversation in Supabase
    const { error } = await supabase
      .from('chatbot_conversations')
      .insert({
        skills,
        resume_text: resumeText,
        request_type: requestType,
        response
      });
      
    if (error) {
      console.error('Error saving to Supabase:', error);
    }
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 