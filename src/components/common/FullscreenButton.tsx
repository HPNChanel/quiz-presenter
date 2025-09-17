import { Maximize, Minimize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFullscreen } from "@/lib/hooks"
import { cn } from "@/lib/utils"

interface FullscreenButtonProps {
  className?: string
}

export function FullscreenButton({ className }: FullscreenButtonProps) {
  const { isFullscreen, toggleFullscreen } = useFullscreen()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleFullscreen}
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      className={cn(className)}
    >
      {isFullscreen ? (
        <Minimize className="h-4 w-4" />
      ) : (
        <Maximize className="h-4 w-4" />
      )}
      <span className="sr-only">
        {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      </span>
    </Button>
  )
}
