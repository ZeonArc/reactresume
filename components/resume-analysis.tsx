"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Briefcase } from "lucide-react"

interface ResumeAnalysisProps {
  data: any
}

export function ResumeAnalysis({ data }: ResumeAnalysisProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resume Summary</CardTitle>
          <CardDescription>Overview of your resume analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Name</p>
              <p className="text-lg">{data.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Email</p>
              <p className="text-lg">{data.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Phone</p>
              <p className="text-lg">{data.phone || "Not detected"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Experience Level</p>
              <Badge className="bg-rose-500">{data.experienceLevel}</Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Resume Score</h3>
              <span className="text-2xl font-bold">{data.score}/100</span>
            </div>
            <Progress value={data.score} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {data.score < 50
                ? "Your resume needs significant improvement. Follow our recommendations to increase your score."
                : data.score < 80
                  ? "Your resume is good, but there's room for improvement."
                  : "Great job! Your resume is well-optimized."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detected Skills</CardTitle>
          <CardDescription>Skills extracted from your resume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill: string, index: number) => (
              <Badge key={index} variant="outline" className="bg-rose-50 text-rose-500 hover:bg-rose-100">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Target Field</CardTitle>
          <CardDescription>Based on your skills, we've identified your target field</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-rose-100 p-3">
              <Briefcase className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <p className="text-xl font-medium">{data.targetField}</p>
              <p className="text-sm text-muted-foreground">Matched with {data.matchConfidence}% confidence</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Skills</CardTitle>
          <CardDescription>Skills to learn to improve your employability in {data.targetField}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.recommendedSkills.map((skill: string, index: number) => (
              <Badge key={index} className="bg-green-100 text-green-700 hover:bg-green-200">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
