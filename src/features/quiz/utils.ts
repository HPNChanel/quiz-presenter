import type { Question, Quiz, QuizResult } from "./types"
import LZString from "lz-string"

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function calculateScore(answers: Record<string, any>, questions: Question[]): {
  score: number
  totalPoints: number
  correctCount: number
  totalCount: number
} {
  let score = 0
  let totalPoints = 0
  let correctCount = 0

  questions.forEach((question) => {
    totalPoints += question.points
    const userAnswer = answers[question.id]
    
    if (isAnswerCorrect(question, userAnswer)) {
      score += question.points
      correctCount++
    }
  })

  return {
    score,
    totalPoints,
    correctCount,
    totalCount: questions.length,
  }
}

export function isAnswerCorrect(question: Question, userAnswer: any): boolean {
  if (!userAnswer) return false

  switch (question.type) {
    case "multiple-choice":
      return userAnswer === question.correctAnswer
    case "true-false":
      return userAnswer === question.correctAnswer
    case "short-answer":
      if (typeof userAnswer !== "string" || typeof question.correctAnswer !== "string") {
        return false
      }
      return userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()
    case "essay":
      // Essays require manual grading
      return false
    default:
      return false
  }
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

export function getQuestionTypeLabel(type: Question["type"]): string {
  switch (type) {
    case "multiple-choice":
      return "Multiple Choice"
    case "true-false":
      return "True/False"
    case "short-answer":
      return "Short Answer"
    case "essay":
      return "Essay"
    default:
      return "Unknown"
  }
}

export function validateQuestion(question: Partial<Question>): string[] {
  const errors: string[] = []

  if (!question.question?.trim()) {
    errors.push("Question text is required")
  }

  if (!question.type) {
    errors.push("Question type is required")
  }

  if (!question.points || question.points < 1) {
    errors.push("Points must be at least 1")
  }

  if (question.type === "multiple-choice") {
    if (!question.options || question.options.length < 2) {
      errors.push("Multiple choice questions need at least 2 options")
    }
    if (question.correctAnswer === undefined || question.correctAnswer === "") {
      errors.push("Correct answer is required")
    }
  }

  if (question.type === "true-false") {
    if (typeof question.correctAnswer !== "boolean") {
      errors.push("True/False questions need a correct answer")
    }
  }

  if (question.type === "short-answer") {
    if (!question.correctAnswer || typeof question.correctAnswer !== "string") {
      errors.push("Short answer questions need a correct answer")
    }
  }

  return errors
}

// Shareable links
export function createShareableLink(quiz: Quiz): string {
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(quiz))
  return `${window.location.origin}/play/shared?data=${compressed}`
}

export function parseShareableLink(data: string): Quiz | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(data)
    if (!decompressed) return null
    return JSON.parse(decompressed) as Quiz
  } catch {
    return null
  }
}

// Progress tracking
export function getQuizProgress(answers: Record<string, any>, totalQuestions: number): {
  answered: number
  percentage: number
} {
  const answered = Object.keys(answers).length
  return {
    answered,
    percentage: totalQuestions > 0 ? (answered / totalQuestions) * 100 : 0,
  }
}

// Export utilities
export function exportQuizToJson(quiz: Quiz): string {
  return JSON.stringify(quiz, null, 2)
}

export function exportResultsToCsv(results: QuizResult[]): string {
  if (results.length === 0) return ""

  const headers = ["Date", "Quiz ID", "Score", "Total Points", "Percentage", "Passed", "Duration"]
  const rows = results.map((result) => [
    result.endTime.toISOString().split("T")[0],
    result.quizId,
    result.score.toString(),
    result.totalPoints.toString(),
    ((result.score / result.totalPoints) * 100).toFixed(1),
    result.passed ? "Yes" : "No",
    Math.round((result.endTime.getTime() - result.startTime.getTime()) / 1000).toString(),
  ])

  return [headers, ...rows].map(row => row.join(",")).join("\n")
}
