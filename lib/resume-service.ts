"use client"

import type { ResumeData } from "./types"

// This is a mock service that simulates resume analysis
// In a real application, this would call a backend API

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function analyzeResume(_formData: FormData): Promise<ResumeData> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // Mock resume analysis data
  const mockSkills = [
    "JavaScript",
    "React",
    "TypeScript",
    "Node.js",
    "HTML",
    "CSS",
    "Git",
    "REST API",
    "MongoDB",
    "Express",
  ]

  const mockRecommendedSkills = ["Next.js", "GraphQL", "AWS", "Docker", "CI/CD", "Jest", "Redux"]

  // Generate a random score between 60 and 95
  const score = Math.floor(Math.random() * 36) + 60

  // Mock analysis result
  const analysisResult: ResumeData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    skills: mockSkills,
    experienceLevel: "Intermediate",
    score: score,
    targetField: "Web Development",
    matchConfidence: 92,
    recommendedSkills: mockRecommendedSkills,
  }

  return analysisResult
}
