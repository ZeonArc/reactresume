"use client"

import type React from "react"
import type { ResumeData } from "@/lib/types"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Upload, Check, Loader2, Sparkles } from "lucide-react"
import { analyzeResume } from "@/lib/resume-service"
import { Progress } from "@/components/ui/progress"

interface ResumeUploaderProps {
  onResumeAnalyzed: (data: ResumeData) => void
}

export function ResumeUploader({ onResumeAnalyzed }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStage, setUploadStage] = useState<'idle' | 'uploading' | 'parsing' | 'complete'>('idle')
  
  // Simulate progress updates
  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    return () => clearInterval(interval);
  };

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
    setUploadStage('uploading');
    const cleanup = simulateProgress();

    try {
      // Create form data with just the file
      const formData = new FormData()
      formData.append("resume", file)
      
      setUploadStage('parsing');
      const analysisData = await analyzeResume(formData)
      
      setUploadProgress(100);
      setUploadStage('complete');

      toast({
        title: "Resume analyzed successfully",
        description: "Your resume has been analyzed. View the results in the Analysis tab.",
      })

      // Wait a moment to show 100% progress
      setTimeout(() => {
        onResumeAnalyzed(analysisData)
      }, 800);

    } catch {
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      })
      setUploadStage('idle');
    } finally {
      cleanup();
      setTimeout(() => {
        setIsUploading(false);
      }, 800);
    }
  }

  return (
    <div className="space-y-6">
      <Card
        className={`border-2 border-dashed p-10 rounded-xl transition-all ${
          isDragging 
            ? "border-blue-500 bg-blue-50" 
            : file 
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-blue-300 hover:bg-blue-50/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`rounded-full p-5 ${file ? 'bg-green-100' : 'bg-blue-100'}`}>
            {file ? (
              <Check className="h-10 w-10 text-green-600" />
            ) : (
              <Upload className="h-10 w-10 text-blue-600" />
            )}
          </div>
          <div className="text-center">
            <p className="text-xl font-medium">{file ? `${file.name}` : "Upload Your Resume"}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {file 
                ? `${(file.size / 1024 / 1024).toFixed(2)} MB · PDF` 
                : "Drag and drop your PDF resume or click to browse"}
            </p>
          </div>
          <div>
            <label htmlFor="resume-upload">
              <Button
                variant="outline"
                className={`cursor-pointer px-5 py-2 rounded-full ${file ? 'border-green-500 text-green-600' : ''}`}
                onClick={() => document.getElementById("resume-upload")?.click()}
              >
                {file ? "Replace File" : "Browse Files"}
              </Button>
              <input id="resume-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      </Card>

      <div className="flex justify-center mt-6">
        <Button 
          className="w-full md:w-1/2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-full"
          onClick={handleUpload} 
          disabled={isUploading || !file}
        >
          {isUploading ? (
            <>
              {uploadStage === 'uploading' && (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              )}
              {uploadStage === 'parsing' && (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyzing...
                </>
              )}
              {uploadStage === 'complete' && (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Complete!
                </>
              )}
            </>
          ) : (
            <>
              Analyze Resume
              <Sparkles className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      
      {isUploading && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span>{uploadStage === 'complete' ? 'Complete!' : uploadStage === 'parsing' ? 'Analyzing resume...' : 'Uploading...'}</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </div>
  )
}
