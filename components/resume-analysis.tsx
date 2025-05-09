"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Briefcase, CheckCircle, ExternalLink, Award, Zap } from "lucide-react"
import type { ResumeData } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface ResumeAnalysisProps {
  data: ResumeData
}

export function ResumeAnalysis({ data }: ResumeAnalysisProps) {
  // Calculate score levels for visual indicators
  const isGoodScore = data.score >= 80;
  const isMediumScore = data.score >= 60 && data.score < 80;
  
  // Generate personalized feedback based on score
  const getScoreFeedback = () => {
    if (data.score >= 90) return "Excellent! Your resume is very well optimized.";
    if (data.score >= 80) return "Great job! Your resume is well optimized with room for minor improvements.";
    if (data.score >= 60) return "Your resume is good, but there's definite room for improvement.";
    return "Your resume needs significant improvement. Follow the recommendations below.";
  };
  
  // Get color classes based on score
  const getScoreColorClasses = () => {
    if (data.score >= 80) return "text-green-600";
    if (data.score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  // Generate suggested actions for improvement
  const getSuggestedActions = () => {
    const suggestions = [];
    
    if (data.recommendedSkills.length > 0) {
      suggestions.push(`Add ${data.recommendedSkills.slice(0, 3).join(", ")} to your skill set`);
    }
    
    if (data.score < 80) {
      suggestions.push("Quantify your achievements with specific metrics");
      suggestions.push("Use action verbs at the beginning of bullet points");
    }
    
    if (data.score < 70) {
      suggestions.push("Ensure your resume is properly formatted and ATS-friendly");
      suggestions.push("Tailor your resume to match the job descriptions in your field");
    }
    
    return suggestions;
  };

  return (
    <div className="space-y-6">
      {/* Score Overview Card */}
      <Card className="overflow-hidden border-0 shadow-md">
        <div className={`h-2 ${isGoodScore ? 'bg-green-500' : isMediumScore ? 'bg-amber-500' : 'bg-red-500'}`}></div>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Resume Analysis</span>
            <span className={`text-3xl font-bold ${getScoreColorClasses()}`}>{data.score}/100</span>
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of your resume for {data.likelyField} positions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Progress 
              value={data.score} 
              className="h-3" 
            />
            <p className="text-sm">
              {getScoreFeedback()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="font-medium">{data.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="font-medium">{data.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="font-medium">{data.phone || "Not detected"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg flex items-start">
              <Award className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              <div>
                <p className="font-medium text-blue-800">Experience Level</p>
                <p className="text-sm text-blue-700 mt-1">{data.experienceLevel}</p>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg flex items-start">
              <Briefcase className="h-5 w-5 text-purple-500 mt-0.5 mr-2" />
              <div>
                <p className="font-medium text-purple-800">Field Match</p>
                <p className="text-sm text-purple-700 mt-1">
                  {data.likelyField} ({data.matchConfidence}% confidence)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Detected Skills
            </CardTitle>
            <CardDescription>Skills identified in your resume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.skills.map((skill: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Zap className="h-5 w-5 text-amber-500 mr-2" />
              Recommended Skills
            </CardTitle>
            <CardDescription>Skills to add to improve your employability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.recommendedSkills.map((skill: string, index: number) => (
                <Badge key={index} className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200">
                  + {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Improvement Suggestions */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
            Suggested Improvements
          </CardTitle>
          <CardDescription>Actionable steps to enhance your resume</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 mt-2">
            {getSuggestedActions().map((action, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-blue-800">{action}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-6">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white" asChild>
              <a href="/skillgpt" target="_blank">
                Get Personalized Resume Help
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
