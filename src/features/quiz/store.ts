import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { Quiz, PlayerState, EditorState } from "./types"
import { generateId } from "@/lib/utils"
import { quizStorage } from "./storage"

interface QuizStore {
  // Quiz library
  quizzes: Quiz[]
  setQuizzes: (quizzes: Quiz[]) => void
  addQuiz: (quiz: Quiz) => void
  updateQuiz: (id: string, quiz: Partial<Quiz>) => void
  deleteQuiz: (id: string) => void
  loadQuizzes: () => Promise<void>
  
  // Editor state
  editor: EditorState
  setEditorQuiz: (quiz: Quiz | null) => void
  setEditorLoading: (loading: boolean) => void
  setEditorError: (error: string | undefined) => void
  setEditorDirty: (dirty: boolean) => void
  
  // Player state
  player: PlayerState | null
  initPlayer: (quiz: Quiz) => void
  setCurrentQuestion: (index: number) => void
  setAnswer: (questionId: string, answer: any) => void
  finishQuiz: () => void
  resetPlayer: () => void
  
  // Actions
  createNewQuiz: () => Quiz
  duplicateQuiz: (quiz: Quiz) => Quiz
}

const defaultQuizSettings = {
  shuffleQuestions: false,
  shuffleOptions: false,
  showCorrectAnswers: true,
  allowReview: true,
}

export const useQuizStore = create<QuizStore>()(
  devtools(
    (set) => ({
      // Quiz library
      quizzes: [],
      setQuizzes: (quizzes) => set({ quizzes }),
      addQuiz: (quiz) => set((state) => ({ quizzes: [...state.quizzes, quiz] })),
      updateQuiz: (id, updates) =>
        set((state) => ({
          quizzes: state.quizzes.map((quiz) =>
            quiz.id === id ? { ...quiz, ...updates, updatedAt: new Date() } : quiz
          ),
        })),
      deleteQuiz: (id) =>
        set((state) => ({
          quizzes: state.quizzes.filter((quiz) => quiz.id !== id),
        })),
      loadQuizzes: async () => {
        try {
          const quizzes = await quizStorage.getAllQuizzes()
          set({ quizzes })
        } catch (error) {
          console.error("Failed to load quizzes from storage:", error)
        }
      },
      
      // Editor state
      editor: {
        quiz: null,
        isDirty: false,
        isLoading: false,
      },
      setEditorQuiz: (quiz) =>
        set((state) => ({
          editor: { ...state.editor, quiz, isDirty: false },
        })),
      setEditorLoading: (isLoading) =>
        set((state) => ({
          editor: { ...state.editor, isLoading },
        })),
      setEditorError: (error) =>
        set((state) => ({
          editor: { ...state.editor, error },
        })),
      setEditorDirty: (isDirty) =>
        set((state) => ({
          editor: { ...state.editor, isDirty },
        })),
      
      // Player state
      player: null,
      initPlayer: (quiz) => {
        // Questions will be shuffled in the UI component if needed
          
        set({
          player: {
            currentQuestionIndex: 0,
            answers: {},
            startTime: new Date(),
            timeRemaining: quiz.settings.timeLimit ? quiz.settings.timeLimit * 60 : undefined,
            isFinished: false,
            showResults: false,
          },
        })
      },
      setCurrentQuestion: (index) =>
        set((state) => ({
          player: state.player ? { ...state.player, currentQuestionIndex: index } : null,
        })),
      setAnswer: (questionId, answer) =>
        set((state) => ({
          player: state.player
            ? {
                ...state.player,
                answers: { ...state.player.answers, [questionId]: answer },
              }
            : null,
        })),
      finishQuiz: () =>
        set((state) => ({
          player: state.player
            ? { ...state.player, isFinished: true, showResults: true }
            : null,
        })),
      resetPlayer: () => set({ player: null }),
      
      // Actions
      createNewQuiz: () => {
        const now = new Date()
        return {
          id: generateId(),
          title: "New Quiz",
          description: "",
          questions: [],
          createdAt: now,
          updatedAt: now,
          settings: defaultQuizSettings,
        }
      },
      duplicateQuiz: (quiz) => {
        const now = new Date()
        return {
          ...quiz,
          id: generateId(),
          title: `${quiz.title} (Copy)`,
          createdAt: now,
          updatedAt: now,
        }
      },
    }),
    { name: "quiz-store" }
  )
)
