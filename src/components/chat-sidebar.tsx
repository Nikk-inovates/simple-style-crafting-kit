
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
    <div className="flex flex-col h-full w-80 bg-background/80 backdrop-blur-2xl backdrop-saturate-150 border-r border-border/30 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-purple-500/5 opacity-50"></div>
      
      {/* Enhanced Header */}
      <div className="relative z-10 flex items-center justify-between p-6 border-b border-border/30 bg-background/40 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img 
              src="https://bignalytics.in/wp-content/uploads/2021/04/logo-1.png" 
              alt="Bignalytics" 
              className="h-12 w-12 object-contain rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full border-2 border-background shadow-lg animate-pulse"></div>
          </div>
          <div className="transition-all duration-300">
            <span className="font-bold text-foreground text-lg bg-gradient-to-r from-foreground to-primary bg-clip-text">Bignalytics</span>
            <p className="text-xs text-muted-foreground font-medium">AI Assistant</p>
          </div>
        </div>
        <div className="transition-all duration-300 hover:scale-110">
          <ThemeToggle />
        </div>
      </div>

      {/* Enhanced New Chat Button */}
      <div className="relative z-10 p-6 pb-4">
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-4 bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:via-primary/95 hover:to-primary/80 rounded-2xl shadow-2xl h-14 transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          <span className="font-semibold">New Conversation</span>
        </Button>
      </div>

      {/* Enhanced Chat History */}
      <div className="flex-1 px-6 relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Recent Chats
          </h3>
        </div>
        <ScrollArea className="h-full pr-2">
          <div className="space-y-3">
            {chatHistory.length > 0 ? (
              chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className="group p-5 rounded-3xl hover:bg-muted/60 cursor-pointer transition-all duration-300 border border-transparent hover:border-border/50 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-r from-transparent to-muted/20 hover:from-muted/30 hover:to-muted/40 backdrop-blur-sm"
                  onClick={() => onChatSelect?.(chat)}
                >
                  <div className="text-sm font-semibold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-all duration-300">
                    {chat.question}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground font-medium">
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
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-muted/50 to-muted/30 mb-6 relative">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-purple-500/10 animate-pulse"></div>
                  <MessageSquare className="h-10 w-10 text-muted-foreground/60 relative z-10" />
                </div>
                <p className="text-sm text-muted-foreground mb-2 font-semibold">No conversations yet</p>
                <p className="text-xs text-muted-foreground/70">Start by asking a question!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Enhanced Footer */}
      <div className="relative z-10 p-6 pt-4 border-t border-border/30 bg-background/40 backdrop-blur-xl">
        <div className="flex items-center gap-3 text-xs text-muted-foreground transition-all duration-300 hover:text-foreground">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span className="font-medium">Powered by Bignalytics AI</span>
        </div>
      </div>
    </div>
  )
}
