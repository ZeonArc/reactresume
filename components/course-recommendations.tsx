"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ExternalLink, BookOpen, Clock, Star, RefreshCw } from "lucide-react"
import { getCourseRecommendations } from "@/lib/course-service"
import type { ResumeData, Course } from "@/lib/types"

interface CourseRecommendationsProps {
  data: ResumeData
}

export function CourseRecommendations({ data }: CourseRecommendationsProps) {
  const [courseCount, setCourseCount] = useState(5)
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const courseResults = await getCourseRecommendations(data.likelyField, courseCount)
      setCourses(courseResults)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load courses automatically when component mounts or count changes
  useEffect(() => {
    fetchCourses()
  }, [data.likelyField, courseCount])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Course Recommendations</span>
            {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />}
          </CardTitle>
          <CardDescription>Courses to help you improve your skills in {data.likelyField}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Number of Recommendations</label>
            <div className="pt-2">
              <Slider
                value={[courseCount]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => setCourseCount(value[0])}
              />
              <div className="mt-1 text-right text-sm">{courseCount} courses</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map((course, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{course.name}</h3>
                    <div className="flex items-center text-muted-foreground">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{course.provider}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  </div>

                  <div className="flex items-center">
                    <Button variant="outline" className="w-full md:w-auto" asChild>
                      <a href={course.link} target="_blank" rel="noopener noreferrer">
                        View Course
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !isLoading && (
        <Card className="bg-gray-50">
          <CardContent className="p-6 text-center text-gray-500">
            No courses found. Try adjusting the number of recommendations.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
