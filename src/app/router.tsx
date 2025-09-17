import { createBrowserRouter, Navigate } from "react-router-dom"
import { Layout } from "./layout"
import { Home } from "@/pages/Home"
import { Library } from "@/pages/Library"
import { Settings } from "@/pages/Settings"
import { NotFound } from "@/pages/NotFound"
import { QuizEditorPage } from "@/features/quiz/editor/QuizEditorPage"
import { QuestionEditorPage } from "@/features/quiz/editor/QuestionEditorPage"
import { PlayerPage } from "@/features/quiz/player/PlayerPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "library",
        element: <Library />,
      },
      {
        path: "editor",
        element: <Navigate to="/editor/new" replace />,
      },
      {
        path: "editor/:id",
        element: <QuizEditorPage />,
      },
      {
        path: "editor/:quizId/question/new",
        element: <QuestionEditorPage />,
      },
      {
        path: "editor/:quizId/question/:questionId",
        element: <QuestionEditorPage />,
      },
      {
        path: "play/:id",
        element: <PlayerPage />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
])
