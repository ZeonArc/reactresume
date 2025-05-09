"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessage, getChatHistory, sendMessage } from "@/lib/chat-service";
import { BotIcon, SendIcon, UserIcon, Sparkles, Trash2, Code, BookOpen, FileText, LightbulbIcon, Share2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SkillGPTPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory();
      
      // If history is empty, add a welcome message
      if (history.length === 0) {
        setMessages([{
          message: "Hi there! I&apos;m SkillGPT, your career and project assistant. I can help you with resume advice, job searching, career development, and building projects. What would you like help with today?",
          is_bot: true,
        }]);
      } else {
        setMessages(history);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      // Add default welcome message on error
      setMessages([{
        message: "Hi there! I&apos;m SkillGPT, your career and project assistant. I can help you with resume advice, job searching, career development, and building projects. What would you like help with today?",
        is_bot: true,
      }]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent | null, promptText?: string) => {
    if (e) e.preventDefault();
    
    const messageText = promptText || input;
    if (!messageText.trim() || isLoading) return;

    // Optimistically add user message to UI
    const userMessage: ChatMessage = {
      message: messageText.trim(),
      is_bot: false,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message to API
      const botResponse = await sendMessage(messageText.trim());
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Show error message
      const errorMessage: ChatMessage = {
        message: "Sorry, I'm having trouble responding right now. Please try again later.",
        is_bot: true,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(null, prompt);
  };

  const clearConversation = async () => {
    // Show confirmation message before clearing
    const confirmed = window.confirm("Are you sure you want to clear the conversation history?");
    if (!confirmed) return;
    
    try {
      // In a real app, you'd also clear the conversation from the database
      // For now, we'll just reset to the welcome message
      setMessages([{
        message: "Hi there! I&apos;m SkillGPT, your career and project assistant. I can help you with resume advice, job searching, career development, and building projects. What would you like help with today?",
        is_bot: true,
      }]);
    } catch (error) {
      console.error("Failed to clear conversation:", error);
    }
  };

  const shareConversation = async () => {
    // Only share if we have messages to share
    if (messages.length <= 1) return;
    
    try {
      // Format the conversation for sharing
      const formattedConversation = messages.map(msg => {
        const role = msg.is_bot ? "SkillGPT" : "You";
        return `${role}: ${msg.message}`;
      }).join('\n\n');
      
      const shareText = `My conversation with SkillGPT:\n\n${formattedConversation}\n\nTry SkillGPT at yourdomain.com/skillgpt`;
      
      // Try to use the native sharing API if available
      if (navigator.share) {
        await navigator.share({
          title: 'My SkillGPT Conversation',
          text: shareText
        });
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Failed to share conversation:", error);
    }
  };

  // Quick suggestion prompts
  const suggestedPrompts = [
    {
      text: "How do I improve my resume?",
      icon: <FileText size={14} />
    },
    {
      text: "Help me build a React project",
      icon: <Code size={14} />
    },
    {
      text: "What skills should I learn?",
      icon: <BookOpen size={14} />
    },
    {
      text: "Give me project ideas",
      icon: <LightbulbIcon size={14} />
    }
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-20 pb-10 min-h-screen flex flex-col">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">SkillGPT</h1>
        </div>
        <p className="text-gray-600 max-w-md mx-auto">
          Your AI assistant for career advice, resume tips, and help with building projects
        </p>
      </div>
      
      <Card className="flex-1 flex flex-col rounded-xl shadow-md border-2 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 flex flex-row justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <Sparkles className="mr-2" size={20} />
            Chat with SkillGPT
            <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">AI Assistant</span>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full"
                    onClick={shareConversation}
                    disabled={messages.length <= 1}
                  >
                    <Share2 size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copied ? 'Copied to clipboard!' : 'Share conversation'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full"
                    onClick={clearConversation}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-[400px]">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground h-full flex flex-col justify-center">
              <BotIcon className="mx-auto mb-2 text-blue-500" size={36} />
              <p>Loading conversation...</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  msg.is_bot ? "" : "flex-row-reverse"
                }`}
              >
                <Avatar className={`h-8 w-8 ${
                  msg.is_bot 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700" 
                    : "bg-gray-200"
                }`}>
                  <AvatarFallback>
                    {msg.is_bot ? (
                      <Sparkles size={14} className="text-white" />
                    ) : (
                      <UserIcon size={14} className="text-gray-700" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-2xl py-2 px-3 max-w-[85%] ${
                    msg.is_bot
                      ? "bg-white border border-gray-200 shadow-sm"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        
        {/* Quick suggestion prompts */}
        {messages.length > 0 && messages.length < 3 && (
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex overflow-x-auto gap-2 scrollbar-hide">
            {suggestedPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="whitespace-nowrap rounded-full bg-white text-xs py-1 px-3 h-auto flex items-center border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                onClick={() => handlePromptClick(prompt.text)}
              >
                <span className="mr-1.5">{prompt.icon}</span>
                {prompt.text}
              </Button>
            ))}
          </div>
        )}
        
        <CardFooter className="p-4 border-t bg-white">
          <form onSubmit={(e) => handleSendMessage(e)} className="w-full flex gap-2">
            <Input
              type="text"
              placeholder={isLoading ? "SkillGPT is thinking..." : "Type a message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 border-gray-300 focus:border-blue-500 rounded-full"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
            >
              <SendIcon size={18} />
            </Button>
          </form>
        </CardFooter>
      </Card>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center">What SkillGPT Can Help You With</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 hover:shadow-md transition-shadow border hover:border-blue-200 cursor-pointer" onClick={() => handlePromptClick("Help me improve my resume")}>
            <h3 className="font-medium flex items-center"><Sparkles size={16} className="text-blue-500 mr-2" /> Resume Help</h3>
            <p className="text-sm text-gray-600 mt-1">Ask for resume review tips, formatting advice, or content suggestions</p>
          </Card>
          <Card className="p-4 hover:shadow-md transition-shadow border hover:border-blue-200 cursor-pointer" onClick={() => handlePromptClick("I want to build a web project")}>
            <h3 className="font-medium flex items-center"><Sparkles size={16} className="text-blue-500 mr-2" /> Project Building</h3>
            <p className="text-sm text-gray-600 mt-1">Get help with project ideas, implementation guidance, or technical issues</p>
          </Card>
          <Card className="p-4 hover:shadow-md transition-shadow border hover:border-blue-200 cursor-pointer" onClick={() => handlePromptClick("What career path should I take?")}>
            <h3 className="font-medium flex items-center"><Sparkles size={16} className="text-blue-500 mr-2" /> Career Advice</h3>
            <p className="text-sm text-gray-600 mt-1">Discuss career paths, interview preparation, or skill development</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SkillGPTPage; 