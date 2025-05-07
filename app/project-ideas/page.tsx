"use client"

import { useState } from "react"
import { ProjectIdeaChatbot } from "@/components/project-idea-chatbot"
import type { ResumeData } from "@/lib/types"

export default function ProjectIdeasPage() {
  // This would typically come from your application state or API
  // For demo purposes, we're using static data
  const [resumeData] = useState<ResumeData | undefined>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    skills: ["React", "TypeScript", "Node.js", "JavaScript", "HTML", "CSS"],
    experienceLevel: "Intermediate",
    score: 85,
    targetField: "Web Development",
    matchConfidence: 92,
    recommendedSkills: ["Next.js", "GraphQL", "AWS", "Docker", "CI/CD"],
  })

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Project Ideas Assistant</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <ProjectIdeaChatbot resumeData={resumeData} />
        </div>
        
        <div className="md:col-span-4">
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="text-xl font-semibold">How it works</h2>
            <p className="text-sm text-gray-600">
              Our Project Ideas Assistant uses your skills and interests to suggest projects
              that can help you improve your portfolio and gain practical experience.
            </p>
            
            <h3 className="text-lg font-semibold">Tips:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Ask for ideas in specific technologies like &quot;React&quot; or &quot;Python&quot;</li>
              <li>Mention your experience level for tailored suggestions</li>
              <li>Ask about project ideas for specific domains like &quot;Web Development&quot; or &quot;Data Science&quot;</li>
              <li>Try combining skills, like &quot;React and Node.js project ideas&quot;</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <h3 className="text-sm font-medium mb-2">Your Skills</h3>
              <div className="flex flex-wrap gap-2">
                {resumeData?.skills.map((skill) => (
                  <span key={skill} className="bg-rose-100 text-rose-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 