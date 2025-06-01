import React, { useState, useEffect } from 'react';
import { FileText, Send, ThumbsUp, ThumbsDown, Clock, BookOpen, Heart, Rocket, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { askQuestion } from '@/lib/api';

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

  // Check backend status on component mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  /**
   * Check if the FastAPI backend is running and accessible
   */
  const checkBackendStatus = async () => {
    try {
      const response = await fetch('https://bignalytics-chatbot.me/');
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
        description: "Please make sure the FastAPI backend is running on http://localhost:8000",
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
  const handleSubmitFeedback = () => {
    if (!feedbackRating) return;

    // Log feedback to console (you can extend this to send to backend later)
    console.log('Feedback submitted:', {
      question: currentQuestion,
      answer: currentAnswer,
      rating: feedbackRating,
      comment: feedbackComment
    });

    // Update chat history with feedback
    setChatHistory(prev => prev.map(chat => chat.question === currentQuestion && chat.answer === currentAnswer ? {
      ...chat,
      feedback: {
        rating: feedbackRating,
        comment: feedbackComment
      }
    } : chat));
    toast({
      title: "✅ Feedback submitted. Thank you!",
      description: "Your feedback helps us improve the system."
    });

    // Reset feedback form
    setFeedbackRating('');
    setFeedbackComment('');
    setShowFeedback(false);
  };

  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 transition-all duration-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3 transition-all duration-500 hover:scale-105">
            <FileText className="w-10 h-10 text-blue-600 animate-pulse" />
            Chat with Dataset.pdf using DeepSeek + FAISS
          </h1>
          <p className="text-gray-600 text-lg font-medium">Ask questions about your PDF document and get AI-powered answers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Chat History */}
          <div className="lg:col-span-1 animate-slide-in-left">
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-3xl">
                <CardTitle className="text-xl flex items-center gap-3 font-semibold">
                  <BookOpen className="w-6 h-6 animate-bounce" />
                  Chat History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto p-6 custom-scrollbar">
                {chatHistory.length > 0 ? chatHistory.map((chat, index) => <Card key={index} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-0 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                      <div className="flex items-start gap-3 mb-3">
                        <Clock className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0 animate-pulse" />
                        <span className="text-sm text-gray-500 font-medium">{chat.timestamp}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white/80 rounded-xl p-3 border-l-4 border-blue-400">
                          <p className="text-sm font-semibold text-gray-700 mb-1">Q:</p>
                          <p className="text-sm text-gray-600 leading-relaxed">{chat.question}</p>
                        </div>
                        <div className="bg-white/80 rounded-xl p-3 border-l-4 border-green-400">
                          <p className="text-sm font-semibold text-gray-700 mb-1">A:</p>
                          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{chat.answer}</p>
                        </div>
                        {chat.feedback && <div className="text-xs text-gray-500 bg-white/60 rounded-lg p-2 border border-gray-200">
                            <span className="font-medium">Feedback:</span> {chat.feedback.rating}
                          </div>}
                      </div>
                    </Card>) : <div className="text-center py-12 animate-pulse">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm font-medium">No chat history yet.</p>
                    <p className="text-gray-400 text-xs mt-1">Start a conversation!</p>
                  </div>}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8 animate-slide-in-right">
            {/* Backend Status */}
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-3xl">
              <CardContent className="pt-8 pb-6 px-8">
                <div className="flex items-center gap-4">
                  {backendStatus === 'checking' && <>
                      <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping"></div>
                      <Badge variant="outline" className="bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 border-yellow-200 px-4 py-2 rounded-full font-medium animate-pulse">
                        🔄 Checking backend...
                      </Badge>
                      <span className="text-sm text-gray-600 font-medium">Connecting to FastAPI backend</span>
                    </>}
                  {backendStatus === 'ready' && <>
                      <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg shadow-green-200"></div>
                      <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 px-4 py-2 rounded-full font-medium">
                        ✅ Backend connected!
                      </Badge>
                      <span className="text-sm text-gray-600 font-medium">Ready to process questions</span>
                    </>}
                  {backendStatus === 'error' && <>
                      <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-bounce shadow-lg shadow-red-200"></div>
                      <Badge variant="outline" className="bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-red-200 px-4 py-2 rounded-full font-medium">
                        ❌ Backend offline
                      </Badge>
                      <span className="text-sm text-gray-600 font-medium">Make sure FastAPI is running on https://bignalytics-chatbot.me</span>
                      <Button variant="outline" size="sm" onClick={checkBackendStatus} className="ml-4 rounded-full px-6 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        Retry
                      </Button>
                    </>}
                </div>
              </CardContent>
            </Card>

            {/* Question Form */}
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-3xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-3xl">
                <CardTitle className="text-2xl text-white font-semibold flex items-center gap-3">
                  🧠 Ask a Question
                  <Sparkles className="w-6 h-6 animate-spin" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmitQuestion} className="space-y-6">
                  <div className="relative">
                    <Input 
                      placeholder="Ask a question about knowledge.pdf..." 
                      value={question} 
                      onChange={e => setQuestion(e.target.value)} 
                      className="text-lg p-4 rounded-2xl border-2 border-gray-200 focus:border-blue-400 transition-all duration-300 focus:shadow-lg focus:scale-[1.02] bg-gray-50/50" 
                      disabled={isLoading || backendStatus !== 'ready'} 
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:scale-100" 
                    disabled={isLoading || !question.trim() || backendStatus !== 'ready'}
                  >
                    {isLoading ? <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        🤖 Processing with DeepSeek...
                      </> : <>
                        <Send className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:translate-x-1" />
                        🚀 Send Question
                      </>}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Answer Display */}
            {currentAnswer && <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-3xl animate-fade-in">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-3xl">
                  <CardTitle className="text-2xl text-white font-semibold flex items-center gap-3">
                    💬 Answer
                    <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="prose prose-gray max-w-none">
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border-l-4 border-blue-400">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">{currentAnswer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>}

            {/* Feedback Form */}
            {showFeedback && currentAnswer && <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-3xl animate-fade-in">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-3xl">
                  <CardTitle className="text-2xl text-white font-semibold flex items-center gap-3">
                    📝 Feedback
                    <Heart className="w-6 h-6 animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-lg font-semibold text-gray-700 mb-4">Was this helpful?</p>
                      <div className="flex gap-4">
                        <Button 
                          type="button" 
                          variant={feedbackRating === '👍 Yes' ? 'default' : 'outline'} 
                          onClick={() => setFeedbackRating('👍 Yes')} 
                          className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 ${feedbackRating === '👍 Yes' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' : 'hover:bg-green-50'}`}
                        >
                          <ThumbsUp className="w-5 h-5" />
                          👍 Yes
                        </Button>
                        <Button 
                          type="button" 
                          variant={feedbackRating === '👎 No' ? 'default' : 'outline'} 
                          onClick={() => setFeedbackRating('👎 No')} 
                          className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 ${feedbackRating === '👎 No' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' : 'hover:bg-red-50'}`}
                        >
                          <ThumbsDown className="w-5 h-5" />
                          👎 No
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Textarea 
                        placeholder="Any comments?" 
                        value={feedbackComment} 
                        onChange={e => setFeedbackComment(e.target.value)} 
                        rows={4} 
                        className="rounded-2xl border-2 border-gray-200 focus:border-purple-400 transition-all duration-300 focus:shadow-lg bg-gray-50/50 text-lg p-4"
                      />
                    </div>
                    <Button 
                      onClick={handleSubmitFeedback} 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl" 
                      disabled={!feedbackRating}
                    >
                      Submit Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 py-4 z-50 transition-all duration-500">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-600 flex items-center justify-center gap-2 font-medium">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" /> by 
            <strong className="text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text ml-1">Nikhil Panchal</strong>
            <Rocket className="w-4 h-4 text-blue-500 ml-1 animate-bounce" />
            <Sparkles className="w-4 h-4 text-yellow-500 animate-spin" />
          </p>
        </div>
      </footer>

      {/* Bottom padding to account for fixed footer */}
      <div className="h-20"></div>
    </div>;
};

export default Index;
