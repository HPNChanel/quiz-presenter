import { db } from "@/lib/dexie"
import type { Quiz, QuizResult } from "./types"

export class QuizStorage {
  // Quiz CRUD operations
  async getAllQuizzes(): Promise<Quiz[]> {
    return await db.quizzes.orderBy("updatedAt").reverse().toArray()
  }

  async getQuiz(id: string): Promise<Quiz | undefined> {
    return await db.quizzes.get(id)
  }

  async saveQuiz(quiz: Quiz): Promise<void> {
    await db.quizzes.put(quiz)
  }

  async deleteQuiz(id: string): Promise<void> {
    await db.quizzes.delete(id)
    // Also delete related results
    await db.results.where("quizId").equals(id).delete()
  }

  // Quiz results
  async saveResult(result: QuizResult): Promise<void> {
    await db.results.put(result)
  }

  async getQuizResults(quizId: string): Promise<QuizResult[]> {
    return await db.results.where("quizId").equals(quizId).toArray()
  }

  async getAllResults(): Promise<QuizResult[]> {
    return await db.results.orderBy("endTime").reverse().toArray()
  }

  // Export/Import
  async exportQuiz(id: string): Promise<string> {
    const quiz = await this.getQuiz(id)
    if (!quiz) {
      throw new Error("Quiz not found")
    }
    return JSON.stringify(quiz, null, 2)
  }

  async importQuiz(jsonData: string): Promise<Quiz> {
    try {
      const quiz = JSON.parse(jsonData) as Quiz
      // Generate new ID and update timestamps
      quiz.id = crypto.randomUUID()
      quiz.createdAt = new Date()
      quiz.updatedAt = new Date()
      
      await this.saveQuiz(quiz)
      return quiz
    } catch (error) {
      throw new Error("Invalid quiz data")
    }
  }

  async exportAllQuizzes(): Promise<string> {
    const quizzes = await this.getAllQuizzes()
    return JSON.stringify(quizzes, null, 2)
  }

  // Search and filter
  async searchQuizzes(query: string): Promise<Quiz[]> {
    const allQuizzes = await this.getAllQuizzes()
    const lowercaseQuery = query.toLowerCase()
    
    return allQuizzes.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(lowercaseQuery) ||
        (quiz.description && quiz.description.toLowerCase().includes(lowercaseQuery))
    )
  }

  // Statistics
  async getQuizStats(quizId: string) {
    const results = await this.getQuizResults(quizId)
    
    if (results.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        passRate: 0,
        bestScore: 0,
        worstScore: 0,
      }
    }

    const scores = results.map((r) => r.score)
    const passedResults = results.filter((r) => r.passed)

    return {
      totalAttempts: results.length,
      averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      passRate: (passedResults.length / results.length) * 100,
      bestScore: Math.max(...scores),
      worstScore: Math.min(...scores),
    }
  }
}

export const quizStorage = new QuizStorage()
