// Constant mock user for all operations
const GUEST_USER = {
  id: 'guest-user-123',
  email: 'guest@example.com',
  firstName: 'Guest',
  lastName: 'User'
};

export interface ChatMessage {
  id?: string;
  user_id?: string;
  message: string;
  is_bot: boolean;
  created_at?: string;
}

interface ChatMessageFormat {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are a helpful career assistant specializing in resume advice, job searching, 
and career development. Help users improve their resumes, find job opportunities, 
and develop skills for their career. Be concise, helpful, and professional. 
Provide specific, actionable advice when possible.`;

// Mock chat history for guest user - using mutable array with const declaration
const guestChatHistory: ChatMessage[] = [];

export async function sendMessage(userMessage: string): Promise<ChatMessage> {
  try {
    // Always use guest user - no login required
    const userId = GUEST_USER.id;
    
    // Create user message
    const userChatMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      user_id: userId,
      message: userMessage,
      is_bot: false,
      created_at: new Date().toISOString()
    };
    
    // Add to in-memory chat history
    guestChatHistory.push(userChatMessage);
    
    // Get the last 10 messages
    const history = guestChatHistory.slice(-10);
    
    // Format the chat history for the API
    const formattedHistory: ChatMessageFormat[] = history.map(msg => ({
      role: msg.is_bot ? 'assistant' as const : 'user' as const,
      content: msg.message
    }));
    
    // Add system prompt
    const messages: ChatMessageFormat[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...formattedHistory
    ];
    
    // Call API (implementation depends on your backend setup)
    const botResponse = await generateBotResponse(messages);
    
    // Create bot message
    const botChatMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      user_id: userId,
      message: botResponse,
      is_bot: true,
      created_at: new Date().toISOString()
    };
    
    // Add bot message to in-memory history
    guestChatHistory.push(botChatMessage);
    
    return botChatMessage;
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error;
  }
}

export async function getChatHistory(limit = 50): Promise<ChatMessage[]> {
  // Return in-memory chat history for guest user
  return guestChatHistory.slice(-limit);
}

// This function calls the Google Gemini API through our backend endpoint
async function generateBotResponse(messages: ChatMessageFormat[]): Promise<string> {
  try {
    console.log("Calling chat API with messages:", JSON.stringify(messages).slice(0, 100) + "...");
    
    // Fallback to simulated responses if API call fails
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });
      
      console.log("API response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API responded with status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      return data.message;
    } catch (apiError) {
      console.error("API call failed:", apiError);
      
      // Fallback to simulated responses when API fails
      console.log("Using fallback simulated responses");
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return a simulated response based on the last user message
      const lastUserMessage = messages.findLast(m => m.role === 'user')?.content.toLowerCase() || '';
      
      if (lastUserMessage.includes('resume')) {
        return "To improve your resume, focus on quantifiable achievements rather than just listing responsibilities. Use action verbs and include metrics where possible. Tailor your resume to each job application by matching keywords from the job description.";
      } else if (lastUserMessage.includes('interview')) {
        return "Prepare for interviews by researching the company, practicing common questions, and preparing stories that demonstrate your skills. Use the STAR method (Situation, Task, Action, Result) to structure your answers about past experiences.";
      } else if (lastUserMessage.includes('skill') || lastUserMessage.includes('learn')) {
        return "To enhance your marketability, consider learning in-demand skills like data analysis, cloud computing, or UX design. Look for online courses on platforms like Coursera, Udemy, or LinkedIn Learning that offer certificates upon completion.";
      } else {
        return "I'm here to help with your career questions. You can ask about resume writing, job search strategies, interview preparation, skill development, or career transitions.";
      }
    }
  } catch (error) {
    console.error("Error generating bot response:", error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
  }
} 