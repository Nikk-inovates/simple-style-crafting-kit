
import React, { useState, useRef, useEffect } from 'react';
import { Send, ThumbsUp, ThumbsDown, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatInterfaceProps {
  currentAnswer: string;
  currentQuestion: string;
  isLoading: boolean;
  showFeedback: boolean;
  backendStatus: 'checking' | 'ready' | 'error';
  onSubmitQuestion: (question: string) => void;
  onSubmitFeedback: (rating: '👍 Yes' | '👎 No', comment: string) => void;
  isSubmittingFeedback: boolean;
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
  const [question, setQuestion] = useState('');
  const [feedbackRating, setFeedbackRating] = useState<'👍 Yes' | '👎 No' | ''>('');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [currentAnswer, currentQuestion, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onSubmitQuestion(question);
    setQuestion('');
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackRating) return;
    onSubmitFeedback(feedbackRating, feedbackComment);
    setFeedbackRating('');
    setFeedbackComment('');
  };

  const handleTextToSpeech = () => {
    if (!currentAnswer) return;

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(currentAnswer);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 relative">
      {/* Header */}
      <div className="sticky top-0 z-20 p-4 border-b border-gray-300 dark:border-gray-600 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              {backendStatus === 'checking' && (
                <div className="flex items-center gap-2 animate-fade-in">
                  <div className="relative">
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-amber-500 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <Badge variant="outline" className="text-amber-700 border-amber-400 bg-amber-50/80 dark:bg-amber-950/30 dark:border-amber-600">
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
                  <Badge variant="outline" className="text-emerald-700 border-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/30 dark:border-emerald-600">
                    Ready
                  </Badge>
                </div>
              )}
              {backendStatus === 'error' && (
                <div className="flex items-center gap-2 animate-fade-in">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <Badge variant="outline" className="text-red-700 border-red-400 bg-red-50/80 dark:bg-red-950/30 dark:border-red-600">
                    Disconnected
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 relative">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="max-w-4xl mx-auto p-4 space-y-6">
            {!currentAnswer && !isLoading && !currentQuestion && (
              <div className="text-center py-16 animate-fade-in">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-500 mb-8 relative shadow-lg">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-300/30 to-gray-500/20 animate-pulse"></div>
                    <Sparkles className="w-12 h-12 text-gray-600 dark:text-gray-300 relative z-10 animate-pulse" />
                  </div>
                  <h1 className="font-bold mb-6 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-700 dark:from-gray-200 dark:via-gray-300 dark:to-gray-100 bg-clip-text text-transparent animate-fade-in delay-150 text-5xl">
                    Bignalytics AI
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed animate-fade-in delay-300">
                    Your intelligent assistant for instant answers about Bignalytics. 
                    <br />Ask anything and get detailed, accurate responses.
                  </p>
                </div>
              </div>
            )}

            {/* User Message */}
            {currentQuestion && (
              <div className="flex justify-end animate-slide-in-right">
                <div className="max-w-[80%]">
                  <div className="bg-gray-700 dark:bg-gray-600 text-white rounded-2xl px-6 py-4 shadow-lg border border-gray-600 dark:border-gray-500">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{currentQuestion}</p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Response */}
            {(currentAnswer || isLoading) && (
              <div className="flex justify-start animate-slide-in-left">
                <div className="max-w-[85%] w-full">
                  <div className="flex items-start gap-3">
                    {/* AI Avatar */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 flex items-center justify-center mt-1">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    
                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-600 shadow-sm relative">
                        {/* Speaker Button */}
                        {currentAnswer && !isLoading && (
                          <Button
                            onClick={handleTextToSpeech}
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-500 transition-all duration-300 hover:scale-110"
                          >
                            {isSpeaking ? (
                              <VolumeX className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            ) : (
                              <Volume2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            )}
                          </Button>
                        )}
                        
                        <div className="p-6 pr-14">
                          {isLoading ? (
                            <div className="flex items-center gap-2 py-2">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce"></div>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">Thinking...</span>
                            </div>
                          ) : (
                            <div className="prose prose-sm max-w-none">
                              <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed m-0">
                                {currentAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Section */}
            {showFeedback && currentAnswer && (
              <div className="flex justify-start animate-fade-in delay-150">
                <div className="max-w-md ml-11">
                  <Card className="p-4 border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Was this helpful?</p>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <Button 
                        variant={feedbackRating === '👍 Yes' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setFeedbackRating('👍 Yes')} 
                        className="flex-1 text-xs border-gray-300 dark:border-gray-600"
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Yes
                      </Button>
                      <Button 
                        variant={feedbackRating === '👎 No' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setFeedbackRating('👎 No')} 
                        className="flex-1 text-xs border-gray-300 dark:border-gray-600"
                      >
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        No
                      </Button>
                    </div>
                    <Textarea 
                      placeholder="Share your thoughts (optional)..." 
                      value={feedbackComment} 
                      onChange={e => setFeedbackComment(e.target.value)} 
                      className="mb-4 text-xs border-gray-300 dark:border-gray-600 resize-none" 
                      rows={2} 
                    />
                    <Button 
                      onClick={handleFeedbackSubmit} 
                      disabled={!feedbackRating || isSubmittingFeedback} 
                      size="sm" 
                      className="w-full text-xs"
                    >
                      {isSubmittingFeedback ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
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
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <Textarea 
              value={question} 
              onChange={e => setQuestion(e.target.value)} 
              placeholder="Message Bignalytics AI..." 
              className="resize-none pr-12 min-h-[50px] max-h-[200px] border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-gray-500 dark:focus:border-gray-400 rounded-3xl" 
              disabled={isLoading || backendStatus !== 'ready'} 
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }} 
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !question.trim() || backendStatus !== 'ready'} 
              className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-gray-700 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </form>
      </div>
    </div>
  );
}
