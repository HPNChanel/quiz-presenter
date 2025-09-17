import { Link } from "react-router-dom"
import { PlusCircle, Library, Play, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/common/Logo"

export function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-16">
      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 lg:py-12 min-h-[70vh] lg:min-h-[80vh]">
        {/* Left Content */}
        <div className="space-y-8 lg:pr-8">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="gradient-text-warm animate-fade-in-up">Welcome to</span>
              <br />
              <span className="gradient-text animate-fade-in-up animation-delay-200">Quiz Presenter</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed animate-fade-in-up animation-delay-400">
              Create, manage, and present interactive quizzes with support for LaTeX math,
              multiple question types, and immersive audio experiences.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up animation-delay-600">
            <Button size="lg" asChild className="gradient-bg-nature text-white hover:opacity-90 hover-lift text-lg px-8 py-3">
              <Link to="/editor/new">
                <PlusCircle className="h-6 w-6 mr-2" />
                Create New Quiz
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="hover-lift border-2 text-lg px-8 py-3 glass">
              <Link to="/library">
                <Library className="h-6 w-6 mr-2" />
                Browse Library
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Side - Animated Logo */}
        <div className="flex justify-center lg:justify-end order-first lg:order-last">
          <div className="relative">
            {/* Main Logo with Multiple Animations */}
            <div className="animate-logo-float">
              <div className="relative p-4 md:p-6 lg:p-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl animate-logo-glow">
                <Logo size="lg" className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 animate-logo-pulse" />
                
                {/* Floating particles around logo - hidden on small screens for performance */}
                <div className="hidden sm:block absolute -top-4 -left-4 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-particle-float-1"></div>
                <div className="hidden sm:block absolute -top-2 right-8 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-particle-float-2"></div>
                <div className="hidden sm:block absolute bottom-4 -left-2 w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-particle-float-3"></div>
                <div className="hidden sm:block absolute -bottom-3 right-4 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-particle-float-4"></div>
                <div className="hidden sm:block absolute top-1/2 -right-4 w-2.5 h-2.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-particle-float-5"></div>
              </div>
            </div>
            
            {/* Background decorative circles - scaled for mobile */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/4 left-1/4 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-spin-slow"></div>
              <div className="absolute bottom-1/4 right-1/4 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full animate-spin-slow-reverse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="glass hover-lift hover-glow border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 gradient-bg-nature rounded-full w-fit mb-4">
              <PlusCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl gradient-text">Easy Creation</CardTitle>
            <CardDescription className="text-base">
              Create quizzes with multiple question types including multiple choice,
              true/false, short answer, and essay questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" size="sm" asChild className="hover-lift glass border-2">
              <Link to="/editor/new">Get Started</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass hover-lift hover-glow border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 gradient-bg-cool rounded-full w-fit mb-4">
              <Play className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl gradient-text">Interactive Presentation</CardTitle>
            <CardDescription className="text-base">
              Present quizzes in fullscreen mode with keyboard navigation,
              timer support, audio feedback, and real-time scoring.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" size="sm" asChild className="hover-lift glass border-2">
              <Link to="/library">Browse Quizzes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass hover-lift hover-glow border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 gradient-bg-warm rounded-full w-fit mb-4">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl gradient-text">Advanced Features</CardTitle>
            <CardDescription className="text-base">
              LaTeX math support, question shuffling, time limits,
              audio effects, and comprehensive result tracking.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" size="sm" asChild className="hover-lift glass border-2">
              <Link to="/settings">Learn More</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl gradient-text">Quick Actions</CardTitle>
          <CardDescription className="text-lg">
            Jump right into creating or managing your quizzes
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" asChild className="hover-lift glass border-2 gradient-bg text-white hover:opacity-90">
            <Link to="/editor/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Quiz
            </Link>
          </Button>
          <Button variant="outline" asChild className="hover-lift glass border-2 gradient-bg-cool text-white hover:opacity-90">
            <Link to="/library">
              <Library className="h-4 w-4 mr-2" />
              View All Quizzes
            </Link>
          </Button>
          <Button variant="outline" asChild className="hover-lift glass border-2 gradient-bg-warm text-white hover:opacity-90">
            <Link to="/settings">
              <Settings className="h-4 w-4 mr-2" />
              Import Quiz
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
