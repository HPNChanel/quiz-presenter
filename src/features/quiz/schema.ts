import { z } from "zod"

export const questionSchema = z.object({
  id: z.string(),
  type: z.enum(["multiple-choice", "true-false", "short-answer", "essay"]),
  question: z.string().min(1, "Question is required"),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.number()]).optional(),
  explanation: z.string().optional(),
  points: z.number().min(1, "Points must be at least 1"),
  timeLimit: z.number().optional(),
})

export const quizSettingsSchema = z.object({
  shuffleQuestions: z.boolean(),
  shuffleOptions: z.boolean(),
  showCorrectAnswers: z.boolean(),
  allowReview: z.boolean(),
  timeLimit: z.number().optional(),
  passingScore: z.number().min(0).max(100).optional(),
})

export const quizSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, "At least one question is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
  settings: quizSettingsSchema,
})

export const quizResultSchema = z.object({
  id: z.string(),
  quizId: z.string(),
  answers: z.record(z.string(), z.any()),
  score: z.number(),
  totalPoints: z.number(),
  startTime: z.date(),
  endTime: z.date(),
  passed: z.boolean(),
})

export type QuestionInput = z.infer<typeof questionSchema>
export type QuizInput = z.infer<typeof quizSchema>
export type QuizSettingsInput = z.infer<typeof quizSettingsSchema>
export type QuizResultInput = z.infer<typeof quizResultSchema>
