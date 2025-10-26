'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Conversation, Message } from '@/lib/types';
import { CHAT_HISTORY_KEY, ChatHistoryContext } from '@/lib/chat-history';

export const ChatHistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedHistory) {
        setAllConversations(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    try {
      if (allConversations.length > 0) {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(allConversations));
      } else if (localStorage.getItem(CHAT_HISTORY_KEY)) {
        localStorage.removeItem(CHAT_HISTORY_KEY);
      }
    } catch (error) {
      console.error("Failed to save chat history to localStorage", error);
    }
  }, [allConversations, isLoading]);
  
  const loadConversation = useCallback((id: string) => {
    const conversation = allConversations.find(c => c.id === id) || null;
    setActiveConversation(conversation);
  }, [allConversations]);

  const startNewChat = useCallback(() => {
    const newId = `chat-${Date.now()}`;
    const newConversation: Conversation = { 
      id: newId, 
      title: 'New Chat', 
      messages: [] 
    };
    
    setAllConversations(prev => {
       // Check if a chat with this ID already exists to prevent duplicates from rapid clicks
      if (prev.some(c => c.id === newId)) {
        return prev;
      }
      return [newConversation, ...prev];
    });

    setActiveConversation(newConversation);
    return newId;
  }, []);

  const updateActiveConversation = useCallback((messages: Message[]) => {
    setActiveConversation(prevActive => {
      if (!prevActive) return null;

      let newTitle = prevActive.title;
      if (prevActive.messages.length === 0 && messages.length > 0) {
        const firstUserMessage = messages.find(m => m.role === 'user');
        if (firstUserMessage) {
          newTitle = firstUserMessage.content.substring(0, 35) + (firstUserMessage.content.length > 35 ? '...' : '');
        }
      }

      const updatedConversation = { ...prevActive, messages, title: newTitle };
      
      setAllConversations(prevAll => 
        prevAll.map(c => c.id === prevActive.id ? updatedConversation : c)
      );

      return updatedConversation;
    });
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setAllConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversation?.id === id) {
      setActiveConversation(null);
    }
  }, [activeConversation]);

  const clearHistory = useCallback(() => {
    setAllConversations([]);
    setActiveConversation(null);
  }, []);
  
  const conversationsForSidebar = allConversations.map(({ id, title }) => ({ id, title }));

  const contextValue = { 
      conversations: conversationsForSidebar,
      activeConversation,
      isLoading,
      loadConversation,
      startNewChat, 
      updateActiveConversation,
      deleteConversation, 
      clearHistory 
    };

  return (
    <ChatHistoryContext.Provider value={contextValue}>
      {children}
    </ChatHistoryContext.Provider>
  );
};
