import { useParams, useNavigate } from "react-router-dom"
import { QuestionEditor } from "./QuestionEditor"
import { useQuizStore } from "../store"
import { quizStorage } from "../storage"
import type { Question } from "../types"
import toast from "react-hot-toast"

export function QuestionEditorPage() {
  const { quizId, questionId } = useParams<{ quizId: string; questionId?: string }>()
  const navigate = useNavigate()
  const { editor, setEditorQuiz } = useQuizStore()

  if (!quizId) {
    navigate("/library")
    return null
  }

  const handleSave = async (question: Question) => {
    if (!editor.quiz) return

    try {
      let updatedQuiz
      
      if (questionId) {
        // Update existing question
        updatedQuiz = {
          ...editor.quiz,
          questions: editor.quiz.questions.map(q => 
            q.id === questionId ? question : q
          ),
          updatedAt: new Date(),
        }
        toast.success("Question updated successfully!")
      } else {
        // Add new question
        updatedQuiz = {
          ...editor.quiz,
          questions: [...editor.quiz.questions, question],
          updatedAt: new Date(),
        }
        toast.success("Question created successfully!")
      }

      // Save to storage and update store
      await quizStorage.saveQuiz(updatedQuiz)
      setEditorQuiz(updatedQuiz)

      // Navigate back to quiz editor
      navigate(`/editor/${quizId}`)
    } catch (error) {
      toast.error("Failed to save question")
      console.error("Error saving question:", error)
    }
  }

  const handleCancel = () => {
    navigate(`/editor/${quizId}`)
  }

  return (
    <QuestionEditor
      quizId={quizId}
      questionId={questionId}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  )
}
