import React, { useState, useEffect } from 'react';
import { ChatSidebar } from '@/components/chat-sidebar';
import { ChatInterface } from '@/components/chat-interface';
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
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    checkBackendStatus();
  }, []);

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

  const handleSubmitQuestion = async (question: string) => {
    if (backendStatus !== 'ready') {
      toast({
        title: "Backend not available",
        description: "Please make sure the FastAPI backend is running",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setCurrentQuestion(question);
    setCurrentAnswer('');
    setShowFeedback(false);

    try {
      const answer = await askQuestion(question);
      setCurrentAnswer(answer);
      setShowFeedback(true);

      const newChat: ChatMessage = {
        timestamp: new Date().toISOString(),
        question: question,
        answer: answer
      };
      setChatHistory(prev => [newChat, ...prev].slice(0, 10));

      toast({
        title: "Question processed successfully!",
        description: "Your answer is ready"
      });
    } catch (error) {
      console.error('Error asking question:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Failed to get answer",
        description: errorMessage,
        variant: "destructive"
      });
      setCurrentAnswer('');
      setShowFeedback(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFeedback = async (rating: '👍 Yes' | '👎 No', comment: string) => {
    setIsSubmittingFeedback(true);
    try {
      await submitFeedback(currentQuestion, currentAnswer, rating, comment);

      setChatHistory(prev => prev.map(chat => 
        chat.question === currentQuestion && chat.answer === currentAnswer 
          ? { ...chat, feedback: { rating, comment } }
          : chat
      ));

      toast({
        title: "Feedback submitted successfully!",
        description: "Thank you for your feedback"
      });

      setShowFeedback(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit feedback';
      toast({
        title: "Failed to submit feedback",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleNewChat = () => {
    setCurrentAnswer('');
    setCurrentQuestion('');
    setShowFeedback(false);
  };

  const handleChatSelect = (chat: ChatMessage) => {
    setCurrentQuestion(chat.question);
    setCurrentAnswer(chat.answer);
    setShowFeedback(false);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <ChatSidebar 
        chatHistory={chatHistory} 
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
      />
      <div className="flex-1">
        <ChatInterface
          currentAnswer={currentAnswer}
          currentQuestion={currentQuestion}
          isLoading={isLoading}
          showFeedback={showFeedback}
          backendStatus={backendStatus}
          onSubmitQuestion={handleSubmitQuestion}
          onSubmitFeedback={handleSubmitFeedback}
          isSubmittingFeedback={isSubmittingFeedback}
          chatHistory={chatHistory}
        />
      </div>
    </div>
  );
};

export default Index;
