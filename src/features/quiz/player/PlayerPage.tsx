import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Play, Volume2, CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuizStore } from "../store"
import { quizStorage } from "../storage"
import { useAudio } from "@/lib/audio"
import toast from "react-hot-toast"
import type { Question } from "../types"

export function PlayerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { initPlayer, player, setAnswer, setCurrentQuestion, finishQuiz, resetPlayer } = useQuizStore()
  const { play } = useAudio()
  const [quiz, setQuiz] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)
  const [canProceed, setCanProceed] = useState(false)

  useEffect(() => {
    loadQuiz()
  }, [id])

  const loadQuiz = async () => {
    if (!id) {
      navigate("/library")
      return
    }

    try {
      const loadedQuiz = await quizStorage.getQuiz(id)
      if (loadedQuiz) {
        setQuiz(loadedQuiz)
      } else {
        toast.error("Quiz not found")
        navigate("/library")
      }
    } catch (error) {
      toast.error("Failed to load quiz")
      console.error("Error loading quiz:", error)
      navigate("/library")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartQuiz = () => {
    if (quiz) {
      play('quizStart')
      initPlayer(quiz)
    }
  }

  const handleAnswerSelect = (answer: any) => {
    if (showFeedback) return // Prevent changing answer after feedback is shown
    
    setSelectedAnswer(answer)
    const currentQuestion = getCurrentQuestion()
    if (!currentQuestion) return

    // Check if answer is correct
    const correct = checkAnswer(currentQuestion, answer)
    setIsAnswerCorrect(correct)
    
    // Show feedback immediately
    setShowFeedback(true)
    setCanProceed(true)
    
    // Play audio feedback
    if (correct) {
      play('correct')
      toast.success('Correct!')
    } else {
      play('incorrect')
      toast.error('Incorrect!')
    }

    // Save answer to store
    if (player) {
      setAnswer(currentQuestion.id, answer)
    }
  }

  const handleNextQuestion = () => {
    if (!player || !quiz) return

    const nextIndex = player.currentQuestionIndex + 1
    
    if (nextIndex >= quiz.questions.length) {
      // Quiz finished
      finishQuiz()
    } else {
      // Move to next question
      setCurrentQuestion(nextIndex)
      resetQuestionState()
    }
  }

  const resetQuestionState = () => {
    setSelectedAnswer(null)
    setShowFeedback(false)
    setIsAnswerCorrect(false)
    setCanProceed(false)
  }

  const getCurrentQuestion = (): Question | null => {
    if (!quiz || !player) return null
    return quiz.questions[player.currentQuestionIndex] || null
  }

  const checkAnswer = (question: Question, answer: any): boolean => {
    switch (question.type) {
      case 'multiple-choice':
        return answer === question.correctAnswer
      case 'true-false':
        return answer === question.correctAnswer
      case 'short-answer':
        if (typeof question.correctAnswer === 'string' && typeof answer === 'string') {
          return answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()
        }
        return answer === question.correctAnswer
      case 'essay':
        // For essay questions, we'll consider any non-empty answer as "correct" for now
        return answer && answer.trim().length > 0
      default:
        return false
    }
  }

  const calculateResults = () => {
    if (!quiz || !player) return { correct: 0, total: 0, percentage: 0, totalPoints: 0, earnedPoints: 0 }
    
    let correct = 0
    let earnedPoints = 0
    const totalPoints = quiz.questions.reduce((sum: number, q: Question) => sum + q.points, 0)
    
    quiz.questions.forEach((question: Question) => {
      const userAnswer = player.answers[question.id]
      if (userAnswer !== undefined && checkAnswer(question, userAnswer)) {
        correct++
        earnedPoints += question.points
      }
    })
    
    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
      totalPoints,
      earnedPoints
    }
  }

  const handleRestartQuiz = () => {
    resetPlayer()
    resetQuestionState()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Quiz not found</p>
        <Button className="mt-4" onClick={() => navigate("/library")}>
          Back to Library
        </Button>
      </div>
    )
  }

  if (player) {
    const currentQuestion = getCurrentQuestion()
    const results = calculateResults()

    // Show results screen
    if (player.showResults) {
      const passed = quiz.settings.passingScore ? results.percentage >= quiz.settings.passingScore : true
      
      return (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate("/library")} className="hover-lift glass">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>
            <Button variant="outline" size="sm" onClick={handleRestartQuiz} className="hover-lift glass">
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>

          {/* Results Card */}
          <Card className="glass border-0 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className={`mx-auto p-4 rounded-full w-fit ${passed ? 'gradient-bg-nature' : 'gradient-bg-warm'}`}>
                {passed ? <Trophy className="h-12 w-12 text-white" /> : <Target className="h-12 w-12 text-white" />}
              </div>
              <CardTitle className="text-3xl gradient-text">
                {passed ? 'Congratulations!' : 'Quiz Complete!'}
              </CardTitle>
              <p className="text-lg text-muted-foreground">
                {passed ? 'You passed the quiz!' : 'Better luck next time!'}
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Score Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 glass rounded-lg">
                  <div className="text-3xl font-bold gradient-text">{results.correct}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="text-center p-4 glass rounded-lg">
                  <div className="text-3xl font-bold gradient-text-warm">{results.total - results.correct}</div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
                <div className="text-center p-4 glass rounded-lg">
                  <div className="text-3xl font-bold gradient-text">{results.percentage}%</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
                <div className="text-center p-4 glass rounded-lg">
                  <div className="text-3xl font-bold gradient-text">{results.earnedPoints}/{results.totalPoints}</div>
                  <div className="text-sm text-muted-foreground">Points</div>
                </div>
              </div>

              {/* Pass/Fail Status */}
              {quiz.settings.passingScore && (
                <div className={`p-4 rounded-lg text-center ${passed ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                  <div className={`text-lg font-semibold ${passed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                    {passed ? '✅ PASSED' : '❌ FAILED'}
                  </div>
                  <div className={`text-sm ${passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    Required: {quiz.settings.passingScore}% | Your Score: {results.percentage}%
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button size="lg" onClick={handleRestartQuiz} className="gradient-bg-cool text-white hover:opacity-90 hover-lift">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/library")} className="hover-lift glass border-2">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Library
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    // Show question interface
    if (!currentQuestion) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No questions available</p>
        </div>
      )
    }

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/library")} className="hover-lift glass">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit Quiz
          </Button>
          <div className="text-sm text-muted-foreground">
            Question {player.currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="gradient-bg h-2 rounded-full transition-all duration-300"
            style={{ width: `${((player.currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <Card className="glass border-0 shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl gradient-text">
                {currentQuestion.question}
              </CardTitle>
              <div className="text-sm text-muted-foreground bg-white/10 px-3 py-1 rounded-full">
                {currentQuestion.points} pts
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Options */}
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index
                  const isCorrect = index === currentQuestion.correctAnswer
                  const showCorrectAnswer = showFeedback && quiz.settings.showCorrectAnswers
                  
                  let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all hover-lift "
                  
                  if (showFeedback) {
                    if (isSelected && isAnswerCorrect) {
                      buttonClass += "bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-300"
                    } else if (isSelected && !isAnswerCorrect) {
                      buttonClass += "bg-red-100 dark:bg-red-900 border-red-500 text-red-700 dark:text-red-300"
                    } else if (showCorrectAnswer && isCorrect) {
                      buttonClass += "bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-300"
                    } else {
                      buttonClass += "glass border-white/20"
                    }
                  } else {
                    if (isSelected) {
                      buttonClass += "gradient-bg text-white border-transparent"
                    } else {
                      buttonClass += "glass border-white/20 hover:border-white/40"
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={buttonClass}
                      disabled={showFeedback}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showFeedback && (
                          <div className="flex items-center space-x-2">
                            {isSelected && isAnswerCorrect && <CheckCircle className="h-5 w-5" />}
                            {isSelected && !isAnswerCorrect && <XCircle className="h-5 w-5" />}
                            {showCorrectAnswer && isCorrect && !isSelected && <CheckCircle className="h-5 w-5" />}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* True/False Questions */}
            {currentQuestion.type === 'true-false' && (
              <div className="space-y-3">
                {[true, false].map((option) => {
                  const isSelected = selectedAnswer === option
                  const isCorrect = option === currentQuestion.correctAnswer
                  const showCorrectAnswer = showFeedback && quiz.settings.showCorrectAnswers
                  
                  let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all hover-lift "
                  
                  if (showFeedback) {
                    if (isSelected && isAnswerCorrect) {
                      buttonClass += "bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-300"
                    } else if (isSelected && !isAnswerCorrect) {
                      buttonClass += "bg-red-100 dark:bg-red-900 border-red-500 text-red-700 dark:text-red-300"
                    } else if (showCorrectAnswer && isCorrect) {
                      buttonClass += "bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-300"
                    } else {
                      buttonClass += "glass border-white/20"
                    }
                  } else {
                    if (isSelected) {
                      buttonClass += "gradient-bg text-white border-transparent"
                    } else {
                      buttonClass += "glass border-white/20 hover:border-white/40"
                    }
                  }

                  return (
                    <button
                      key={option.toString()}
                      onClick={() => handleAnswerSelect(option)}
                      className={buttonClass}
                      disabled={showFeedback}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">{option ? 'True' : 'False'}</span>
                        {showFeedback && (
                          <div className="flex items-center space-x-2">
                            {isSelected && isAnswerCorrect && <CheckCircle className="h-5 w-5" />}
                            {isSelected && !isAnswerCorrect && <XCircle className="h-5 w-5" />}
                            {showCorrectAnswer && isCorrect && !isSelected && <CheckCircle className="h-5 w-5" />}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Short Answer Questions */}
            {currentQuestion.type === 'short-answer' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Type your answer..."
                  className="w-full p-4 border-2 rounded-lg glass border-white/20 focus:border-blue-500 focus:outline-none"
                  value={selectedAnswer || ''}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  disabled={showFeedback}
                />
                {!showFeedback && (
                  <Button 
                    onClick={() => handleAnswerSelect(selectedAnswer)}
                    disabled={!selectedAnswer || selectedAnswer.trim().length === 0}
                    className="gradient-bg text-white hover:opacity-90 hover-lift"
                  >
                    Submit Answer
                  </Button>
                )}
              </div>
            )}

            {/* Essay Questions */}
            {currentQuestion.type === 'essay' && (
              <div className="space-y-4">
                <textarea
                  placeholder="Type your essay answer..."
                  rows={6}
                  className="w-full p-4 border-2 rounded-lg glass border-white/20 focus:border-blue-500 focus:outline-none resize-none"
                  value={selectedAnswer || ''}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  disabled={showFeedback}
                />
                {!showFeedback && (
                  <Button 
                    onClick={() => handleAnswerSelect(selectedAnswer)}
                    disabled={!selectedAnswer || selectedAnswer.trim().length === 0}
                    className="gradient-bg text-white hover:opacity-90 hover-lift"
                  >
                    Submit Answer
                  </Button>
                )}
              </div>
            )}

            {/* Feedback Section */}
            {showFeedback && (
              <div className={`p-4 rounded-lg ${isAnswerCorrect ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                <div className={`flex items-center space-x-2 mb-2 ${isAnswerCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                  {isAnswerCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  <span className="font-semibold">
                    {isAnswerCorrect ? 'Correct!' : 'Incorrect!'}
                  </span>
                </div>
                
                {/* Show correct answer for incorrect responses */}
                {!isAnswerCorrect && quiz.settings.showCorrectAnswers && (
                  <div className="mb-2">
                    <span className="font-medium">Correct answer: </span>
                    {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                      <span>{currentQuestion.options[currentQuestion.correctAnswer as number]}</span>
                    )}
                    {currentQuestion.type === 'true-false' && (
                      <span>{currentQuestion.correctAnswer ? 'True' : 'False'}</span>
                    )}
                    {(currentQuestion.type === 'short-answer' || currentQuestion.type === 'essay') && (
                      <span>{currentQuestion.correctAnswer as string}</span>
                    )}
                  </div>
                )}
                
                {/* Show explanation if available */}
                {currentQuestion.explanation && (
                  <div className={`text-sm ${isAnswerCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    <span className="font-medium">Explanation: </span>
                    {currentQuestion.explanation}
                  </div>
                )}
              </div>
            )}

            {/* Next Button */}
            {canProceed && (
              <div className="pt-4 text-center">
                <Button 
                  size="lg" 
                  onClick={handleNextQuestion}
                  className="gradient-bg-nature text-white hover:opacity-90 hover-lift px-8"
                >
                  {player.currentQuestionIndex + 1 >= quiz.questions.length ? (
                    <>
                      <Trophy className="h-5 w-5 mr-2" />
                      Finish Quiz
                    </>
                  ) : (
                    <>
                      Next Question
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/library")} className="hover-lift glass">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Library
        </Button>
      </div>

      {/* Quiz Info */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-4 gradient-bg-cool rounded-full w-fit">
            <Play className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-3xl gradient-text">{quiz.title}</CardTitle>
          {quiz.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{quiz.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Quiz Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 glass rounded-lg">
              <div className="text-2xl font-bold gradient-text">{quiz.questions.length}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="text-center p-4 glass rounded-lg">
              <div className="text-2xl font-bold gradient-text">
                {quiz.questions.reduce((sum: number, q: any) => sum + q.points, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
            <div className="text-center p-4 glass rounded-lg">
              <div className="text-2xl font-bold gradient-text">
                {quiz.settings.timeLimit || "∞"}
              </div>
              <div className="text-sm text-muted-foreground">
                {quiz.settings.timeLimit ? "Minutes" : "No Limit"}
              </div>
            </div>
            <div className="text-center p-4 glass rounded-lg">
              <div className="text-2xl font-bold gradient-text">
                {quiz.settings.passingScore || "—"}
              </div>
              <div className="text-sm text-muted-foreground">
                {quiz.settings.passingScore ? "Pass %" : "No Requirement"}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium gradient-text mb-3">Quiz Features</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {quiz.settings.shuffleQuestions && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    🔀 Shuffled Questions
                  </span>
                )}
                {quiz.settings.shuffleOptions && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                    🎲 Shuffled Options
                  </span>
                )}
                {quiz.settings.showCorrectAnswers && (
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                    ✅ Show Answers
                  </span>
                )}
                {quiz.settings.allowReview && (
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm">
                    👁️ Allow Review
                  </span>
                )}
                <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full text-sm">
                  🔊 Audio Effects
                </span>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="pt-6 text-center">
            <Button size="lg" onClick={handleStartQuiz} className="gradient-bg-nature text-white hover:opacity-90 hover-lift text-xl px-12 py-4 pulse-glow">
              <Play className="h-6 w-6 mr-3" />
              Start Quiz
              <Volume2 className="h-5 w-5 ml-3" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              🎧 For the best experience, make sure your audio is turned on
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
