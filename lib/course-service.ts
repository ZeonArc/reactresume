"use client"

import type { Course } from "./types"

// This is a mock service that simulates course recommendations
// In a real application, this would call a backend API

export async function getCourseRecommendations(field: string, limit = 5): Promise<Course[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock course data
  const mockCourses: Course[] = [
    {
      name: "Modern React with Hooks and Context",
      provider: "Udemy",
      link: "#",
      duration: "24 hours",
      rating: 4.8,
      description: "Learn to build modern React applications using hooks, context API, and more.",
    },
    {
      name: "Advanced JavaScript Concepts",
      provider: "Coursera",
      link: "#",
      duration: "32 hours",
      rating: 4.7,
      description: "Deep dive into advanced JavaScript concepts including closures, prototypes, and async patterns.",
    },
    {
      name: "Next.js & React - The Complete Guide",
      provider: "Udemy",
      link: "#",
      duration: "40 hours",
      rating: 4.9,
      description: "Build full-stack applications with React, Next.js, and related technologies.",
    },
    {
      name: "TypeScript for Professionals",
      provider: "Frontend Masters",
      link: "#",
      duration: "18 hours",
      rating: 4.6,
      description: "Master TypeScript and learn how to build type-safe applications.",
    },
    {
      name: "CSS Grid and Flexbox for Responsive Layouts",
      provider: "LinkedIn Learning",
      link: "#",
      duration: "12 hours",
      rating: 4.5,
      description: "Learn modern CSS techniques to create responsive and flexible layouts.",
    },
    {
      name: "Node.js API Masterclass",
      provider: "Udemy",
      link: "#",
      duration: "35 hours",
      rating: 4.7,
      description: "Build RESTful APIs with Node.js, Express, and MongoDB.",
    },
    {
      name: "Web Performance Optimization",
      provider: "Google Developers",
      link: "#",
      duration: "15 hours",
      rating: 4.4,
      description: "Learn techniques to optimize web applications for better performance.",
    },
    {
      name: "Full Stack Web Development Bootcamp",
      provider: "Codecademy",
      link: "#",
      duration: "80 hours",
      rating: 4.8,
      description: "Comprehensive course covering frontend and backend web development.",
    },
    {
      name: "React Testing with Jest and React Testing Library",
      provider: "TestingJS",
      link: "#",
      duration: "16 hours",
      rating: 4.6,
      description: "Learn how to write tests for your React applications.",
    },
    {
      name: "GraphQL with Apollo Client",
      provider: "egghead.io",
      link: "#",
      duration: "10 hours",
      rating: 4.5,
      description: "Build efficient APIs with GraphQL and integrate them with React using Apollo Client.",
    },
  ]

  // Return limited number of courses
  return mockCourses.slice(0, limit)
}
