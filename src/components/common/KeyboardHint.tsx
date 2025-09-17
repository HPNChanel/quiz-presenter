import { cn } from "@/lib/utils"

interface KeyboardHintProps {
  keys: string[]
  description: string
  className?: string
}

export function KeyboardHint({ keys, description, className }: KeyboardHintProps) {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <kbd
            key={index}
            className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
          >
            {key}
          </kbd>
        ))}
      </div>
      <span>{description}</span>
    </div>
  )
}

interface KeyboardHintsProps {
  hints: Array<{ keys: string[]; description: string }>
  className?: string
}

export function KeyboardHints({ hints, className }: KeyboardHintsProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {hints.map((hint, index) => (
        <KeyboardHint
          key={index}
          keys={hint.keys}
          description={hint.description}
        />
      ))}
    </div>
  )
}
