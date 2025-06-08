
import React, { useState, useRef, useEffect } from 'react';
import { Send, ThumbsUp, ThumbsDown, Sparkles, Volume2, VolumeX, MessageSquare } from 'lucide-react';
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

  const hasAnyContent = chatHistory.length > 0 || currentQuestion || isLoading;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
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
        {/* Welcome Message - show when no content */}
        {!hasAnyContent && (
          <div className="flex items-center justify-center h-full px-6">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Welcome to Bignalytics AI
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                Your intelligent assistant for data analytics and insights
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">Ask questions about your data</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">Get insights and analysis from your datasets</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Sparkles className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">Generate reports and visualizations</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">Create charts, graphs, and detailed reports</p>
                  </div>
                </div>
              </div>
              {backendStatus === 'error' && (
                <div className="mt-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                    Backend service is currently unavailable
                  </p>
                  <p className="text-red-600 dark:text-red-500 text-xs mt-1">
                    Please check your connection or try again later
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Historical Chat Messages */}
        {chatHistory.map((message, index) => (
          <div key={`${message.timestamp}-${index}`} className="w-full">
            {/* User Message */}
            <div className="group w-full text-gray-800 dark:text-gray-100">
              <div className="flex p-4 gap-4 text-base">
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
              <div className="flex p-4 gap-4 text-base">
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
              <div className="w-full px-16 pb-2">
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

        {/* Current Conversation - Only show if current question is different from last history item */}
        {(currentQuestion || isLoading) && 
         (!chatHistory.length || chatHistory[0].question !== currentQuestion) && (
          <>
            {/* Current User Message */}
            {currentQuestion && (
              <div className="group w-full text-gray-800 dark:text-gray-100">
                <div className="flex p-4 gap-4 text-base">
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
              <div className="flex p-4 gap-4 text-base">
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

            {/* Current Feedback Section - Minimal Design */}
            {showFeedback && currentAnswer && (
              <div className="w-full px-16 py-3">
                <div className="inline-flex items-center gap-3 p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-sm">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Helpful?</span>
                  <div className="flex gap-1">
                    <Button 
                      variant={feedbackRating === '👍 Yes' ? 'default' : 'ghost'} 
                      size="sm" 
                      onClick={() => {
                        setFeedbackRating('👍 Yes');
                        setTimeout(() => onSubmitFeedback('👍 Yes', ''), 100);
                      }}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant={feedbackRating === '👎 No' ? 'default' : 'ghost'} 
                      size="sm" 
                      onClick={() => {
                        setFeedbackRating('👎 No');
                        setTimeout(() => onSubmitFeedback('👎 No', ''), 100);
                      }}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </div>
                  {isSubmittingFeedback && (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <form onSubmit={handleSubmit} className="w-full">
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
