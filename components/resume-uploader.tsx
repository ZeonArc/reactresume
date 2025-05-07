"use client"

import type React from "react"
import type { ResumeData } from "@/lib/types"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Upload, FileText } from "lucide-react"
import { analyzeResume } from "@/lib/resume-service"

interface ResumeUploaderProps {
  onResumeAnalyzed: (data: ResumeData) => void
}

export function ResumeUploader({ onResumeAnalyzed }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        })
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // In a real app, you would upload the file to your server here
      // For demo purposes, we'll simulate the analysis with a timeout
      const formData = new FormData()
      formData.append("resume", file)

      const analysisData = await analyzeResume(formData)

      toast({
        title: "Resume analyzed successfully",
        description: "Your resume has been analyzed. View the results in the Analysis tab.",
      })

      onResumeAnalyzed(analysisData)
    } catch {
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card
        className={`border-2 border-dashed p-10 text-center ${
          isDragging ? "border-rose-500 bg-rose-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-rose-100 p-4">
            <Upload className="h-8 w-8 text-rose-500" />
          </div>
          <div>
            <p className="text-lg font-medium">{file ? file.name : "Drag and drop your resume here"}</p>
            <p className="text-sm text-muted-foreground">
              {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Supports PDF files up to 10MB"}
            </p>
          </div>
          <div>
            <label htmlFor="resume-upload">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => document.getElementById("resume-upload")?.click()}
              >
                Browse Files
              </Button>
              <input id="resume-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      </Card>

      {file && (
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-rose-100 p-2">
              <FileText className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <Button className="bg-rose-500 hover:bg-rose-600" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Analyzing..." : "Analyze Resume"}
          </Button>
        </div>
      )}
    </div>
  )
}
