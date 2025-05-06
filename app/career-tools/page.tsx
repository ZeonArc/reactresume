'use client';

import React, { useState } from 'react';
import Chatbot from '@/components/Chatbot';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Define proper interfaces for API responses
interface Job {
  job_title: string;
  employer_name: string;
  job_city: string;
  job_country: string;
  job_description: string;
  job_required_skills?: string[];
  job_apply_link: string;
}

interface Course {
  title: string;
  instructor?: string;
  description?: string;
  is_free: boolean;
  price?: string;
  url: string;
}

export default function CareerTools() {
  const [jobQuery, setJobQuery] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [courseQuery, setCourseQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  const searchJobs = async () => {
    if (!jobQuery) return;

    setIsLoadingJobs(true);
    try {
      const response = await fetch(`/api/jobs?query=${encodeURIComponent(jobQuery)}&location=${encodeURIComponent(jobLocation)}`);
      const data = await response.json();
      setJobs(data.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const searchCourses = async () => {
    if (!courseQuery) return;

    setIsLoadingCourses(true);
    try {
      const response = await fetch(`/api/courses?query=${encodeURIComponent(courseQuery)}`);
      const data = await response.json();
      setCourses(data.results || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Career Development Tools</h1>
      
      <Tabs defaultValue="chatbot" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="chatbot">Project Advisor</TabsTrigger>
          <TabsTrigger value="jobs">Job Search</TabsTrigger>
          <TabsTrigger value="courses">Course Search</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chatbot" className="min-h-[600px]">
          <Chatbot />
        </TabsContent>
        
        <TabsContent value="jobs">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Job title, keywords, or company"
                value={jobQuery}
                onChange={(e) => setJobQuery(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Location"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                className="flex-1"
              />
              <Button onClick={searchJobs} disabled={isLoadingJobs}>
                {isLoadingJobs ? 'Searching...' : 'Search Jobs'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-xl">{job.job_title}</CardTitle>
                    <CardDescription>
                      <span className="font-medium">{job.employer_name}</span> · {job.job_city}, {job.job_country}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">{job.job_description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.job_required_skills?.slice(0, 5).map((skill: string, i: number) => (
                        <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => window.open(job.job_apply_link, '_blank')}>
                      Apply Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {jobs.length === 0 && !isLoadingJobs && jobQuery && (
                <div className="col-span-2 text-center p-8">
                  <p>No jobs found. Try different keywords.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="courses">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Search for courses (e.g., React, Python, Data Science)"
                value={courseQuery}
                onChange={(e) => setCourseQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={searchCourses} disabled={isLoadingCourses}>
                {isLoadingCourses ? 'Searching...' : 'Search Courses'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    <CardDescription>{course.instructor || 'Unknown instructor'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">{course.description || 'No description available'}</p>
                    <div className="mt-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {course.is_free ? 'Free' : `${course.price || 'Paid'}`}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => window.open(course.url, '_blank')}>
                      View Course
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {courses.length === 0 && !isLoadingCourses && courseQuery && (
                <div className="col-span-3 text-center p-8">
                  <p>No courses found. Try different keywords.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 