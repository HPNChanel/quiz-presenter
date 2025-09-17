import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { PlusCircle, Play, Edit, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuizStore } from "@/features/quiz/store"
import { quizStorage } from "@/features/quiz/storage"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

export function Library() {
  const { quizzes, deleteQuiz, loadQuizzes } = useQuizStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeLibrary()
  }, [])

  const initializeLibrary = async () => {
    try {
      await loadQuizzes()
    } catch (error) {
      toast.error("Failed to load quizzes")
      console.error("Error loading quizzes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      await quizStorage.deleteQuiz(id)
      deleteQuiz(id)
      toast.success("Quiz deleted successfully")
    } catch (error) {
      toast.error("Failed to delete quiz")
      console.error("Error deleting quiz:", error)
    }
  }

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quiz.description && quiz.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading quizzes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quiz Library</h1>
          <p className="text-muted-foreground">
            Manage and organize your quiz collection
          </p>
        </div>
        <Button asChild>
          <Link to="/editor/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Quiz
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search quizzes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quiz Grid */}
      {filteredQuizzes.length === 0 ? (
        <Card className="glass border-0 shadow-xl">
          <CardContent className="py-16 text-center">
            <div className="space-y-6">
              <div className="mx-auto p-4 gradient-bg-nature rounded-full w-fit">
                <PlusCircle className="h-12 w-12 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold gradient-text">
                  {searchQuery ? "No quizzes found" : "Ready to create your first quiz?"}
                </h3>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  {searchQuery
                    ? "Try adjusting your search terms or create a new quiz"
                    : "Start building engaging quizzes with multiple question types, LaTeX math support, and audio effects"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                <Button asChild className="gradient-bg-nature text-white hover:opacity-90 hover-lift">
                  <Link to="/editor/new">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Create Your First Quiz
                  </Link>
                </Button>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery("")} className="glass border-2 hover-lift">
                    Clear Search
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">
                    {quiz.title}
                  </CardTitle>
                  <Badge variant="secondary" className="ml-2 shrink-0">
                    {quiz.questions.length} Q
                  </Badge>
                </div>
                {quiz.description && (
                  <CardDescription className="line-clamp-2">
                    {quiz.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="text-sm text-muted-foreground">
                  <div>Created: {formatDate(quiz.createdAt)}</div>
                  {quiz.updatedAt !== quiz.createdAt && (
                    <div>Updated: {formatDate(quiz.updatedAt)}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" asChild className="flex-1">
                    <Link to={`/play/${quiz.id}`}>
                      <Play className="h-3 w-3 mr-1" />
                      Play
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/editor/${quiz.id}`}>
                      <Edit className="h-3 w-3" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(quiz.id, quiz.title)}
                  >
                    <Trash2 className="h-3 w-3" />
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
