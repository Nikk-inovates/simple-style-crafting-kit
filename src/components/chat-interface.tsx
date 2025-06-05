
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
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Modern Header with enhanced glassmorphism */}
      <div className="sticky top-0 z-20 p-6 border-b border-border/30 bg-background/60 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              {backendStatus === 'checking' && (
                <div className="flex items-center gap-2 animate-fade-in">
                  <div className="relative">
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-amber-500 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <Badge variant="outline" className="text-amber-700 border-amber-200/50 bg-amber-50/80 dark:bg-amber-950/30 backdrop-blur-sm transition-all duration-300">
                    Connecting...
                  </Badge>
                </div>
              )}
              {backendStatus === 'ready' && (
                <div className="flex items-center gap-2 animate-fade-in">
                  <div className="relative">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                  </div>
                  <Badge variant="outline" className="text-emerald-700 border-emerald-200/50 bg-emerald-50/80 dark:bg-emerald-950/30 backdrop-blur-sm transition-all duration-300">
                    Ready
                  </Badge>
                </div>
              )}
              {backendStatus === 'error' && (
                <div className="flex items-center gap-2 animate-fade-in">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <Badge variant="outline" className="text-red-700 border-red-200/50 bg-red-50/80 dark:bg-red-950/30 backdrop-blur-sm transition-all duration-300">
                    Disconnected
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area with enhanced animations */}
      <div className="flex-1 overflow-y-auto p-6 pb-32 relative">
        {!currentAnswer && !isLoading && (
          <div className="text-center py-16 max-w-2xl mx-auto animate-fade-in">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent mb-8 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/20 animate-pulse"></div>
                <Sparkles className="w-12 h-12 text-primary relative z-10 animate-pulse" />
              </div>
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent animate-fade-in delay-150">
                Bignalytics AI
              </h1>
              <p className="text-muted-foreground text-xl leading-relaxed animate-fade-in delay-300">
                Your intelligent assistant for instant answers about Bignalytics. 
                <br />Ask anything and get detailed, accurate responses.
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Conversation Layout */}
        {(currentQuestion || currentAnswer || isLoading) && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* User question with improved animation */}
            {currentQuestion && (
              <div className="flex justify-end animate-slide-in-right">
                <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-3xl rounded-br-lg px-8 py-6 max-w-2xl shadow-2xl shadow-primary/25 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
                  <p className="text-sm leading-relaxed font-medium">{currentQuestion}</p>
                </div>
              </div>
            )}

            {/* Assistant response with enhanced design */}
            {(currentAnswer || isLoading) && (
              <div className="flex justify-start animate-slide-in-left">
                <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl rounded-bl-lg px-8 py-6 max-w-3xl shadow-2xl shadow-black/5 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-3xl">
                  {isLoading ? (
                    <div className="flex items-center gap-4 py-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-sm text-muted-foreground font-medium animate-pulse">Thinking...</span>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed m-0 animate-fade-in">{currentAnswer}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Feedback Section */}
            {showFeedback && currentAnswer && (
              <div className="flex justify-start animate-fade-in delay-150">
                <div className="max-w-md">
                  <Card className="p-6 border-border/30 shadow-2xl bg-card/60 backdrop-blur-2xl backdrop-saturate-150 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-2 h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full animate-pulse"></div>
                      <p className="text-sm font-semibold text-foreground">Was this helpful?</p>
                    </div>
                    <div className="flex gap-3 mb-5">
                      <Button
                        variant={feedbackRating === '👍 Yes' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFeedbackRating('👍 Yes')}
                        className="flex-1 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        <ThumbsUp className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                        Yes
                      </Button>
                      <Button
                        variant={feedbackRating === '👎 No' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFeedbackRating('👎 No')}
                        className="flex-1 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        <ThumbsDown className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                        No
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Share your thoughts (optional)..."
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      className="mb-5 rounded-2xl border-border/30 resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                      rows={3}
                    />
                    <Button
                      onClick={handleFeedbackSubmit}
                      disabled={!feedbackRating || isSubmittingFeedback}
                      size="sm"
                      className="w-full rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
                    >
                      {isSubmittingFeedback ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </div>
                      ) : (
                        'Submit Feedback'
                      )}
                    </Button>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Input Area */}
      <div className="fixed bottom-0 left-80 right-0 p-6 bg-background/70 backdrop-blur-2xl backdrop-saturate-150 border-t border-border/30 transition-all duration-300">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative group">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about Bignalytics..."
              className="resize-none pr-16 min-h-[60px] rounded-3xl border-2 border-border/30 bg-background/80 backdrop-blur-sm shadow-2xl focus:border-primary/50 focus:bg-background/90 transition-all duration-300 focus:ring-4 focus:ring-primary/10 group-hover:shadow-3xl"
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
              className="absolute bottom-3 right-3 h-12 w-12 rounded-2xl shadow-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-300 hover:scale-110 hover:shadow-3xl disabled:hover:scale-100 group"
            >
              <Send className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center animate-fade-in delay-500">
            Press Enter to send, Shift + Enter for new line
          </p>
        </form>
      </div>
    </div>
  )
}
