'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCode } from '@/ai/flows/generate-code';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import { dracula } from 'react-live/themes';

// Scope for react-live
import * as LucideIcons from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

const scope = {
  ...LucideIcons,
  React,
  useState: React.useState,
  useEffect: React.useEffect,
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Label,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  Calendar,
  Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Switch,
};


function SandboxComponent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code');

  const [prompt, setPrompt] = useState('');
  const [liveCode, setLiveCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState(0); // To force re-mount of preview
  const { toast } = useToast();

  useEffect(() => {
    if (initialCode) {
      setLiveCode(initialCode);
    }
  }, [initialCode]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    
    try {
      const result = await generateCode({ prompt });
      setLiveCode(result.code);
      setKey(prev => prev + 1); // Remount preview
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCodeChange = (newCode: string) => {
    setLiveCode(newCode);
  };
  
  const forceRerender = () => setKey(prev => prev + 1);

  return (
    <div className="flex h-screen flex-col">
      <AppHeader title="Code Sandbox" />
      <div className="flex-1 overflow-hidden">
        <LiveProvider code={liveCode} scope={scope} theme={dracula} noInline={false}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 md:p-6 lg:p-8 h-full">
            
            {/* Left Column: Prompt and Editor */}
            <div className="flex flex-col gap-4 max-h-[calc(100vh-6rem)]">
              <Card>
                <CardHeader>
                  <CardTitle>Code Generation Prompt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A React button component that increments a counter"
                    className="min-h-[100px] text-base"
                    disabled={isLoading}
                  />
                  <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Code
                  </Button>
                </CardContent>
              </Card>
              <Card className="flex-1 flex flex-col overflow-hidden">
                <CardHeader>
                  <CardTitle>Live Editor</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 relative">
                  <div className="absolute inset-0 overflow-auto">
                    <LiveEditor 
                      onChange={handleCodeChange} 
                      className="text-sm !font-mono h-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column: Preview */}
            <Card className="flex flex-col overflow-hidden max-h-[calc(100vh-6rem)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Live Preview</CardTitle>
                <Button variant="ghost" size="icon" onClick={forceRerender} title="Refresh Preview">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 bg-muted/20 rounded-b-lg border flex flex-col items-stretch justify-stretch p-4 relative overflow-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <LivePreview key={key} className="flex-1" />
                    <LiveError className="text-destructive text-xs font-mono p-2 mt-2 bg-destructive/10 rounded-md overflow-auto" />
                  </>
                )}
              </CardContent>
            </Card>

          </div>
        </LiveProvider>
      </div>
    </div>
  );
}

export default function SandboxPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SandboxComponent />
    </Suspense>
  )
}
