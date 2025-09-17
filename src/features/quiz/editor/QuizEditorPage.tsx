import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Save, ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuizStore } from "../store"
import { quizStorage } from "../storage"
import toast from "react-hot-toast"

export function QuizEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { editor, setEditorQuiz, setEditorLoading, createNewQuiz, addQuiz, updateQuiz } = useQuizStore()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const isNewQuiz = id === "new"

  useEffect(() => {
    loadQuiz()
  }, [id])

  const loadQuiz = async () => {
    if (isNewQuiz) {
      const newQuiz = createNewQuiz()
      setEditorQuiz(newQuiz)
      setTitle(newQuiz.title)
      setDescription(newQuiz.description || "")
    } else if (id) {
      setEditorLoading(true)
      try {
        const quiz = await quizStorage.getQuiz(id)
        if (quiz) {
          setEditorQuiz(quiz)
          setTitle(quiz.title)
          setDescription(quiz.description || "")
        } else {
          toast.error("Quiz not found")
          navigate("/library")
        }
      } catch (error) {
        toast.error("Failed to load quiz")
        console.error("Error loading quiz:", error)
      } finally {
        setEditorLoading(false)
      }
    }
  }

  const handleSave = async (showToast = true) => {
    if (!editor.quiz) return

    const updatedQuiz = {
      ...editor.quiz,
      title,
      description,
      updatedAt: new Date(),
    }

    try {
      await quizStorage.saveQuiz(updatedQuiz)
      
      if (isNewQuiz) {
        addQuiz(updatedQuiz)
        navigate(`/editor/${updatedQuiz.id}`)
      } else {
        updateQuiz(updatedQuiz.id, updatedQuiz)
      }
      
      setEditorQuiz(updatedQuiz)
      if (showToast) {
        toast.success("Quiz saved successfully")
      }
    } catch (error) {
      if (showToast) {
        toast.error("Failed to save quiz")
      }
      console.error("Error saving quiz:", error)
    }
  }


  const handleAddQuestion = async () => {
    if (!editor.quiz) return
    
    // Auto-save current quiz state before navigating
    await handleSave(false) // false = don't show success toast
    navigate(`/editor/${editor.quiz.id}/question/new`)
  }

  const handleDeleteQuestion = (questionId: string) => {
    if (!editor.quiz) return

    const updatedQuiz = {
      ...editor.quiz,
      questions: editor.quiz.questions.filter(q => q.id !== questionId),
      updatedAt: new Date(),
    }

    setEditorQuiz(updatedQuiz)
  }

  const handleEditQuestion = async (questionId: string) => {
    if (!editor.quiz) return
    
    // Auto-save current quiz state before navigating
    await handleSave(false) // false = don't show success toast
    navigate(`/editor/${editor.quiz.id}/question/${questionId}`)
  }

  if (editor.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!editor.quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Quiz not found</p>
        <Button className="mt-4" onClick={() => navigate("/library")}>
          Back to Library
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/library")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isNewQuiz ? "Create New Quiz" : "Edit Quiz"}
            </h1>
          </div>
        </div>
          <Button onClick={() => handleSave()}>
          <Save className="h-4 w-4 mr-2" />
          Save Quiz
        </Button>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title..."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter quiz description..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card className="glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="gradient-text">Questions ({editor.quiz.questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {editor.quiz.questions.length === 0 ? (
            <div className="text-center py-12 space-y-6">
              <div className="mx-auto p-4 gradient-bg-cool rounded-full w-fit">
                <Plus className="h-12 w-12 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text mb-2">Ready to add your first question?</h3>
                <p className="text-muted-foreground">
                  Start building your quiz with engaging questions
                </p>
              </div>
              <Button onClick={handleAddQuestion} className="gradient-bg-nature text-white hover:opacity-90 hover-lift">
                <Plus className="h-4 w-4 mr-2" />
                Add First Question
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {editor.quiz.questions.map((question, index) => (
                <Card key={question.id} className="p-4 glass border-0 hover-lift">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-medium">
                          Question {index + 1}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {question.type.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {question.points} pts
                        </Badge>
                      </div>
                      <p className="text-sm font-medium mb-1">
                        {question.question || "Untitled Question"}
                      </p>
                      {question.type === "multiple-choice" && question.options && (
                        <div className="text-xs text-muted-foreground">
                          {question.options.length} options • Correct: {
                            typeof question.correctAnswer === 'number' 
                              ? `Option ${question.correctAnswer + 1}` 
                              : question.correctAnswer
                          }
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditQuestion(question.id)}
                        className="hover-lift"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="hover-lift text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              <Button 
                onClick={handleAddQuestion} 
                className="w-full gradient-bg-cool text-white hover:opacity-90 hover-lift"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
