export interface Quiz {
  id: string
  title: string
  description?: string
  questions: Question[]
  createdAt: Date
  updatedAt: Date
  settings: QuizSettings
}

export interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "short-answer" | "essay"
  question: string
  options?: string[]
  correctAnswer?: string | number | boolean
  explanation?: string
  points: number
  timeLimit?: number
}

export interface QuizSettings {
  shuffleQuestions: boolean
  shuffleOptions: boolean
  showCorrectAnswers: boolean
  allowReview: boolean
  timeLimit?: number
  passingScore?: number
}

export interface QuizResult {
  id: string
  quizId: string
  answers: Record<string, any>
  score: number
  totalPoints: number
  startTime: Date
  endTime: Date
  passed: boolean
}

export interface PlayerState {
  currentQuestionIndex: number
  answers: Record<string, any>
  startTime: Date
  timeRemaining?: number
  isFinished: boolean
  showResults: boolean
}

export interface EditorState {
  quiz: Quiz | null
  isDirty: boolean
  isLoading: boolean
  error?: string
}
