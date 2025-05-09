"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResumeUploader } from "@/components/resume-uploader"
import { ResumeAnalysis } from "@/components/resume-analysis"
import { JobRecommendations } from "@/components/job-recommendations"
import { CourseRecommendations } from "@/components/course-recommendations"
import { LayoutDashboard, Sparkles, FileText, BookOpen, BriefcaseIcon } from "lucide-react"
import type { ResumeData } from "@/lib/types"

export default function Dashboard() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)

  const handleResumeAnalyzed = (data: ResumeData) => {
    setResumeData(data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 pt-16 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <LayoutDashboard className="mr-2 h-6 w-6" />
                Dashboard
              </h1>
              <p className="text-blue-100 mt-1">
                Analyze your resume and get personalized recommendations
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="text-white text-sm">
                Welcome to <span className="font-bold">SkillBridge</span>
              </span>
              <Sparkles className="h-4 w-4 text-yellow-300" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 -mt-6">
        <Card className="border-none shadow-lg mb-8">
          <CardContent className="p-0">
            <Tabs defaultValue="upload" className="w-full">
              <div className="bg-white rounded-t-lg border-b">
                <div className="container p-4">
                  <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 bg-gray-100 p-1">
                    <TabsTrigger value="upload" className="data-[state=active]:bg-white flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Upload Resume</span>
                    </TabsTrigger>
                    <TabsTrigger value="analysis" disabled={!resumeData} className="data-[state=active]:bg-white flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Analysis</span>
                    </TabsTrigger>
                    <TabsTrigger value="jobs" disabled={!resumeData} className="data-[state=active]:bg-white flex items-center gap-2">
                      <BriefcaseIcon className="h-4 w-4" />
                      <span>Jobs</span>
                    </TabsTrigger>
                    <TabsTrigger value="courses" disabled={!resumeData} className="data-[state=active]:bg-white flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Courses</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="p-4 md:p-6">
                <TabsContent value="upload" className="m-0">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold">Upload Your Resume</h2>
                      <p className="text-gray-500">Upload your resume in PDF format to get personalized recommendations.</p>
                    </div>
                    <ResumeUploader onResumeAnalyzed={handleResumeAnalyzed} />
                  </div>
                </TabsContent>

                <TabsContent value="analysis" className="m-0">
                  {resumeData && <ResumeAnalysis data={resumeData} />}
                </TabsContent>

                <TabsContent value="jobs" className="m-0">
                  {resumeData && <JobRecommendations data={resumeData} />}
                </TabsContent>

                <TabsContent value="courses" className="m-0">
                  {resumeData && <CourseRecommendations data={resumeData} />}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resume Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Our AI analyzes your resume to identify key skills, experience level, and areas for improvement.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                <BriefcaseIcon className="h-5 w-5" />
                Job Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Get personalized job recommendations based on your skills and experience level.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-purple-700 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Skill Development
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Discover courses and resources to help you develop the skills employers are looking for.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
