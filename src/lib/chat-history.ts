'use client';

import { createContext, useContext } from 'react';
import type { Conversation, Message } from './types';

export const CHAT_HISTORY_KEY = 'chatHistory';

export interface ChatHistoryContextType {
  conversations: Omit<Conversation, 'messages'>[];
  activeConversation: Conversation | null;
  loadConversation: (id: string) => void;
  startNewChat: () => string;
  updateActiveConversation: (messages: Message[]) => void;
  deleteConversation: (id: string) => void;
  clearHistory: () => void;
}

export const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

export const useChatHistory = () => {
  const context = useContext(ChatHistoryContext);
  if (context === undefined) {
    throw new Error('useChatHistory must be used within a ChatHistoryProvider');
  }
  return context;
};
