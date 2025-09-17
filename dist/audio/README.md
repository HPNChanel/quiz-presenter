# Audio Files for Quiz Presenter

This directory should contain the following audio files for the best quiz experience:

## Required Audio Files

### 1. Quiz Start Sound
- **File**: `quiz-start.mp3` or `quiz-start.wav`
- **Description**: Played when a quiz begins
- **Suggested**: Upbeat, welcoming sound (2-3 seconds)

### 2. Question Transition
- **File**: `question-next.mp3` or `question-next.wav`
- **Description**: Played when moving to the next question
- **Suggested**: Soft transition sound (1-2 seconds)

### 3. Correct Answer ✅
- **File**: `right-choices.wav` (AVAILABLE)
- **Description**: Played when user selects correct answer
- **Status**: Custom sound file loaded and ready

### 4. Incorrect Answer ❌
- **File**: `wrong-choices.wav` (AVAILABLE)
- **Description**: Played when user selects wrong answer
- **Status**: Custom sound file loaded and ready

### 5. Quiz Complete
- **File**: `quiz-complete.mp3` or `quiz-complete.wav`
- **Description**: Played when quiz is finished
- **Suggested**: Achievement/completion sound (3-4 seconds)

### 6. Timer Tick
- **File**: `tick.mp3` or `tick.wav`
- **Description**: Played for countdown timers
- **Suggested**: Subtle tick sound (0.5 seconds)

### 7. Button Click
- **File**: `click.mp3` or `click.wav`
- **Description**: Played on button interactions
- **Suggested**: Subtle UI click sound (0.3 seconds)

## Audio Sources

You can find free audio files from:
- **Freesound.org** (CC licensed sounds)
- **Zapsplat.com** (free with registration)
- **Adobe Stock Audio** (paid)
- **YouTube Audio Library** (free)

## Audio Format Recommendations

- **Format**: MP3 (primary) + WAV (fallback)
- **Quality**: 44.1kHz, 16-bit minimum
- **Duration**: Keep sounds short (0.3-4 seconds)
- **Volume**: Normalize to consistent levels

## Implementation

The audio system will automatically:
- Try to load MP3 first, then WAV as fallback
- Handle loading errors gracefully
- Respect user mute settings
- Provide volume control

If audio files are not found, the app will continue to work normally without sound effects.
