import Dexie from "dexie"
import type { Table } from "dexie"

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

export class QuizDatabase extends Dexie {
  quizzes!: Table<Quiz>
  results!: Table<QuizResult>

  constructor() {
    super("QuizPresenterDB")
    
    this.version(1).stores({
      quizzes: "id, title, createdAt, updatedAt",
      results: "id, quizId, startTime, endTime, score"
    })
  }
}

export const db = new QuizDatabase()
