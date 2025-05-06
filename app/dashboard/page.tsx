"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserSession, logout } from "@/lib/auth"
import { ResumeUploader } from "@/components/resume-uploader"
import { ResumeAnalysis } from "@/components/resume-analysis"
import { JobRecommendations } from "@/components/job-recommendations"
import { CourseRecommendations } from "@/components/course-recommendations"
import type { User } from "@/lib/types"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [resumeData, setResumeData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await getUserSession()
        if (userData) {
          setUser(userData)
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Session check failed:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [router])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const handleResumeAnalyzed = (data: any) => {
    setResumeData(data)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-rose-500 to-orange-500 py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">SkillBridge</h1>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-white">
                Welcome, {user.firstName} {user.lastName}
              </span>
            )}
            <Button variant="outline" className="bg-white text-rose-500 hover:bg-gray-100" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upload" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload Resume</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!resumeData}>
              Analysis
            </TabsTrigger>
            <TabsTrigger value="jobs" disabled={!resumeData}>
              Job Recommendations
            </TabsTrigger>
            <TabsTrigger value="courses" disabled={!resumeData}>
              Course Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Resume</CardTitle>
                <CardDescription>Upload your resume in PDF format to get personalized recommendations.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResumeUploader onResumeAnalyzed={handleResumeAnalyzed} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {resumeData && <ResumeAnalysis data={resumeData} />}
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            {resumeData && <JobRecommendations data={resumeData} />}
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            {resumeData && <CourseRecommendations data={resumeData} />}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
