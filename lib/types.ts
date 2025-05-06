export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
}

export interface ResumeData {
  name: string
  email: string
  phone: string
  skills: string[]
  experienceLevel: string
  score: number
  targetField: string
  matchConfidence: number
  recommendedSkills: string[]
}

export interface Job {
  title: string
  company: string
  location: string
  url: string
  workMode: string
  salary: number
}

export interface Course {
  name: string
  provider: string
  link: string
  duration: string
  rating: number
  description: string
}
