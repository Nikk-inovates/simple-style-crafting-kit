
import React, { useState, useEffect } from 'react';
import { FileText, Send, ThumbsUp, ThumbsDown, Clock, BookOpen, Heart, Rocket, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

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

  // Load chat history on component mount
  useEffect(() => {
    // Simulate loading chat history
    const mockHistory: ChatMessage[] = [
      {
        timestamp: '2024-01-15 14:30:22',
        question: 'What is machine learning?',
        answer: 'Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed.'
      },
      {
        timestamp: '2024-01-15 13:45:10',
        question: 'How does deep learning work?',
        answer: 'Deep learning uses neural networks with multiple layers to model and understand complex patterns in data, mimicking how the human brain processes information.'
      }
    ];
    setChatHistory(mockHistory);
  }, []);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setCurrentQuestion(question);

    // Simulate AI processing
    setTimeout(() => {
      const mockAnswer = `This is a simulated response to your question: "${question}". The system would normally process your PDF document using DeepSeek AI and FAISS vector search to provide relevant answers based on the document content.`;
      
      setCurrentAnswer(mockAnswer);
      setShowFeedback(true);
      setIsLoading(false);
      
      // Add to chat history
      const newChat: ChatMessage = {
        timestamp: new Date().toLocaleString(),
        question: question,
        answer: mockAnswer
      };
      setChatHistory(prev => [newChat, ...prev]);
      
      toast({
        title: "✅ Question processed successfully!",
        description: "Your answer is ready below.",
      });
    }, 2000);

    setQuestion('');
  };

  const handleSubmitFeedback = () => {
    if (!feedbackRating) return;

    // Log feedback
    console.log('Feedback submitted:', {
      question: currentQuestion,
      answer: currentAnswer,
      rating: feedbackRating,
      comment: feedbackComment
    });

    toast({
      title: "✅ Feedback submitted. Thank you!",
      description: "Your feedback helps us improve the system.",
    });

    // Reset feedback form
    setFeedbackRating('');
    setFeedbackComment('');
    setShowFeedback(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            Chat with Dataset.pdf using DeepSeek + FAISS
          </h1>
          <p className="text-gray-600">Ask questions about your PDF document and get AI-powered answers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Chat History */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Chat History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {chatHistory.length > 0 ? (
                  chatHistory.slice(0, 10).map((chat, index) => (
                    <Card key={index} className="p-3 bg-gray-50 border border-gray-200">
                      <div className="flex items-start gap-2 mb-2">
                        <Clock className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                        <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Q:</p>
                          <p className="text-sm text-gray-600">{chat.question}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">A:</p>
                          <p className="text-sm text-gray-600 line-clamp-3">{chat.answer}</p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No chat history yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* PDF Status */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    ✅ Ready for questions!
                  </Badge>
                  <span className="text-sm text-gray-600">PDF loaded and indexed successfully</span>
                </div>
              </CardContent>
            </Card>

            {/* Question Form */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">🧠 Ask a Question</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitQuestion} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Ask a question about knowledge.pdf..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="text-base"
                      disabled={isLoading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading || !question.trim()}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        🤖 Thinking...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        🚀 Send
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Answer Display */}
            {currentAnswer && (
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">💬 Answer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">{currentAnswer}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feedback Form */}
            {showFeedback && currentAnswer && (
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">📝 Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">Was this helpful?</p>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={feedbackRating === '👍 Yes' ? 'default' : 'outline'}
                          onClick={() => setFeedbackRating('👍 Yes')}
                          className="flex items-center gap-2"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          👍 Yes
                        </Button>
                        <Button
                          type="button"
                          variant={feedbackRating === '👎 No' ? 'default' : 'outline'}
                          onClick={() => setFeedbackRating('👎 No')}
                          className="flex items-center gap-2"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          👎 No
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Textarea
                        placeholder="Any comments?"
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <Button 
                      onClick={handleSubmitFeedback}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      disabled={!feedbackRating}
                    >
                      Submit Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100/90 backdrop-blur-sm border-t border-gray-200 py-3 z-50">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-600 flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by 
            <strong className="text-gray-800 ml-1">Nikhil Panchal</strong>
            <Rocket className="w-4 h-4 text-blue-500 ml-1" />
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </p>
        </div>
      </footer>

      {/* Bottom padding to account for fixed footer */}
      <div className="h-16"></div>
    </div>
  );
};

export default Index;
