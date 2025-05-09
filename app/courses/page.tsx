"use client";

import { useState, useEffect } from "react";
import { PageTransition } from "@/components/page-transition";
import { CardTitle } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Star, StarHalf } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

// Sample course data
const initialCourses = [
  {
    name: "Complete React Developer",
    provider: "Udemy",
    link: "https://www.udemy.com/course/complete-react-developer-zero-to-mastery/",
    duration: "40 hours",
    rating: 4.7,
    description: "Learn React from A to Z: Hooks, Context API, Redux, GraphQL, React Router, and more!"
  },
  {
    name: "Node.js, Express & MongoDB",
    provider: "Coursera",
    link: "https://www.coursera.org/learn/node-express-mongodb",
    duration: "30 hours",
    rating: 4.5,
    description: "Build backend applications with Node.js and Express. Connect to MongoDB database."
  },
  {
    name: "Modern JavaScript",
    provider: "Frontend Masters",
    link: "https://frontendmasters.com/courses/javascript-new-hard-parts/",
    duration: "20 hours",
    rating: 4.8,
    description: "Learn modern JavaScript from fundamentals to advanced concepts."
  },
  {
    name: "Next.js & React - Complete Guide",
    provider: "Udemy",
    link: "https://www.udemy.com/course/nextjs-react-the-complete-guide/",
    duration: "25 hours",
    rating: 4.6,
    description: "Master Next.js and build production-ready, full-stack React applications."
  }
];

export default function CoursesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [courses] = useState(initialCourses);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    return stars;
  };

  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-2">Recommended Courses</h1>
          <p className="text-lg text-gray-600">
            Enhance your skills with these tailored course recommendations.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <LoadingSpinner size="lg" text="Loading course recommendations..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <AnimatedCard 
                key={course.name} 
                delayOrder={index} 
                className="h-full"
                header={
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{course.name}</CardTitle>
                      <p className="text-sm text-gray-500">{course.provider}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-medium">
                      {course.duration}
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  <p className="text-gray-600">{course.description}</p>
                  <div className="flex items-center space-x-1">
                    {renderRating(course.rating)}
                    <span className="ml-1 text-sm text-gray-600">{course.rating}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <a 
                    href={course.link}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    View Course →
                  </a>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
} 