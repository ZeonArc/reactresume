"use client";

import { useState, useEffect } from "react";
import { PageTransition } from "@/components/page-transition";
import { AnimatedCard } from "@/components/ui/animated-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Briefcase, Building, MapPin, Calendar, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Sample job data
const initialJobs = [
  {
    title: "Frontend Developer",
    company: "Tech Solutions Inc.",
    location: "New York, NY (Remote Available)",
    type: "Full-time",
    salary: "$90,000 - $120,000",
    posted: "2 days ago",
    description: "We're looking for a skilled Frontend Developer to join our team. You'll be responsible for building responsive and interactive web applications using React and Next.js.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "UI/UX"],
    link: "https://example.com/jobs/frontend-developer"
  },
  {
    title: "Full Stack Engineer",
    company: "Growth Startup",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$100,000 - $140,000",
    posted: "1 week ago",
    description: "Join our fast-growing team as a Full Stack Engineer. You'll work on both frontend and backend development using modern JavaScript frameworks.",
    skills: ["React", "Node.js", "Express", "MongoDB", "AWS"],
    link: "https://example.com/jobs/fullstack-engineer"
  },
  {
    title: "UI/UX Designer",
    company: "Creative Labs",
    location: "Remote",
    type: "Contract",
    salary: "$75 - $95/hour",
    posted: "3 days ago",
    description: "We're seeking a talented UI/UX Designer to create beautiful and intuitive user interfaces. You'll collaborate with developers to bring designs to life.",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility"],
    link: "https://example.com/jobs/ui-ux-designer"
  },
  {
    title: "DevOps Engineer",
    company: "Enterprise Solutions",
    location: "Boston, MA (Hybrid)",
    type: "Full-time",
    salary: "$110,000 - $150,000",
    posted: "5 days ago",
    description: "Looking for an experienced DevOps Engineer to improve our CI/CD pipelines and cloud infrastructure management.",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
    link: "https://example.com/jobs/devops-engineer"
  }
];

export default function JobsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs] = useState(initialJobs);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-2">Job Recommendations</h1>
          <p className="text-lg text-gray-600">
            Discover job opportunities that match your skills and experience.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <LoadingSpinner size="lg" text="Finding job matches..." />
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <AnimatedCard 
                key={job.title + job.company} 
                delayOrder={index} 
                className="overflow-hidden"
              >
                <div className="p-1">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building className="h-4 w-4 mr-1" />
                        <span>{job.company}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end mt-2 md:mt-0">
                      <span className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs font-medium">
                        {job.salary}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Posted {job.posted}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-start mb-2">
                      <MapPin className="h-4 w-4 mr-1 text-gray-600 mt-1" />
                      <span className="text-gray-700">{job.location}</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <Briefcase className="h-4 w-4 mr-1 text-gray-600" />
                      <span className="text-gray-700">{job.type}</span>
                    </div>
                    <p className="text-gray-600">{job.description}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span 
                          key={skill} 
                          className="bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button asChild variant="outline" className="flex items-center gap-1">
                      <a href={job.link} target="_blank" rel="noopener noreferrer">
                        <span>Apply Now</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
} 