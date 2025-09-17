import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAudio } from "@/lib/audio"
import { Volume2, CheckCircle, XCircle } from "lucide-react"

export function AudioTest() {
  const { play } = useAudio()

  return (
    <Card className="glass border-0 shadow-xl max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 gradient-text">
          <Volume2 className="h-5 w-5" />
          Audio Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => play('correct')}
            className="gradient-bg-nature text-white hover:opacity-90 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Right Choice
          </Button>
          <Button 
            onClick={() => play('incorrect')}
            className="gradient-bg-warm text-white hover:opacity-90 flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Wrong Choice
          </Button>
        </div>
        <div className="text-center">
          <Button 
            onClick={() => play('quizStart')}
            variant="outline"
            className="glass border-2 hover-lift"
          >
            Test Quiz Start Sound
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          🎧 Make sure your audio is enabled to hear the sounds
        </p>
      </CardContent>
    </Card>
  )
}
