
import React, { useState } from 'react'
import { Send, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ChatInterfaceProps {
  currentAnswer: string
  currentQuestion: string
  isLoading: boolean
  showFeedback: boolean
  backendStatus: 'checking' | 'ready' | 'error'
  onSubmitQuestion: (question: string) => void
  onSubmitFeedback: (rating: '👍 Yes' | '👎 No', comment: string) => void
  isSubmittingFeedback: boolean
}

export function ChatInterface({
  currentAnswer,
  currentQuestion,
  isLoading,
  showFeedback,
  backendStatus,
  onSubmitQuestion,
  onSubmitFeedback,
  isSubmittingFeedback
}: ChatInterfaceProps) {
  const [question, setQuestion] = useState('')
  const [feedbackRating, setFeedbackRating] = useState<'👍 Yes' | '👎 No' | ''>('')
  const [feedbackComment, setFeedbackComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    onSubmitQuestion(question)
    setQuestion('')
  }

  const handleFeedbackSubmit = () => {
    if (!feedbackRating) return
    onSubmitFeedback(feedbackRating, feedbackComment)
    setFeedbackRating('')
    setFeedbackComment('')
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20">
      {/* Modern Header with Glassmorphism */}
      <div className="sticky top-0 z-10 p-4 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {backendStatus === 'checking' && (
                <>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50 dark:bg-amber-950/50">
                    Connecting...
                  </Badge>
                </>
              )}
              {backendStatus === 'ready' && (
                <>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-sm shadow-emerald-500/50"></div>
                  <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/50">
                    Ready
                  </Badge>
                </>
              )}
              {backendStatus === 'error' && (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <Badge variant="outline" className="text-red-700 border-red-200 bg-red-50 dark:bg-red-950/50">
                    Disconnected
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area with improved spacing */}
      <div className="flex-1 overflow-y-auto p-6 pb-40">
        {!currentAnswer && !isLoading && (
          <div className="text-center py-20 max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 mb-6">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Bignalytics AI
              </h1>
              <p className="text-muted-foreground text-xl leading-relaxed">
                Your intelligent assistant for instant answers about Bignalytics. 
                Ask anything and get detailed, accurate responses.
              </p>
            </div>
          </div>
        )}

        {/* Modern Conversation Layout */}
        {(currentQuestion || currentAnswer || isLoading) && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* User question with modern styling */}
            {currentQuestion && (
              <div className="flex justify-end animate-fade-in">
                <div className="bg-primary text-primary-foreground rounded-3xl rounded-br-lg px-6 py-4 max-w-2xl shadow-lg">
                  <p className="text-sm leading-relaxed">{currentQuestion}</p>
                </div>
              </div>
            )}

            {/* Assistant response with enhanced design */}
            {(currentAnswer || isLoading) && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-card border border-border/50 rounded-3xl rounded-bl-lg px-6 py-4 max-w-3xl shadow-lg">
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed m-0">{currentAnswer}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modern Feedback Section */}
            {showFeedback && currentAnswer && (
              <div className="flex justify-start animate-fade-in">
                <div className="max-w-md">
                  <Card className="p-6 border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <p className="text-sm font-medium text-foreground">Was this helpful?</p>
                    </div>
                    <div className="flex gap-3 mb-4">
                      <Button
                        variant={feedbackRating === '👍 Yes' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFeedbackRating('👍 Yes')}
                        className="flex-1 rounded-xl"
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Yes
                      </Button>
                      <Button
                        variant={feedbackRating === '👎 No' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFeedbackRating('👎 No')}
                        className="flex-1 rounded-xl"
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        No
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Share your thoughts (optional)..."
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      className="mb-4 rounded-xl border-border/50 resize-none"
                      rows={2}
                    />
                    <Button
                      onClick={handleFeedbackSubmit}
                      disabled={!feedbackRating || isSubmittingFeedback}
                      size="sm"
                      className="w-full rounded-xl"
                    >
                      {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modern Input Area with Glassmorphism */}
      <div className="fixed bottom-0 left-64 right-0 p-6 bg-background/80 backdrop-blur-xl border-t border-border/50">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about Bignalytics..."
              className="resize-none pr-14 min-h-[56px] rounded-2xl border-2 border-border/50 bg-background/50 backdrop-blur-sm shadow-lg focus:border-primary/50 focus:bg-background transition-all duration-200"
              disabled={isLoading || backendStatus !== 'ready'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !question.trim() || backendStatus !== 'ready'}
              className="absolute bottom-2 right-2 h-10 w-10 rounded-xl shadow-lg bg-primary hover:bg-primary/90 transition-all duration-200"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </form>
      </div>
    </div>
  )
}
