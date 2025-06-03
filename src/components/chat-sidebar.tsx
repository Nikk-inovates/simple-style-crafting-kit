
import React from 'react'
import { MessageSquare, Plus, Clock } from 'lucide-react'
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
    <div className="flex flex-col h-full w-64 bg-background border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <img 
            src="https://bignalytics.in/wp-content/uploads/2021/04/logo-1.png" 
            alt="Bignalytics" 
            className="h-8 w-8 object-contain"
          />
          <span className="font-semibold text-foreground">Bignalytics</span>
        </div>
        <ThemeToggle />
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 px-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Chats
        </h3>
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {chatHistory.length > 0 ? (
              chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                  onClick={() => onChatSelect?.(chat)}
                >
                  <div className="text-sm font-medium text-foreground line-clamp-1 mb-1">
                    {chat.question}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(chat.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
