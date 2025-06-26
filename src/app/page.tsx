'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { chat } from '@/ai/flows/chat';
import type { Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppHeader } from '@/components/app-header';
import { Bot, Send, User, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { AgentSettings } from '@/lib/settings';
import { SETTINGS_KEY, DEFAULT_SETTINGS } from '@/lib/settings';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AgentSettings>(DEFAULT_SETTINGS);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    let url = `/sandbox?code=${encodedCode}`;
    router.push(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historyForApi = messages.map((msg) => ({
        role: msg.role === 'user' ? ('user' as const) : ('model' as const),
        content: msg.content,
      }));

      const result = await chat({
        history: historyForApi,
        message: input,
        settings,
      });

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.message,
        code: result.code,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response. Please try again.',
        variant: 'destructive',
      });
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <AppHeader title="Chat" />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6 lg:p-8">
          {messages.length === 0 && !isLoading && (
            <div className="flex h-[calc(100vh-12rem)] flex-col items-center justify-center text-center text-muted-foreground">
              <Bot className="h-16 w-16" />
              <h2 className="mt-4 text-2xl font-semibold text-foreground">
                Chat with {settings.agentName}
              </h2>
              <p className="mt-2">
                Start a conversation by typing a message below. Your agent's persona can be changed in Settings.
              </p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-4',
                message.role === 'user' ? 'justify-end' : 'justify-start'
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
                  'max-w-prose rounded-lg p-3 text-sm shadow-sm',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border'
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.code && (
                  <div className="mt-4">
                    <pre className="overflow-x-auto rounded-md bg-muted p-4 font-code">
                      <code>{message.code}</code>
                    </pre>
                    <Button
                      onClick={() =>
                        handleOpenInSandbox(message.code!)
                      }
                      className="mt-2"
                      variant="outline"
                      size="sm"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open in Sandbox
                    </Button>
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8 border">
                  <AvatarImage
                    src="https://placehold.co/40x40.png"
                    alt="@user"
                    data-ai-hint="user avatar"
                  />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4 justify-start">
              <Avatar className="h-8 w-8 border">
                <AvatarFallback>
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-md rounded-lg p-3 bg-card border shadow-sm">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-background">
        <div className="mx-auto max-w-2xl p-4">
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
