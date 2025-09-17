import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Theme = "dark" | "light" | "system"

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "quiz-presenter-theme",
    }
  )
)

export function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function getActualTheme(theme: Theme): "dark" | "light" {
  if (theme === "system") {
    return getSystemTheme()
  }
  return theme
}

export function applyTheme(theme: Theme) {
  const actualTheme = getActualTheme(theme)
  const root = window.document.documentElement
  
  root.classList.remove("light", "dark")
  root.classList.add(actualTheme)
}
