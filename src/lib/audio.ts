import { Howl, Howler } from 'howler'

export type SoundName = 'quizStart' | 'questionNext' | 'correct' | 'incorrect' | 'quizComplete' | 'tick' | 'click'

export class AudioManager {
  private sounds: Record<SoundName, Howl> = {} as Record<SoundName, Howl>
  private isMuted = false

  constructor() {
    this.loadSounds()
  }

  private loadSounds() {
    // Quiz start sound
    this.sounds.quizStart = new Howl({
      src: ['/audio/quiz-start.mp3', '/audio/quiz-start.wav'],
      volume: 0.7,
      preload: false, // Don't preload missing files
      onloaderror: () => {
        // Silent fallback - no console warning for optional sounds
      }
    })

    // Question transition sound
    this.sounds.questionNext = new Howl({
      src: ['/audio/question-next.mp3', '/audio/question-next.wav'],
      volume: 0.5,
      preload: false, // Don't preload missing files
      onloaderror: () => {
        // Silent fallback - no console warning for optional sounds
      }
    })

    // Correct answer sound
    this.sounds.correct = new Howl({
      src: ['/audio/right-choices.wav', '/audio/right-choices.mp3', '/audio/correct.wav', '/audio/correct.mp3'],
      volume: 0.6,
      preload: true, // Keep preload for available sounds
      onloaderror: () => {
        console.info('✅ Right choice sound not found - quiz will work without audio effects')
      }
    })

    // Incorrect answer sound
    this.sounds.incorrect = new Howl({
      src: ['/audio/wrong-choices.wav', '/audio/wrong-choices.mp3', '/audio/incorrect.wav', '/audio/incorrect.mp3'],
      volume: 0.6,
      preload: true, // Keep preload for available sounds
      onloaderror: () => {
        console.info('❌ Wrong choice sound not found - quiz will work without audio effects')
      }
    })

    // Quiz complete sound
    this.sounds.quizComplete = new Howl({
      src: ['/audio/quiz-complete.mp3', '/audio/quiz-complete.wav'],
      volume: 0.8,
      preload: false, // Don't preload missing files
      onloaderror: () => {
        // Silent fallback - no console warning for optional sounds
      }
    })

    // Tick/timer sound
    this.sounds.tick = new Howl({
      src: ['/audio/tick.mp3', '/audio/tick.wav'],
      volume: 0.3,
      preload: false, // Don't preload missing files
      onloaderror: () => {
        // Silent fallback - no console warning for optional sounds
      }
    })

    // Button click sound
    this.sounds.click = new Howl({
      src: ['/audio/click.mp3', '/audio/click.wav'],
      volume: 0.4,
      preload: false, // Don't preload missing files
      onloaderror: () => {
        // Silent fallback - no console warning for optional sounds
      }
    })
  }

  play(soundName: SoundName) {
    if (this.isMuted) return
    
    const sound = this.sounds[soundName]
    if (sound) {
      sound.play()
    }
  }

  setMute(muted: boolean) {
    this.isMuted = muted
    Howler.mute(muted)
  }

  setVolume(volume: number) {
    Howler.volume(volume)
  }

  getMuted(): boolean {
    return this.isMuted
  }

  // Stop all sounds
  stopAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.stop()
    })
  }

  // Fade in sound
  fadeIn(soundName: SoundName, duration = 1000) {
    if (this.isMuted) return
    
    const sound = this.sounds[soundName]
    if (sound) {
      sound.volume(0)
      sound.play()
      sound.fade(0, 0.7, duration)
    }
  }

  // Fade out sound
  fadeOut(soundName: SoundName, duration = 1000) {
    const sound = this.sounds[soundName]
    if (sound && sound.playing()) {
      sound.fade(sound.volume(), 0, duration)
      setTimeout(() => sound.stop(), duration)
    }
  }
}

// Global audio manager instance
export const audioManager = new AudioManager()

// Audio hook for React components
export function useAudio() {
  return {
    play: (soundName: SoundName) => audioManager.play(soundName),
    setMute: (muted: boolean) => audioManager.setMute(muted),
    setVolume: (volume: number) => audioManager.setVolume(volume),
    getMuted: () => audioManager.getMuted(),
    stopAll: () => audioManager.stopAll(),
    fadeIn: (soundName: SoundName, duration?: number) => 
      audioManager.fadeIn(soundName, duration),
    fadeOut: (soundName: SoundName, duration?: number) => 
      audioManager.fadeOut(soundName, duration),
  }
}
