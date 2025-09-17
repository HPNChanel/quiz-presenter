import type { Quiz } from "./types"
import { generateId } from "@/lib/utils"

export function createSampleQuizzes(): Quiz[] {
  const now = new Date()
  
  return [
    {
      id: generateId(),
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of basic JavaScript concepts",
      createdAt: now,
      updatedAt: now,
      settings: {
        shuffleQuestions: false,
        shuffleOptions: true,
        showCorrectAnswers: true,
        allowReview: true,
        timeLimit: 30,
        passingScore: 70,
      },
      questions: [
        {
          id: generateId(),
          type: "multiple-choice",
          question: "Which of the following is NOT a JavaScript data type?",
          options: ["String", "Boolean", "Integer", "Undefined"],
          correctAnswer: 2,
          explanation: "JavaScript has Number type, not Integer specifically.",
          points: 10,
          timeLimit: 60,
        },
        {
          id: generateId(),
          type: "true-false",
          question: "JavaScript is a statically typed language.",
          correctAnswer: false,
          explanation: "JavaScript is dynamically typed - variables can hold different types.",
          points: 5,
        },
        {
          id: generateId(),
          type: "short-answer",
          question: "What keyword is used to declare a constant in JavaScript?",
          correctAnswer: "const",
          explanation: "The 'const' keyword declares a constant variable.",
          points: 5,
        },
        {
          id: generateId(),
          type: "multiple-choice",
          question: "What will `typeof null` return in JavaScript?",
          options: ["null", "undefined", "object", "boolean"],
          correctAnswer: 2,
          explanation: "This is a well-known quirk in JavaScript - typeof null returns 'object'.",
          points: 15,
        },
      ],
    },
    {
      id: generateId(),
      title: "React Hooks Quiz",
      description: "Test your understanding of React Hooks",
      createdAt: now,
      updatedAt: now,
      settings: {
        shuffleQuestions: true,
        shuffleOptions: false,
        showCorrectAnswers: true,
        allowReview: true,
        passingScore: 80,
      },
      questions: [
        {
          id: generateId(),
          type: "multiple-choice",
          question: "Which Hook should you use to perform side effects in functional components?",
          options: ["useState", "useEffect", "useContext", "useReducer"],
          correctAnswer: 1,
          explanation: "useEffect is used for side effects like API calls, subscriptions, etc.",
          points: 10,
        },
        {
          id: generateId(),
          type: "true-false",
          question: "You can call Hooks inside loops or conditions.",
          correctAnswer: false,
          explanation: "Hooks must always be called at the top level of React functions.",
          points: 10,
        },
        {
          id: generateId(),
          type: "essay",
          question: "Explain the difference between useState and useReducer. When would you choose one over the other?",
          points: 20,
        },
      ],
    },
    {
      id: generateId(),
      title: "Math Quiz",
      description: "Basic mathematics with LaTeX formulas",
      createdAt: now,
      updatedAt: now,
      settings: {
        shuffleQuestions: false,
        shuffleOptions: false,
        showCorrectAnswers: true,
        allowReview: true,
        timeLimit: 15,
        passingScore: 60,
      },
      questions: [
        {
          id: generateId(),
          type: "multiple-choice",
          question: "What is the solution to the quadratic equation $x^2 - 5x + 6 = 0$?",
          options: ["$x = 2, 3$", "$x = 1, 6$", "$x = -2, -3$", "$x = 0, 5$"],
          correctAnswer: 0,
          explanation: "Factoring: $(x-2)(x-3) = 0$, so $x = 2$ or $x = 3$",
          points: 15,
        },
        {
          id: generateId(),
          type: "short-answer",
          question: "Calculate: $\\sqrt{16} + 3^2$",
          correctAnswer: "13",
          explanation: "$\\sqrt{16} = 4$ and $3^2 = 9$, so $4 + 9 = 13$",
          points: 10,
        },
        {
          id: generateId(),
          type: "multiple-choice",
          question: "What is the derivative of $f(x) = x^3 + 2x^2 - 5x + 1$?",
          options: [
            "$f'(x) = 3x^2 + 4x - 5$",
            "$f'(x) = x^2 + 2x - 5$",
            "$f'(x) = 3x^2 + 2x - 5$",
            "$f'(x) = 3x + 4x - 5$"
          ],
          correctAnswer: 0,
          explanation: "Using power rule: $\\frac{d}{dx}[x^n] = nx^{n-1}$",
          points: 20,
        },
      ],
    },
  ]
}
