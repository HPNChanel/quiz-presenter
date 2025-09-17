import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Plus, Trash2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useQuizStore } from "../store"
import { generateId } from "@/lib/utils"
import type { Question } from "../types"
import toast from "react-hot-toast"

interface QuestionEditorProps {
  quizId: string
  questionId?: string
  onSave?: (question: Question) => void
  onCancel?: () => void
}

export function QuestionEditor({ quizId, questionId, onSave, onCancel }: QuestionEditorProps) {
  const navigate = useNavigate()
  const { editor } = useQuizStore()
  
  // Question state
  const [question, setQuestion] = useState("")
  const [type, setType] = useState<Question["type"]>("multiple-choice")
  const [options, setOptions] = useState<string[]>(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState<string | number | boolean>(0)
  const [explanation, setExplanation] = useState("")
  const [points, setPoints] = useState(10)
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined)

  const isEditing = !!questionId
  const isStandalone = !onSave // If no onSave callback, this is a standalone page

  useEffect(() => {
    if (isEditing && editor.quiz) {
      const existingQuestion = editor.quiz.questions.find(q => q.id === questionId)
      if (existingQuestion) {
        loadQuestionData(existingQuestion)
      }
    }
  }, [isEditing, questionId, editor.quiz])

  const loadQuestionData = (q: Question) => {
    setQuestion(q.question)
    setType(q.type)
    setOptions(q.options || ["", "", "", ""])
    setCorrectAnswer(q.correctAnswer || 0)
    setExplanation(q.explanation || "")
    setPoints(q.points)
    setTimeLimit(q.timeLimit)
  }

  const handleTypeChange = (newType: Question["type"]) => {
    setType(newType)
    
    // Reset type-specific fields
    switch (newType) {
      case "multiple-choice":
        setOptions(["", "", "", ""])
        setCorrectAnswer(0)
        break
      case "true-false":
        setOptions([])
        setCorrectAnswer(true)
        break
      case "short-answer":
        setOptions([])
        setCorrectAnswer("")
        break
      case "essay":
        setOptions([])
        setCorrectAnswer("")
        break
    }
  }

  const handleAddOption = () => {
    if (options.length < 6) { // Max 6 options
      setOptions([...options, ""])
    }
  }

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) { // Min 2 options
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
      
      // Adjust correct answer if needed
      if (typeof correctAnswer === "number" && correctAnswer >= newOptions.length) {
        setCorrectAnswer(0)
      }
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const validateQuestion = (): string[] => {
    const errors: string[] = []

    if (!question.trim()) {
      errors.push("Question text is required")
    }

    if (points < 1) {
      errors.push("Points must be at least 1")
    }

    switch (type) {
      case "multiple-choice":
        if (options.filter(opt => opt.trim()).length < 2) {
          errors.push("Multiple choice questions need at least 2 non-empty options")
        }
        if (typeof correctAnswer !== "number" || correctAnswer < 0 || correctAnswer >= options.length) {
          errors.push("Please select a valid correct answer")
        }
        break
      
      case "short-answer":
        if (typeof correctAnswer !== "string" || !correctAnswer.trim()) {
          errors.push("Short answer questions need a correct answer")
        }
        break
    }

    return errors
  }

  const handleSave = () => {
    const errors = validateQuestion()
    if (errors.length > 0) {
      toast.error(errors[0])
      return
    }

    const questionData: Question = {
      id: questionId || generateId(),
      type,
      question: question.trim(),
      options: type === "multiple-choice" ? options.filter(opt => opt.trim()) : undefined,
      correctAnswer,
      explanation: explanation.trim() || undefined,
      points,
      timeLimit,
    }

    if (onSave) {
      onSave(questionData)
    } else {
      // Handle standalone save
      toast.success(isEditing ? "Question updated!" : "Question created!")
      navigate(`/editor/${quizId}`)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate(`/editor/${quizId}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      {isStandalone && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleCancel} className="hover-lift glass">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quiz
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                {isEditing ? "Edit Question" : "Create New Question"}
              </h1>
            </div>
          </div>
          <Button onClick={handleSave} className="gradient-bg-nature text-white hover:opacity-90 hover-lift">
            <Save className="h-4 w-4 mr-2" />
            Save Question
          </Button>
        </div>
      )}

      {/* Question Type Selection */}
      <Card className="glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="gradient-text">Question Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { type: "multiple-choice" as const, label: "Multiple Choice", icon: "🔘" },
              { type: "true-false" as const, label: "True/False", icon: "✅" },
              { type: "short-answer" as const, label: "Short Answer", icon: "✏️" },
              { type: "essay" as const, label: "Essay", icon: "📝" },
            ].map(({ type: qType, label, icon }) => (
              <Button
                key={qType}
                variant={type === qType ? "default" : "outline"}
                onClick={() => handleTypeChange(qType)}
                className={`h-auto p-4 flex flex-col items-center gap-2 ${
                  type === qType ? "gradient-bg text-white" : "glass border-2 hover-lift"
                }`}
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question Content */}
      <Card className="glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="gradient-text">Question Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Text */}
          <div className="space-y-2">
            <label htmlFor="question" className="text-sm font-medium">
              Question Text *
            </label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question here... (supports LaTeX: $x^2 + y^2 = z^2$)"
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              💡 Tip: Use LaTeX notation for math expressions: $\\frac{1}{2}$, $x^2$, $\\sqrt{16}$
            </p>
          </div>

          {/* Type-specific content */}
          {type === "multiple-choice" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Answer Options *</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                  disabled={options.length >= 6}
                  className="hover-lift"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Option
                </Button>
              </div>
              
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Button
                      variant={correctAnswer === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCorrectAnswer(index)}
                      className={correctAnswer === index ? "gradient-bg-nature text-white" : ""}
                    >
                      {correctAnswer === index && <CheckCircle className="h-3 w-3 mr-1" />}
                      {String.fromCharCode(65 + index)}
                    </Button>
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className="flex-1"
                    />
                    {options.length > 2 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveOption(index)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Click the letter button to mark the correct answer
              </p>
            </div>
          )}

          {type === "true-false" && (
            <div className="space-y-4">
              <label className="text-sm font-medium">Correct Answer *</label>
              <div className="flex gap-3">
                <Button
                  variant={correctAnswer === true ? "default" : "outline"}
                  onClick={() => setCorrectAnswer(true)}
                  className={`flex-1 ${correctAnswer === true ? "gradient-bg-nature text-white" : ""}`}
                >
                  {correctAnswer === true && <CheckCircle className="h-4 w-4 mr-2" />}
                  True
                </Button>
                <Button
                  variant={correctAnswer === false ? "default" : "outline"}
                  onClick={() => setCorrectAnswer(false)}
                  className={`flex-1 ${correctAnswer === false ? "gradient-bg-warm text-white" : ""}`}
                >
                  {correctAnswer === false && <CheckCircle className="h-4 w-4 mr-2" />}
                  False
                </Button>
              </div>
            </div>
          )}

          {type === "short-answer" && (
            <div className="space-y-2">
              <label htmlFor="correct-answer" className="text-sm font-medium">
                Correct Answer *
              </label>
              <Input
                id="correct-answer"
                value={correctAnswer as string}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Enter the correct answer"
              />
              <p className="text-xs text-muted-foreground">
                Answer comparison is case-insensitive and whitespace is trimmed
              </p>
            </div>
          )}

          {type === "essay" && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                📝 Essay questions require manual grading. Students can write free-form responses.
              </p>
            </div>
          )}

          <Separator />

          {/* Additional Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="points" className="text-sm font-medium">
                Points *
              </label>
              <Input
                id="points"
                type="number"
                min="1"
                max="100"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="time-limit" className="text-sm font-medium">
                Time Limit (seconds)
              </label>
              <Input
                id="time-limit"
                type="number"
                min="10"
                max="600"
                value={timeLimit || ""}
                onChange={(e) => setTimeLimit(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <label htmlFor="explanation" className="text-sm font-medium">
              Explanation (Optional)
            </label>
            <Textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain why this is the correct answer..."
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {!isStandalone && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel} className="hover-lift glass border-2">
            Cancel
          </Button>
          <Button onClick={handleSave} className="gradient-bg-nature text-white hover:opacity-90 hover-lift">
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? "Update Question" : "Create Question"}
          </Button>
        </div>
      )}
    </div>
  )
}
