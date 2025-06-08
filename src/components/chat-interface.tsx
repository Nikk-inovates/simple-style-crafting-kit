
import React, { useState, useRef, useEffect } from 'react';
import { Send, ThumbsUp, ThumbsDown, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ChatMessage {
  timestamp: string;
  question: string;
  answer: string;
  feedback?: {
    rating: string;
    comment: string;
  };
}

interface ChatInterfaceProps {
  currentAnswer: string;
  currentQuestion: string;
  isLoading: boolean;
  showFeedback: boolean;
  backendStatus: 'checking' | 'ready' | 'error';
  onSubmitQuestion: (question: string) => void;
  onSubmitFeedback: (rating: '👍 Yes' | '👎 No', comment: string) => void;
  isSubmittingFeedback: boolean;
  chatHistory: ChatMessage[];
}

export function ChatInterface({
  currentAnswer,
  currentQuestion,
  isLoading,
  showFeedback,
  backendStatus,
  onSubmitQuestion,
  onSubmitFeedback,
  isSubmittingFeedback,
  chatHistory
}: ChatInterfaceProps) {
  const [question, setQuestion] = useState('');
  const [feedbackRating, setFeedbackRating] = useState<'👍 Yes' | '👎 No' | ''>('');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentAnswer, currentQuestion, isLoading, chatHistory]);

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

  const handleTextToSpeech = (text: string, messageIndex?: number) => {
    if (!text) return;

    if (isSpeaking && speakingMessageIndex === messageIndex) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessageIndex(null);
    } else {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setSpeakingMessageIndex(messageIndex || null);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingMessageIndex(null);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setSpeakingMessageIndex(null);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {backendStatus === 'checking' && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              </div>
              <Badge variant="outline" className="text-xs text-amber-700 border-amber-400 bg-amber-50/80 dark:bg-amber-950/30 dark:border-amber-600">
                Connecting...
              </Badge>
            </div>
          )}
          {backendStatus === 'ready' && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <Badge variant="outline" className="text-xs text-emerald-700 border-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/30 dark:border-emerald-600">
                Ready
              </Badge>
            </div>
          )}
          {backendStatus === 'error' && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <Badge variant="outline" className="text-xs text-red-700 border-red-400 bg-red-50/80 dark:bg-red-950/30 dark:border-red-600">
                Disconnected
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Welcome Message - only show when completely empty */}
        {chatHistory.length === 0 && !currentQuestion && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Sparkles className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Bignalytics AI
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                How can I help you today?
              </p>
            </div>
          </div>
        )}

        {/* Historical Chat Messages */}
        {chatHistory.map((message, index) => (
          <div key={`${message.timestamp}-${index}`} className="w-full">
            {/* User Message */}
            <div className="group w-full text-gray-800 dark:text-gray-100">
              <div className="flex p-4 gap-4 text-base max-w-4xl mx-auto">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-700 dark:bg-gray-300 flex items-center justify-center text-white dark:text-gray-800 text-sm font-medium">
                    U
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="whitespace-pre-wrap">{message.question}</div>
                </div>
              </div>
            </div>

            {/* AI Response */}
            <div className="group w-full text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex p-4 gap-4 text-base max-w-4xl mx-auto">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="whitespace-pre-wrap mb-2">{message.answer}</div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => handleTextToSpeech(message.answer, index)}
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {isSpeaking && speakingMessageIndex === index ? (
                        <VolumeX className="h-3 w-3" />
                      ) : (
                        <Volume2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Display for Historical Messages */}
            {message.feedback && (
              <div className="w-full max-w-4xl mx-auto px-16 pb-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span>{message.feedback.rating === '👍 Yes' ? '👍' : '👎'}</span>
                  {message.feedback.comment && (
                    <span>"{message.feedback.comment}"</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Current Conversation */}
        {(currentQuestion || isLoading) && (
          <>
            {/* Current User Message */}
            {currentQuestion && (
              <div className="group w-full text-gray-800 dark:text-gray-100">
                <div className="flex p-4 gap-4 text-base max-w-4xl mx-auto">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-700 dark:bg-gray-300 flex items-center justify-center text-white dark:text-gray-800 text-sm font-medium">
                      U
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="whitespace-pre-wrap">{currentQuestion}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Current AI Response */}
            <div className="group w-full text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex p-4 gap-4 text-base max-w-4xl mx-auto">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  {isLoading ? (
                    <div className="flex items-center gap-2 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="whitespace-pre-wrap mb-2">{currentAnswer}</div>
                      {currentAnswer && (
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleTextToSpeech(currentAnswer, -1)}
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            {isSpeaking && speakingMessageIndex === -1 ? (
                              <VolumeX className="h-3 w-3" />
                            ) : (
                              <Volume2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Current Feedback Section */}
            {showFeedback && currentAnswer && (
              <div className="w-full max-w-4xl mx-auto px-16 py-2">
                <Card className="p-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Was this helpful?</p>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <Button 
                      variant={feedbackRating === '👍 Yes' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setFeedbackRating('👍 Yes')} 
                      className="flex-1 text-xs"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Yes
                    </Button>
                    <Button 
                      variant={feedbackRating === '👎 No' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setFeedbackRating('👎 No')} 
                      className="flex-1 text-xs"
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      No
                    </Button>
                  </div>
                  <Textarea 
                    placeholder="Share your thoughts (optional)..." 
                    value={feedbackComment} 
                    onChange={e => setFeedbackComment(e.target.value)} 
                    className="mb-3 text-xs resize-none" 
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
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative flex">
            <Textarea 
              value={question} 
              onChange={e => setQuestion(e.target.value)} 
              placeholder="Message Bignalytics AI..." 
              className="resize-none pr-12 min-h-[44px] max-h-[200px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-gray-400 dark:focus:border-gray-500 rounded-lg" 
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
              className="absolute bottom-2 right-2 h-8 w-8 rounded-md bg-gray-900 hover:bg-gray-700 dark:bg-gray-100 dark:hover:bg-gray-300 text-white dark:text-gray-900"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
