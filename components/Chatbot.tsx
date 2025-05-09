"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessage, getChatHistory, sendMessage } from "@/lib/chat-service";
import { BotIcon, SendIcon, UserIcon, XIcon, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const SkillGPT = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadChatHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory();
      
      // If history is empty, add a welcome message
      if (history.length === 0) {
        setMessages([{
          message: "Hi there! I'm SkillGPT, your career assistant. I can help you with resume advice, job searching, and career development. How can I assist you today?",
          is_bot: true,
        }]);
      } else {
        setMessages(history);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      // Add default welcome message on error
      setMessages([{
        message: "Hi there! I'm SkillGPT, your career assistant. I can help you with resume advice, job searching, and career development. How can I assist you today?",
        is_bot: true,
      }]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Optimistically add user message to UI
    const userMessage: ChatMessage = {
      message: input,
      is_bot: false,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message to API
      const botResponse = await sendMessage(input.trim());
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

  return (
    <>
      {/* Chat Button */}
      <Button
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <XIcon size={24} className="text-white" />
        ) : (
          <div className="flex items-center justify-center">
            <Sparkles size={24} className="text-white" />
          </div>
        )}
      </Button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 w-80 md:w-[400px] h-[500px] z-50"
          >
            <Card className="shadow-xl border-2 h-full flex flex-col overflow-hidden rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4">
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="mr-2" size={18} />
                  SkillGPT
                  <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">AI Assistant</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
              <CardFooter className="p-3 border-t bg-white">
                <form onSubmit={handleSendMessage} className="w-full flex gap-2">
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SkillGPT; 