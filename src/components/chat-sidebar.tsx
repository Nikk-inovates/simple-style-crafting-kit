
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
    <div className="flex flex-col h-full w-80 bg-background/95 backdrop-blur-xl border-r border-border/50">
      {/* Modern Header with gradient */}
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="https://bignalytics.in/wp-content/uploads/2021/04/logo-1.png" 
              alt="Bignalytics" 
              className="h-10 w-10 object-contain rounded-xl"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background shadow-sm"></div>
          </div>
          <div>
            <span className="font-bold text-foreground text-lg">Bignalytics</span>
            <p className="text-xs text-muted-foreground">AI Assistant</p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Modern New Chat Button */}
      <div className="p-6 pb-4">
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 rounded-xl shadow-lg h-12 transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">New Conversation</span>
        </Button>
      </div>

      {/* Chat History with modern styling */}
      <div className="flex-1 px-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Recent Chats
          </h3>
        </div>
        <ScrollArea className="h-full pr-2">
          <div className="space-y-3">
            {chatHistory.length > 0 ? (
              chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className="group p-4 rounded-2xl hover:bg-muted/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-border/50 hover:shadow-sm"
                  onClick={() => onChatSelect?.(chat)}
                >
                  <div className="text-sm font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {chat.question}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {new Date(chat.timestamp).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {chat.feedback && (
                      <div className="text-xs">
                        {chat.feedback.rating === '👍 Yes' ? '👍' : '👎'}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/50 mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">No conversations yet</p>
                <p className="text-xs text-muted-foreground/70">Start by asking a question!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Modern Footer */}
      <div className="p-6 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          <span>Powered by Bignalytics AI</span>
        </div>
      </div>
    </div>
  )
}
