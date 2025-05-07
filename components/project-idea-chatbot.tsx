"use client"

import type React from "react"
import type { ResumeData } from "@/lib/types"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SendIcon, BotIcon, UserIcon } from "lucide-react"

type Message = {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ProjectIdeaChatbotProps {
  resumeData?: ResumeData
}

export function ProjectIdeaChatbot({ resumeData }: ProjectIdeaChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! I can suggest project ideas based on your skills or domain. What technology or field are you interested in?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Suggested skills based on resume data
  const suggestedSkills = resumeData?.skills?.slice(0, 3) || []

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim()) return
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }
    
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)
    
    // Generate response after a short delay
    setTimeout(() => {
      respondToMessage(input)
      setIsTyping(false)
    }, 1000)
  }
  
  const respondToMessage = (message: string) => {
    const lowerMessage = message.toLowerCase()
    let response = ""
    
    // Check for keywords in the message
    if (lowerMessage.includes("react") || lowerMessage.includes("reactjs")) {
      response = generateProjectIdeas("react")
    } else if (lowerMessage.includes("javascript") || lowerMessage.includes("js")) {
      response = generateProjectIdeas("javascript")
    } else if (lowerMessage.includes("python")) {
      response = generateProjectIdeas("python")
    } else if (lowerMessage.includes("node") || lowerMessage.includes("nodejs")) {
      response = generateProjectIdeas("nodejs")
    } else if (lowerMessage.includes("java")) {
      response = generateProjectIdeas("java")
    } else if (lowerMessage.includes("data science") || lowerMessage.includes("datascience")) {
      response = generateProjectIdeas("datascience")
    } else if (lowerMessage.includes("machine learning") || lowerMessage.includes("ml")) {
      response = generateProjectIdeas("machinelearning")
    } else if (lowerMessage.includes("mobile") || lowerMessage.includes("app")) {
      response = generateProjectIdeas("mobile")
    } else if (lowerMessage.includes("web")) {
      response = generateProjectIdeas("web")
    } else {
      response = "I don't have specific project ideas for that skill or domain yet. Try asking about React, JavaScript, Python, Node.js, Java, Data Science, Machine Learning, Mobile or Web development."
    }
    
    const botMessage: Message = {
      id: Date.now().toString(),
      text: response,
      sender: "bot",
      timestamp: new Date(),
    }
    
    setMessages((prev) => [...prev, botMessage])
  }
  
  const generateProjectIdeas = (skill: string): string => {
    const projectIdeas: Record<string, string[]> = {
      react: [
        "Build a task management application with drag-and-drop functionality",
        "Create a real-time dashboard for monitoring data using React and WebSockets",
        "Develop a portfolio website with animations and transitions using Framer Motion",
        "Build a recipe finder app that uses a food API and allows users to save favorites"
      ],
      javascript: [
        "Create a browser extension that enhances productivity",
        "Build an interactive data visualization tool using D3.js",
        "Develop a JavaScript-based game like Tetris or Snake",
        "Create a custom video player with advanced features"
      ],
      python: [
        "Build a web scraper to collect and analyze data from websites",
        "Create a personal finance tracker with data visualization",
        "Develop a chatbot using natural language processing",
        "Build an automated file organizer for your desktop"
      ],
      nodejs: [
        "Create a REST API for a blog with authentication and authorization",
        "Build a real-time chat application using Socket.io",
        "Develop a content management system (CMS) for a specific industry",
        "Create a microservice architecture for an e-commerce platform"
      ],
      java: [
        "Build an Android app that uses device sensors",
        "Create a desktop application for managing personal inventory",
        "Develop a scheduling application for businesses",
        "Build a multi-threaded file processing utility"
      ],
      datascience: [
        "Analyze social media sentiment around a specific topic",
        "Build a recommendation system based on user behavior",
        "Create a predictive model for stock prices",
        "Develop a data visualization dashboard for a public dataset"
      ],
      machinelearning: [
        "Build an image classification model to identify objects",
        "Create a natural language processing tool for text summarization",
        "Develop a recommendation system for movies or music",
        "Build a predictive model for time series data"
      ],
      mobile: [
        "Create a fitness tracking app that integrates with wearable devices",
        "Build a location-based social networking app",
        "Develop a mobile e-commerce app with AR features for product visualization",
        "Create a photo editing app with custom filters"
      ],
      web: [
        "Build a personal portfolio website with a custom CMS",
        "Create a SaaS application for a specific business need",
        "Develop a progressive web app (PWA) for offline functionality",
        "Build a web-based collaborative tool for teams"
      ]
    }
    
    const ideas = projectIdeas[skill] || projectIdeas.web
    return `Here are some project ideas for ${skill}:\n\n• ${ideas.join('\n• ')}\n\nWould you like more suggestions or have another skill in mind?`
  }
  
  const handleSuggestedSkill = (skill: string) => {
    setInput(skill)
    const userMessage: Message = {
      id: Date.now().toString(),
      text: skill,
      sender: "user",
      timestamp: new Date(),
    }
    
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)
    
    // Generate response after a short delay
    setTimeout(() => {
      respondToMessage(skill)
      setIsTyping(false)
    }, 1000)
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BotIcon className="h-5 w-5 text-rose-500" />
          Project Idea Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-rose-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === "user" ? (
                    <UserIcon className="h-4 w-4" />
                  ) : (
                    <BotIcon className="h-4 w-4" />
                  )}
                  <span className="text-xs font-medium">
                    {message.sender === "user" ? "You" : "Assistant"}
                  </span>
                </div>
                <div className="whitespace-pre-line">{message.text}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-900">
                <div className="flex items-center gap-2 mb-1">
                  <BotIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">Assistant</span>
                </div>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-75"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {suggestedSkills.length > 0 && messages.length < 3 && (
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Suggested:</span>
            {suggestedSkills.map((skill) => (
              <Button
                key={skill}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedSkill(skill)}
                className="text-xs"
              >
                {skill}
              </Button>
            ))}
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about project ideas for a specific skill..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button type="submit" disabled={!input.trim() || isTyping}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 