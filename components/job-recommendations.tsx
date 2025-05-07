"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, Briefcase, DollarSign } from "lucide-react"
import { getJobRecommendations } from "@/lib/job-service"
import type { ResumeData, Job } from "@/lib/types"

interface JobRecommendationsProps {
  data: ResumeData
}

export function JobRecommendations({ data }: JobRecommendationsProps) {
  const [workMode, setWorkMode] = useState("All")
  const [minSalary, setMinSalary] = useState(3000)
  const [jobCount, setJobCount] = useState(6)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleFindJobs = async () => {
    setIsLoading(true)
    try {
      const jobResults = await getJobRecommendations(data.targetField, workMode, minSalary, jobCount)
      setJobs(jobResults)
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Recommendations</CardTitle>
          <CardDescription>Find jobs that match your skills and experience in {data.targetField}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Work Mode</label>
              <Select value={workMode} onValueChange={setWorkMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select work mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Salary ($/month)</label>
              <div className="pt-2">
                <Slider
                  value={[minSalary]}
                  min={0}
                  max={10000}
                  step={500}
                  onValueChange={(value) => setMinSalary(value[0])}
                />
                <div className="mt-1 text-right text-sm">${minSalary}</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Jobs</label>
              <div className="pt-2">
                <Slider value={[jobCount]} min={3} max={15} step={1} onValueChange={(value) => setJobCount(value[0])} />
                <div className="mt-1 text-right text-sm">{jobCount} jobs</div>
              </div>
            </div>
          </div>

          <Button className="w-full bg-rose-500 hover:bg-rose-600" onClick={handleFindJobs} disabled={isLoading}>
            {isLoading ? "Finding jobs..." : "Find Jobs"}
          </Button>
        </CardContent>
      </Card>

      {jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    <div className="flex items-center text-muted-foreground">
                      <Building className="h-4 w-4 mr-1" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {job.workMode}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />${job.salary}/mo
                    </Badge>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      View Job
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
