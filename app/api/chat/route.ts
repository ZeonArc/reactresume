import { NextResponse } from 'next/server';
import gemini from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    console.log("Chat API route called");
    
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format:", messages);
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }
    
    console.log(`Processing ${messages.length} messages`);
    
    // Convert messages format from OpenAI to Gemini
    const formattedMessages = messages.map(msg => {
      if (msg.role === 'system') {
        // Gemini doesn't have system messages, so we'll make it a model prompt
        return { role: 'user', parts: [{ text: `You're a helpful AI assistant. Please follow these instructions for all your responses: ${msg.content}`}] };
      } else {
        // Convert user/assistant to Gemini format
        return {
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        };
      }
    });
    
    // Create a chat session with Gemini 2.0 Flash
    try {
      console.log("Calling Gemini 2.0 Flash API");
      const chat = gemini.model.startChat({
        history: formattedMessages.slice(0, -1), // All but the last message
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.4, // Lower temperature for more focused responses
          topK: 40,
          topP: 0.8,
        }
      });
      
      // Get the last message which should be sent to the chat
      const lastMessage = formattedMessages[formattedMessages.length - 1];
      
      // Generate response
      const result = await chat.sendMessage(lastMessage.parts[0].text);
      const response = result.response.text();
      
      console.log("Gemini 2.0 Flash response received");
      
      return NextResponse.json({ message: response });
    } catch (apiError) {
      console.error("Gemini API error:", apiError);
      return NextResponse.json(
        { error: `Gemini API error: ${apiError instanceof Error ? apiError.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Chat API error:', error);
    // Format error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';
      
    return NextResponse.json(
      { error: `Failed to process request: ${errorMessage}` },
      { status: 500 }
    );
  }
} 