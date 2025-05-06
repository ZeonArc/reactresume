import { NextResponse } from 'next/server';
import openai from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const resumeText = formData.get('resumeText') as string;
    
    if (!resumeText) {
      return NextResponse.json(
        { error: 'Missing resume text' },
        { status: 400 }
      );
    }
    
    // Use OpenAI to extract skills and information
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful resume parser. Extract key information from resumes.' 
        },
        { 
          role: 'user', 
          content: `Extract the following information from this resume in JSON format:
          - name
          - email
          - phone
          - education (array of objects with degree, institution, year)
          - experience (array of objects with title, company, duration, description)
          - skills (array of technical skills)
          - domain (what domain/industry does this person specialize in)
          
          Resume text: ${resumeText}`
        }
      ],
      model: 'gpt-3.5-turbo',
      response_format: { type: 'json_object' }
    });
    
    const parsedData = JSON.parse(completion.choices[0].message.content || '{}');
    
    // Store the parsed resume in Supabase
    const { error } = await supabase
      .from('resumes')
      .insert({
        resume_text: resumeText,
        parsed_data: parsedData
      });
      
    if (error) {
      console.error('Error saving to Supabase:', error);
    }
    
    return NextResponse.json({ parsedData });
  } catch (error) {
    console.error('Resume parsing error:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    );
  }
} 