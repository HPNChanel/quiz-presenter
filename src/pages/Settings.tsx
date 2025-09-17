import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { AudioTest } from "@/components/common/AudioTest"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { quizStorage } from "@/features/quiz/storage"
import { useQuizStore } from "@/features/quiz/store"
import toast from "react-hot-toast"

export function Settings() {
  const { loadQuizzes } = useQuizStore()

  const handleClearAllData = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete ALL quizzes and results? This action cannot be undone!"
    )
    
    if (!confirmed) return

    try {
      const allQuizzes = await quizStorage.getAllQuizzes()
      for (const quiz of allQuizzes) {
        await quizStorage.deleteQuiz(quiz.id)
      }
      
      await loadQuizzes() // Refresh the store
      toast.success(`Deleted ${allQuizzes.length} quizzes successfully`)
    } catch (error) {
      toast.error("Failed to clear data")
      console.error("Error clearing data:", error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Customize your Quiz Presenter experience
        </p>
      </div>

      {/* Audio Test */}
      <div className="text-center">
        <AudioTest />
      </div>

      {/* Appearance */}
      <Card className="glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="gradient-text">Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Theme</div>
              <div className="text-sm text-muted-foreground">
                Choose between light, dark, or system theme
              </div>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="gradient-text">Data Management</CardTitle>
          <CardDescription>
            Import, export, and manage your quiz data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Export All Quizzes</div>
              <div className="text-sm text-muted-foreground">
                Download all your quizzes as JSON
              </div>
            </div>
            <Button variant="outline">Export</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Import Quizzes</div>
              <div className="text-sm text-muted-foreground">
                Import quizzes from JSON file
              </div>
            </div>
            <Button variant="outline">Import</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Clear All Data</div>
              <div className="text-sm text-muted-foreground">
                Permanently delete all quizzes and results (cannot be undone)
              </div>
            </div>
            <Button variant="destructive" onClick={handleClearAllData}>
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="gradient-text">About Quiz Presenter</CardTitle>
          <CardDescription>
            Information about this application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Version:</span>
              <Badge variant="secondary">1.0.0</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              A modern quiz presentation application built with React, TypeScript, and Tailwind CSS.
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="font-medium">Features:</div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Multiple question types (Multiple Choice, True/False, Short Answer, Essay)</li>
              <li>• LaTeX math support with KaTeX</li>
              <li>• Dark/Light theme support</li>
              <li>• Fullscreen presentation mode</li>
              <li>• Local storage with IndexedDB</li>
              <li>• Quiz import/export functionality</li>
              <li>• Shareable quiz links</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
