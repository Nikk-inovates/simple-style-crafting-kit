
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

  const renderMessage = (message: ChatMessage, index: number, isCurrentMessage = false) => (
    <div key={`${message.timestamp}-${index}`} className="w-full">
      {/* User Message */}
      <div className="group w-full text-gray-800 dark:text-gray-100">
        <div className="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl md:py-6 lg:px-0 m-auto">
          <div className="flex-shrink-0 flex flex-col relative items-end">
            <div className="w-8 h-8 rounded-sm bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
              U
            </div>
          </div>
          <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
            <div className="flex flex-grow flex-col gap-3">
              <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                {message.question}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Response */}
      <div className="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]">
        <div className="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl md:py-6 lg:px-0 m-auto">
          <div className="flex-shrink-0 flex flex-col relative items-end">
            <div className="w-8 h-8 rounded-sm bg-green-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
            <div className="flex flex-grow flex-col gap-3">
              <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                {message.answer}
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={() => handleTextToSpeech(message.answer, index)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isSpeaking && speakingMessageIndex === index ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section for Historical Messages */}
      {message.feedback && !isCurrentMessage && (
        <div className="w-full text-gray-800 dark:text-gray-100">
          <div className="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl md:py-6 lg:px-0 m-auto">
            <div className="flex-shrink-0 flex flex-col relative items-end">
              <div className="w-8"></div>
            </div>
            <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span>{message.feedback.rating === '👍 Yes' ? '👍' : '👎'}</span>
                {message.feedback.comment && (
                  <span>"{message.feedback.comment}"</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Section for Current Message */}
      {isCurrentMessage && showFeedback && (
        <div className="w-full text-gray-800 dark:text-gray-100">
          <div className="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl md:py-6 lg:px-0 m-auto">
            <div className="flex-shrink-0 flex flex-col relative items-end">
              <div className="w-8"></div>
            </div>
            <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
              <Card className="p-4 border border-gray-200 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Was this helpful?</p>
                </div>
                <div className="flex gap-2 mb-4">
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
                  className="mb-4 text-xs resize-none" 
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
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between w-full p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {backendStatus === 'checking' && (
            <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <Badge variant="outline" className="text-red-700 border-red-400 bg-red-50/80 dark:bg-red-950/30 dark:border-red-600">
                Disconnected
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Welcome Message - only show when no history and no current conversation */}
        {chatHistory.length === 0 && !currentQuestion && !isLoading && (
          <div className="flex items-center justify-center min-h-full p-8">
            <div className="text-center max-w-md">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
                  <Sparkles className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                </div>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Bignalytics AI
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                  Your intelligent assistant for instant answers about Bignalytics. 
                  Ask anything and get detailed, accurate responses.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Historical Chat Messages */}
        {chatHistory.map((message, index) => renderMessage(message, index, false))}

        {/* Current Conversation */}
        {(currentQuestion || isLoading) && (
          <>
            {/* Current User Message */}
            {currentQuestion && (
              <div className="group w-full text-gray-800 dark:text-gray-100">
                <div className="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl md:py-6 lg:px-0 m-auto">
                  <div className="flex-shrink-0 flex flex-col relative items-end">
                    <div className="w-8 h-8 rounded-sm bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                      U
                    </div>
                  </div>
                  <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                    <div className="flex flex-grow flex-col gap-3">
                      <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                        {currentQuestion}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Current AI Response */}
            <div className="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]">
              <div className="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl md:py-6 lg:px-0 m-auto">
                <div className="flex-shrink-0 flex flex-col relative items-end">
                  <div className="w-8 h-8 rounded-sm bg-green-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                  <div className="flex flex-grow flex-col gap-3">
                    <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
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
                        currentAnswer
                      )}
                    </div>
                    {currentAnswer && !isLoading && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={() => handleTextToSpeech(currentAnswer, -1)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {isSpeaking && speakingMessageIndex === -1 ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Feedback Section */}
            {showFeedback && currentAnswer && (
              <div className="w-full text-gray-800 dark:text-gray-100">
                <div className="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl md:py-6 lg:px-0 m-auto">
                  <div className="flex-shrink-0 flex flex-col relative items-end">
                    <div className="w-8"></div>
                  </div>
                  <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                    <Card className="p-4 border border-gray-200 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Was this helpful?</p>
                      </div>
                      <div className="flex gap-2 mb-4">
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
                        className="mb-4 text-xs resize-none" 
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
              </div>
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <form onSubmit={handleSubmit} className="max-w-2xl lg:max-w-[38rem] xl:max-w-3xl mx-auto">
          <div className="relative flex">
            <Textarea 
              value={question} 
              onChange={e => setQuestion(e.target.value)} 
              placeholder="Send a message..." 
              className="resize-none pr-12 min-h-[52px] max-h-[200px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-gray-400 dark:focus:border-gray-500 rounded-xl" 
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
              className="absolute bottom-2 right-2 h-8 w-8 rounded-lg bg-gray-900 hover:bg-gray-700 dark:bg-gray-100 dark:hover:bg-gray-300 text-white dark:text-gray-900"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
