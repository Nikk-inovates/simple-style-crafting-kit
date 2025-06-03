
import React, { useState } from 'react'
import { Send, ThumbsUp, ThumbsDown } from 'lucide-react'
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
    <div className="flex flex-col h-full">
      {/* Header with status */}
      <div className="p-4 border-b border-border bg-background/50 backdrop-blur">
        <div className="flex items-center gap-3">
          {backendStatus === 'checking' && (
            <>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <Badge variant="outline" className="text-yellow-700 border-yellow-200">
                Connecting...
              </Badge>
            </>
          )}
          {backendStatus === 'ready' && (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <Badge variant="outline" className="text-green-700 border-green-200">
                Connected
              </Badge>
            </>
          )}
          {backendStatus === 'error' && (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <Badge variant="outline" className="text-red-700 border-red-200">
                Disconnected
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {!currentAnswer && !isLoading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Bignalytics Chatbot
              </h1>
              <p className="text-muted-foreground text-lg">
                Ask anything about Bignalytics and get instant answers
              </p>
            </div>
          </div>
        )}

        {/* Conversation */}
        {(currentQuestion || currentAnswer || isLoading) && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* User question */}
            {currentQuestion && (
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-3 max-w-xs md:max-w-md">
                  <p className="text-sm">{currentQuestion}</p>
                </div>
              </div>
            )}

            {/* Assistant response */}
            {(currentAnswer || isLoading) && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-3 max-w-xs md:max-w-2xl">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  ) : (
                    <p className="text-sm text-foreground whitespace-pre-wrap">{currentAnswer}</p>
                  )}
                </div>
              </div>
            )}

            {/* Feedback */}
            {showFeedback && currentAnswer && (
              <div className="flex justify-start">
                <Card className="p-4 max-w-md">
                  <p className="text-sm font-medium mb-3">Was this helpful?</p>
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={feedbackRating === '👍 Yes' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFeedbackRating('👍 Yes')}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Yes
                    </Button>
                    <Button
                      variant={feedbackRating === '👎 No' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFeedbackRating('👎 No')}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      No
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Any additional feedback..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="mb-3"
                    rows={2}
                  />
                  <Button
                    onClick={handleFeedbackSubmit}
                    disabled={!feedbackRating || isSubmittingFeedback}
                    size="sm"
                    className="w-full"
                  >
                    {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border bg-background">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about Bignalytics..."
              className="resize-none pr-12 min-h-[60px] rounded-xl border-2"
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
              className="absolute bottom-2 right-2 h-8 w-8"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
