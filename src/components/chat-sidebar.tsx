
import React from 'react'
import { MessageSquare, Plus, Clock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ThemeToggle } from '@/components/theme-toggle'

interface ChatMessage {
  timestamp: string;
  question: string;
  answer: string;
  feedback?: {
    rating: string;
    comment: string;
  };
}

interface ChatSidebarProps {
  chatHistory: ChatMessage[]
  onNewChat?: () => void
  onChatSelect?: (chat: ChatMessage) => void
}

export function ChatSidebar({ chatHistory, onNewChat, onChatSelect }: ChatSidebarProps) {
  return (
    <div className="fixed left-0 top-0 z-30 flex flex-col h-screen w-80 bg-gray-200/90 dark:bg-gray-800/90 backdrop-blur-2xl backdrop-saturate-150 border-r border-gray-300 dark:border-gray-600 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-300/10 via-transparent to-gray-400/10 opacity-50"></div>
      
      {/* Enhanced Header */}
      <div className="relative z-10 flex items-center justify-between p-6 border-b border-gray-300 dark:border-gray-600 bg-gray-100/60 dark:bg-gray-700/60 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img 
              src="https://bignalytics.in/wp-content/uploads/2021/04/logo-1.png" 
              alt="Bignalytics" 
              className="h-12 w-12 object-contain rounded-2xl shadow-lg border border-gray-300 dark:border-gray-500 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full border-2 border-gray-200 dark:border-gray-700 shadow-lg animate-pulse"></div>
          </div>
          <div className="transition-all duration-300">
            <span className="font-bold text-gray-800 dark:text-gray-200 text-lg bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text">Bignalytics</span>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">AI Assistant</p>
          </div>
        </div>
        <div className="transition-all duration-300 hover:scale-110">
          <ThemeToggle />
        </div>
      </div>

      {/* Enhanced New Chat Button */}
      <div className="relative z-10 p-6 pb-4 flex-shrink-0">
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-4 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 text-white hover:from-gray-600 hover:via-gray-700 hover:to-gray-600 rounded-2xl shadow-2xl h-14 transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl group relative overflow-hidden border border-gray-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          <span className="font-semibold">New Conversation</span>
        </Button>
      </div>

      {/* Enhanced Chat History */}
      <div className="flex-1 px-6 relative z-10 min-h-0">
        <div className="flex items-center gap-3 mb-5">
          <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400 animate-pulse" />
          <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Recent Chats
          </h3>
        </div>
        <ScrollArea className="h-full pr-2">
          <div className="space-y-3">
            {chatHistory.length > 0 ? (
              chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className="group p-5 rounded-3xl hover:bg-gray-300/60 dark:hover:bg-gray-700/60 cursor-pointer transition-all duration-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-r from-transparent to-gray-300/20 dark:to-gray-700/20 hover:from-gray-300/30 hover:to-gray-300/40 dark:hover:from-gray-700/30 dark:hover:to-gray-700/40 backdrop-blur-sm"
                  onClick={() => onChatSelect?.(chat)}
                >
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 mb-3 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-all duration-300">
                    {chat.question}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {new Date(chat.timestamp).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {chat.feedback && (
                      <div className="text-sm transition-transform duration-300 group-hover:scale-110">
                        {chat.feedback.rating === '👍 Yes' ? '👍' : '👎'}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-300/50 to-gray-400/30 dark:from-gray-600/50 dark:to-gray-700/30 mb-6 relative border border-gray-300 dark:border-gray-600">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-400/10 to-gray-500/10 animate-pulse"></div>
                  <MessageSquare className="h-10 w-10 text-gray-600 dark:text-gray-400 relative z-10" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold">No conversations yet</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Start by asking a question!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Enhanced Footer */}
      <div className="relative z-10 p-6 pt-4 border-t border-gray-300 dark:border-gray-600 bg-gray-100/60 dark:bg-gray-700/60 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 transition-all duration-300 hover:text-gray-800 dark:hover:text-gray-200">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span className="font-medium">Powered by Bignalytics AI</span>
        </div>
      </div>
    </div>
  )
}
