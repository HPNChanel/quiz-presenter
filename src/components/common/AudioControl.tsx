import { useState, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/lib/audio"
import { cn } from "@/lib/utils"

interface AudioControlProps {
  className?: string
}

export function AudioControl({ className }: AudioControlProps) {
  const { setMute, getMuted } = useAudio()
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    setIsMuted(getMuted())
  }, [])

  const toggleMute = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    setMute(newMutedState)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMute}
      title={isMuted ? "Unmute sounds" : "Mute sounds"}
      className={cn(className)}
    >
      {isMuted ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      <span className="sr-only">
        {isMuted ? "Unmute sounds" : "Mute sounds"}
      </span>
    </Button>
  )
}
