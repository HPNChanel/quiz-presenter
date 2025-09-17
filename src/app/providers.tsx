import { useEffect } from "react"
import type { ReactNode } from "react"
import { Toaster } from "react-hot-toast"
import { useThemeEffect } from "@/lib/hooks"
import { initializeApp } from "@/lib/init"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  useThemeEffect()

  useEffect(() => {
    initializeApp()
  }, [])

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
          success: {
            iconTheme: {
              primary: "hsl(var(--primary))",
              secondary: "hsl(var(--primary-foreground))",
            },
          },
          error: {
            iconTheme: {
              primary: "hsl(var(--destructive))",
              secondary: "hsl(var(--destructive-foreground))",
            },
          },
        }}
      />
    </>
  )
}
