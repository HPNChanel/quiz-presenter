import { quizStorage } from "@/features/quiz/storage"
import { clearSampleData } from "./clearSampleData"

export async function initializeApp() {
  try {
    // Initialize the database connection
    await quizStorage.getAllQuizzes()
    
    // Clear any existing sample data
    const removedCount = await clearSampleData()
    if (removedCount > 0) {
      console.log(`Cleaned up ${removedCount} sample quizzes`)
    }
    
    console.log("Quiz Presenter initialized successfully")
  } catch (error) {
    console.error("Failed to initialize app:", error)
  }
}
