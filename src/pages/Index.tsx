import React, { useState, useEffect } from 'react';
import { FileText, Send, ThumbsUp, ThumbsDown, Clock, BookOpen, Heart, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { askQuestion, submitFeedback } from '@/lib/api';
interface ChatMessage {
  timestamp: string;
  question: string;
  answer: string;
  feedback?: {
    rating: string;
    comment: string;
  };
}
const Index = () => {
  const [question, setQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [feedbackRating, setFeedbackRating] = useState<'👍 Yes' | '👎 No' | ''>('');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Check backend status on component mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  /**
   * Check if the FastAPI backend is running and accessible
   */
  const checkBackendStatus = async () => {
    try {
      const response = await fetch('https://bignalytics-chatbot.me');
      if (response.ok) {
        setBackendStatus('ready');
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      console.error('Backend check failed:', error);
      setBackendStatus('error');
    }
  };

  /**
   * Handle form submission to ask a question
   */
  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Check if backend is ready
    if (backendStatus !== 'ready') {
      toast({
        title: "❌ Backend not available",
        description: "Please make sure the FastAPI backend is running on https://bignalytics-chatbot.me",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    setCurrentQuestion(question);
    try {
      // Call the backend API
      const answer = await askQuestion(question);
      setCurrentAnswer(answer);
      setShowFeedback(true);

      // Add to chat history (keep last 10)
      const newChat: ChatMessage = {
        timestamp: new Date().toLocaleString(),
        question: question,
        answer: answer
      };
      setChatHistory(prev => [newChat, ...prev].slice(0, 10));
      toast({
        title: "✅ Question processed successfully!",
        description: "Your answer is ready below."
      });
    } catch (error) {
      console.error('Error asking question:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "❌ Failed to get answer",
        description: errorMessage,
        variant: "destructive"
      });
      setCurrentAnswer('');
      setShowFeedback(false);
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  };

  /**
   * Handle feedback submission
   */
  const handleSubmitFeedback = async () => {
    if (!feedbackRating) return;
    setIsSubmittingFeedback(true);
    try {
      // Submit feedback to backend
      await submitFeedback(currentQuestion, currentAnswer, feedbackRating, feedbackComment);

      // Update chat history with feedback
      setChatHistory(prev => prev.map(chat => chat.question === currentQuestion && chat.answer === currentAnswer ? {
        ...chat,
        feedback: {
          rating: feedbackRating,
          comment: feedbackComment
        }
      } : chat));
      toast({
        title: "✅ Feedback submitted successfully!",
        description: "Thank you for your feedback. It has been saved to the backend."
      });

      // Reset feedback form
      setFeedbackRating('');
      setFeedbackComment('');
      setShowFeedback(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit feedback';
      toast({
        title: "❌ Failed to submit feedback",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white/95 backdrop-blur-sm border shadow-lg rounded-2xl p-8 mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img src="https://bignalytics.in/wp-content/uploads/2021/04/logo-1.png" alt="Bignalytics Logo" className="h-20 w-auto object-contain" />
              <h1 className="text-4xl font-extrabold text-blue-700">
                Bignalytics Chatbot
              </h1>
            </div>
            <p className="text-gray-600 text-lg py-0 px-0 mx-[5px] my-0 font-semibold text-center">All About Bignalytics, One Chat Away.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Chat History */}
          <div className="lg:col-span-1">
            <Card className="bg-white/95 backdrop-blur-sm border shadow-lg rounded-2xl">
              <CardHeader className="pb-4 bg-blue-600 text-white rounded-t-2xl">
                <CardTitle className="text-xl flex items-center gap-3 font-semibold">
                  <BookOpen className="w-6 h-6" />
                  Chat History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto p-6 custom-scrollbar">
                {chatHistory.length > 0 ? chatHistory.map((chat, index) => <Card key={index} className="p-4 bg-blue-50 border border-blue-200 shadow-sm rounded-xl">
                      <div className="flex items-start gap-3 mb-3">
                        <Clock className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-500 font-medium">{chat.timestamp}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-3 border-l-4 border-blue-400">
                          <p className="text-sm font-semibold text-gray-700 mb-1">Q:</p>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">{chat.question}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border-l-4 border-blue-400">
                          <p className="text-sm font-semibold text-gray-700 mb-1">A:</p>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">{chat.answer}</p>
                        </div>
                        {chat.feedback && <div className="text-xs text-gray-500 bg-white rounded-lg p-3 border border-gray-200">
                            <span className="font-medium">Feedback:</span> {chat.feedback.rating}
                            {chat.feedback.comment && <p className="mt-1 text-gray-600">{chat.feedback.comment}</p>}
                          </div>}
                      </div>
                    </Card>) : <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm font-medium">No chat history yet.</p>
                    <p className="text-gray-400 text-xs mt-1">Start a conversation!</p>
                  </div>}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Backend Status */}
            <Card className="bg-white/95 backdrop-blur-sm border shadow-lg rounded-2xl">
              <CardContent className="pt-8 pb-6 px-8">
                <div className="flex items-center gap-4">
                  {backendStatus === 'checking' && <>
                      <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 px-4 py-2 rounded-full">
                        🔄 Checking backend...
                      </Badge>
                      <span className="text-sm text-gray-600">Connecting to FastAPI backend</span>
                    </>}
                  {backendStatus === 'ready' && <>
                      <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2 rounded-full">
                        ✅ Backend connected!
                      </Badge>
                      <span className="text-sm text-gray-600">Ready to process questions</span>
                    </>}
                  {backendStatus === 'error' && <>
                      <div className="w-4 h-4 bg-red-400 rounded-full animate-bounce"></div>
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-4 py-2 rounded-full">
                        ❌ Backend offline
                      </Badge>
                      <span className="text-sm text-gray-600">Make sure FastAPI is running on https://bignalytics-chatbot.me</span>
                      <Button variant="outline" size="sm" onClick={checkBackendStatus} className="ml-4 rounded-full px-6 py-2">
                        Retry
                      </Button>
                    </>}
                </div>
              </CardContent>
            </Card>

            {/* Question Form */}
            <Card className="bg-white/95 backdrop-blur-sm border shadow-lg rounded-2xl">
              <CardHeader className="bg-blue-600 text-white rounded-t-2xl">
                <CardTitle className="text-2xl text-white font-semibold flex items-center gap-3">
                  Ask a Question
                  <FileText className="w-6 h-6" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmitQuestion} className="space-y-6">
                  <div className="relative">
                    <Input placeholder="Ask a question about Bignalytics coaching..." value={question} onChange={e => setQuestion(e.target.value)} className="text-lg p-6 rounded-xl border-2 border-gray-300 focus:border-blue-400 bg-gray-50" disabled={isLoading || backendStatus !== 'ready'} />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg" disabled={isLoading || !question.trim() || backendStatus !== 'ready'}>
                    {isLoading ? <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Processing...
                      </> : <>
                        <Send className="w-5 h-5 mr-3" />
                        Send Question
                      </>}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Answer Display */}
            {currentAnswer && <Card className="bg-white/95 backdrop-blur-sm border shadow-lg rounded-2xl">
                <CardHeader className="bg-blue-600 text-white rounded-t-2xl">
                  <CardTitle className="text-2xl text-white font-semibold flex items-center gap-3">
                    Answer
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="prose prose-gray max-w-none">
                    <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-400">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">{currentAnswer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>}

            {/* Feedback Form */}
            {showFeedback && currentAnswer && <Card className="bg-white/95 backdrop-blur-sm border shadow-lg rounded-2xl">
                <CardHeader className="bg-blue-600 text-white rounded-t-2xl">
                  <CardTitle className="text-2xl text-white font-semibold flex items-center gap-3">
                    Feedback
                    <Heart className="w-6 h-6" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-lg font-semibold text-gray-700 mb-4">Was this helpful?</p>
                      <div className="flex gap-4">
                        <Button type="button" variant={feedbackRating === '👍 Yes' ? 'default' : 'outline'} onClick={() => setFeedbackRating('👍 Yes')} className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold ${feedbackRating === '👍 Yes' ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 border-blue-300'}`}>
                          <ThumbsUp className="w-5 h-5" />
                          👍 Yes
                        </Button>
                        <Button type="button" variant={feedbackRating === '👎 No' ? 'default' : 'outline'} onClick={() => setFeedbackRating('👎 No')} className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold ${feedbackRating === '👎 No' ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 border-blue-300'}`}>
                          <ThumbsDown className="w-5 h-5" />
                          👎 No
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Textarea placeholder="Any comments or suggestions?" value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)} rows={4} className="rounded-xl border-2 border-gray-300 focus:border-blue-400 bg-gray-50 text-lg p-4" />
                    </div>
                    <Button onClick={handleSubmitFeedback} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg" disabled={!feedbackRating || isSubmittingFeedback}>
                      {isSubmittingFeedback ? <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          Submitting Feedback...
                        </> : <>
                          <Heart className="w-5 h-5 mr-3" />
                          Submit Feedback
                        </>}
                    </Button>
                  </div>
                </CardContent>
              </Card>}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t py-4 z-50">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-600 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by 
            <strong className="text-blue-600 ml-1">Nikhil Panchal</strong>
          </p>
        </div>
      </footer>

      {/* Bottom padding to account for fixed footer */}
      <div className="h-20"></div>
    </div>;
};
export default Index;