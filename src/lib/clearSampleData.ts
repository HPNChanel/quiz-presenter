import { quizStorage } from "@/features/quiz/storage"

// Sample quiz titles that should be removed
const SAMPLE_QUIZ_TITLES = [
  "JavaScript Fundamentals",
  "React Hooks Quiz", 
  "Math Quiz"
]

export async function clearSampleData() {
  try {
    const allQuizzes = await quizStorage.getAllQuizzes()
    
    // Find and delete sample quizzes
    const sampleQuizzes = allQuizzes.filter(quiz => 
      SAMPLE_QUIZ_TITLES.includes(quiz.title)
    )
    
    for (const quiz of sampleQuizzes) {
      await quizStorage.deleteQuiz(quiz.id)
    }
    
    if (sampleQuizzes.length > 0) {
      console.log(`Removed ${sampleQuizzes.length} sample quizzes`)
      return sampleQuizzes.length
    }
    
    return 0
  } catch (error) {
    console.error("Failed to clear sample data:", error)
    return 0
  }
}

// Function to check if a quiz is likely a sample quiz
export function isSampleQuiz(quiz: { title: string, description?: string }): boolean {
  return SAMPLE_QUIZ_TITLES.includes(quiz.title) ||
         (quiz.description?.includes("Test your knowledge") || false) ||
         (quiz.description?.includes("sample") || false)
}
