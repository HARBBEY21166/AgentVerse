
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { chat } from '@/ai/flows/chat';
import { textToSpeech } from '@/ai/flows/tts';
import type { Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppHeader } from '@/components/app-header';
import {
  Bot,
  Send,
  User,
  Loader2,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { AgentSettings } from '@/lib/settings';
import { SETTINGS_KEY, DEFAULT_SETTINGS } from '@/lib/settings';
import { useChatHistory } from '@/lib/chat-history';
import { CodeBlock } from '@/components/code-block';
import { Skeleton } from '@/components/ui/skeleton';

function ChatSkeleton() {
  return (
    <div className="flex h-screen flex-col">
      <AppHeader title="Chat" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-2xl space-y-6 lg:max-w-4xl">
          <div className="flex w-full items-start gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="w-full max-w-prose space-y-2 rounded-lg bg-card p-3 shadow-sm border">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
          <div className="flex w-full items-start gap-4 justify-end">
             <div className="w-full max-w-prose space-y-2 rounded-lg bg-primary p-3 shadow-sm">
                <Skeleton className="h-4 w-full" />
             </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
           <div className="flex w-full items-start gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="w-full max-w-prose space-y-2 rounded-lg bg-card p-3 shadow-sm border">
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
       <div className="border-t bg-background">
        <div className="mx-auto w-full max-w-4xl p-4">
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}


export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.conversationId as string;
  
  const { activeConversation, loadConversation, updateActiveConversation, isLoading: isHistoryLoading } = useChatHistory();
  const messages = activeConversation?.messages || [];

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AgentSettings>(DEFAULT_SETTINGS);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [audioLoading, setAudioLoading] = useState<string | null>(null);

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId, loadConversation]);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      console.error('Failed to parse settings from localStorage', error);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleOpenInSandbox = (code: string) => {
    const encodedCode = encodeURIComponent(code);
    router.push(`/sandbox?code=${encodedCode}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
    };
    
    const newMessages = [...messages, userMessage];
    updateActiveConversation(newMessages);

    setInput('');
    setIsLoading(true);

    try {
      const historyForApi = newMessages.map((msg) => ({
        role: msg.role === 'user' ? ('user' as const) : ('model' as const),
        content: msg.content,
      }));

      const result = await chat({
        history: historyForApi.slice(0, -1),
        message: input,
        settings,
      });

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.message,
        code: result.code,
      };
      updateActiveConversation([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response. Please try again.',
        variant: 'destructive',
      });
      updateActiveConversation(messages);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePlayAudio = async (
    messageId: string,
    text: string
  ) => {
    const existingAudio = activeConversation?.messages.find(m => m.id === messageId)?.audioSrc;
    if (existingAudio) {
      new Audio(existingAudio).play();
      return;
    }

    setAudioLoading(messageId);
    try {
      const result = await textToSpeech({ text });
      const updatedMessages = messages.map(m =>
        m.id === messageId ? { ...m, audioSrc: result.audioDataUri } : m
      );
      updateActiveConversation(updatedMessages);
      new Audio(result.audioDataUri).play();
    } catch (error) {
      console.error('Error generating audio:', error);
      toast({
        title: 'Audio Error',
        description: 'Failed to generate audio for this message.',
        variant: 'destructive',
      });
    } finally {
      setAudioLoading(null);
    }
  };

  if (isHistoryLoading) {
     return <ChatSkeleton />;
  }

  return (
    <div className="flex h-screen flex-col">
      <AppHeader title={activeConversation?.title || "Chat"} />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-2xl space-y-6 lg:max-w-4xl">
          {messages.length === 0 && !isLoading ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground pt-16">
              <Bot className="h-16 w-16" />
              <h2 className="mt-4 text-2xl font-semibold text-foreground">
                Chat with {settings.agentName}
              </h2>
              <p className="mt-2">
                Start a conversation by typing a message below. Your agent's persona can be changed in Settings.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex w-full items-start gap-4',
                  message.role === 'user' ? 'justify-end' : ''
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-prose rounded-lg p-3 text-sm shadow-sm w-full',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border flex-grow'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.code && (
                    <div className="mt-4 space-y-2">
                      <CodeBlock code={message.code} />
                      <Button
                        onClick={() => handleOpenInSandbox(message.code!)}
                        variant="outline"
                        size="sm"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in Sandbox
                      </Button>
                    </div>
                  )}
                </div>
                {message.role === 'assistant' && (
                   <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePlayAudio(message.id, message.content)}
                      disabled={!!audioLoading}
                      aria-label="Play audio"
                      className="shrink-0"
                   >
                      {audioLoading === message.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                          <Volume2 className="h-5 w-5" />
                      )}
                  </Button>
                )}
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage
                      src="https://i.pinimg.com/1200x/d0/fd/68/d0fd686d9f97f4c8ee97e6f722f06ccc.jpg"
                      alt="@user"
                      data-ai-hint="user avatar"
                    />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex w-full items-start justify-start gap-4">
              <Avatar className="h-8 w-8 border">
                <AvatarFallback>
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="w-full max-w-prose space-y-2 rounded-lg bg-card p-3 shadow-sm border">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-background">
        <div className="mx-auto w-full max-w-4xl p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${settings.agentName}...`}
              disabled={isLoading}
              className="text-base"
              autoFocus
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
