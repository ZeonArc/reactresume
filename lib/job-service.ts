"use client"

import type { Job } from "./types"

// This is a mock service that simulates job recommendations
// In a real application, this would call a backend API

export async function getJobRecommendations(field: string, workMode = "All", minSalary = 0, limit = 6): Promise<Job[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock job data
  const mockJobs: Job[] = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      url: "#",
      workMode: "Remote",
      salary: 8500,
    },
    {
      title: "Full Stack Developer",
      company: "InnovateTech",
      location: "New York, NY",
      url: "#",
      workMode: "Hybrid",
      salary: 7200,
    },
    {
      title: "React Developer",
      company: "WebSolutions",
      location: "Austin, TX",
      url: "#",
      workMode: "On-site",
      salary: 6800,
    },
    {
      title: "JavaScript Engineer",
      company: "CodeMasters",
      location: "Seattle, WA",
      url: "#",
      workMode: "Remote",
      salary: 7500,
    },
    {
      title: "Frontend Architect",
      company: "DesignHub",
      location: "Boston, MA",
      url: "#",
      workMode: "Hybrid",
      salary: 9200,
    },
    {
      title: "UI Developer",
      company: "CreativeMinds",
      location: "Chicago, IL",
      url: "#",
      workMode: "On-site",
      salary: 5800,
    },
    {
      title: "Senior React Developer",
      company: "AppWorks",
      location: "Denver, CO",
      url: "#",
      workMode: "Remote",
      salary: 8000,
    },
    {
      title: "Frontend Team Lead",
      company: "TechInnovate",
      location: "Portland, OR",
      url: "#",
      workMode: "Hybrid",
      salary: 9500,
    },
  ]

  // Filter jobs based on criteria
  let filteredJobs = [...mockJobs]

  if (workMode !== "All") {
    filteredJobs = filteredJobs.filter((job) => job.workMode === workMode)
  }

  filteredJobs = filteredJobs.filter((job) => job.salary >= minSalary)

  // Return limited number of jobs
  return filteredJobs.slice(0, limit)
}
