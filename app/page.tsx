import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, BookOpen, BriefcaseIcon, MessageSquare, Upload, Star, Sparkles, Zap, FileText, CheckCircle } from "lucide-react"
import SkillGPT from "@/components/Chatbot"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-8 w-8 text-white" />
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none text-white">
                    SkillBridge
                  </h1>
                </div>
                <p className="max-w-[600px] text-white md:text-xl/relaxed lg:text-xl/relaxed">
                  Your intelligent career assistant. Get personalized career advice, skill recommendations, and job matches.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/skillgpt">
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Try SkillGPT
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[500px]">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-3xl opacity-20"></div>
                <div className="relative bg-white rounded-xl shadow-xl overflow-hidden">
                  <div className="p-5 border-b">
                    <h3 className="text-lg font-semibold flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-500" />
                      Resume Analysis
                    </h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">98% match for Senior Developer roles</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">8 key skills identified</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">3 recommended skill improvements</span>
                    </div>
                    <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm flex items-start">
                      <Sparkles className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">AI Recommendation</p>
                        <p className="text-sm mt-1">Add more quantifiable achievements to strengthen your impact statements.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Accelerate Your Career
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                SkillBridge provides the tools and insights you need to advance your career and stand out in the job market.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
            <div className="flex flex-col items-start space-y-4 rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Resume Analysis</h3>
                <p className="text-muted-foreground">
                  Get personalized feedback on your resume and suggestions for improvement.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start space-y-4 rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <MessageSquare className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">SkillGPT</h3>
                <p className="text-muted-foreground">
                  Chat with our AI assistant to get personalized career advice and guidance.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start space-y-4 rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <BriefcaseIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Job Matching</h3>
                <p className="text-muted-foreground">
                  Find jobs that match your skills and experience with our AI-powered job search.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start space-y-4 rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Learning Paths</h3>
                <p className="text-muted-foreground">
                  Discover courses and resources to help you acquire in-demand skills.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start space-y-4 rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Skill Analysis</h3>
                <p className="text-muted-foreground">
                  Track your progress and see how your skills match up against industry standards.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start space-y-4 rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Star className="h-6 w-6 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Career Planning</h3>
                <p className="text-muted-foreground">
                  Build a roadmap for your career with tailored advice and step-by-step guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">Ready to advance your career?</h2>
              <p className="mx-auto max-w-[600px] text-white md:text-xl/relaxed">
                Join SkillBridge today and get personalized recommendations to improve your resume and boost your career.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard">
                <Button className="bg-white text-blue-600 hover:bg-gray-100">Get Started Now</Button>
              </Link>
              <Link href="/skillgpt">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Try SkillGPT
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Add SkillGPT floating button */}
      <SkillGPT />
    </main>
  )
}
