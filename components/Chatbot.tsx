import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I can help you with project ideas based on your skills or provide guidance on building projects. Please paste your resume text and let me know what you need help with.'
    }
  ]);
  const [resumeText, setResumeText] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [requestType, setRequestType] = useState('project_ideas');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async () => {
    if (!resumeText || skills.length === 0) {
      return;
    }

    // Add user message
    const userPrompt = `Request: ${requestType === 'project_ideas' ? 'Suggest project ideas' : 'Help me build a project'} based on my skills: ${skills.join(', ')}`;
    
    setMessages(prev => [...prev, { role: 'user', content: userPrompt }]);
    setLoading(true);

    try {
      const systemMessage = 'You are a helpful career advisor and technical mentor.';
      const userPromptFull = `Based on these skills: ${skills.join(', ')} and this resume: "${resumeText}", 
      ${requestType === 'project_ideas' 
        ? 'suggest 3 project ideas that would showcase and improve these skills. For each project, provide a title, brief description, key technologies to use, and learning outcomes.' 
        : 'provide detailed guidance on how to build a project with these skills. Include steps, resources, and best practices.'}`;
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userPromptFull }
          ]
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response.content }]);
        
        // Store the conversation in Supabase (if needed)
        try {
          await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              skills,
              resumeText,
              requestType,
              response: data.response.content
            }),
          });
        } catch (error) {
          console.error('Error saving to database:', error);
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 space-y-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold text-center">Project Advisor Chatbot</h2>
      
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Resume Text</label>
        <Textarea 
          placeholder="Paste your resume text here..." 
          value={resumeText} 
          onChange={(e) => setResumeText(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Skills</label>
        <div className="flex space-x-2">
          <Input
            placeholder="Add a skill (e.g., React, Python)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button onClick={addSkill} type="button">Add</Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map(skill => (
            <div key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center text-sm">
              <span>{skill}</span>
              <button 
                onClick={() => removeSkill(skill)} 
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium">What would you like help with?</label>
        <Select value={requestType} onValueChange={setRequestType}>
          <SelectTrigger>
            <SelectValue placeholder="Select request type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="project_ideas">Suggest project ideas based on my skills</SelectItem>
            <SelectItem value="project_help">Help me build a project with my skills</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={handleSubmit} 
        disabled={loading || !resumeText || skills.length === 0}
        className="w-full"
      >
        {loading ? 'Thinking...' : 'Get Advice'}
      </Button>
      
      <div className="flex-1 overflow-y-auto border rounded-md p-4">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div 
              key={i} 
              className={`p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-100 ml-auto max-w-[80%]' 
                  : 'bg-gray-100 mr-auto max-w-[80%]'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 