'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Clipboard, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCode } from '@/ai/flows/generate-code';

function SandboxComponent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code');

  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialCode) {
      setGeneratedCode(initialCode);
    }
  }, [initialCode]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setGeneratedCode('');
    setIsCopied(false);

    try {
      const result = await generateCode({ prompt });
      setGeneratedCode(result.code);
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

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex h-screen flex-col">
      <AppHeader title="Code Sandbox" />
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6 lg:p-8 overflow-hidden">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Code Generation Prompt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A React button component using TypeScript and Tailwind CSS"
                className="min-h-[100px] text-base"
                disabled={isLoading}
              />
              <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Code
              </Button>
            </CardContent>
          </Card>
          <Card className="flex-1 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generated Code</CardTitle>
              {generatedCode && !isLoading && (
                 <Button variant="ghost" size="icon" onClick={handleCopy}>
                  {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                  <span className="sr-only">Copy code</span>
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-1">
              {isLoading ? (
                  <div className="flex items-center justify-center p-8 h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Textarea
                    value={generatedCode}
                    onChange={(e) => setGeneratedCode(e.target.value)}
                    className="h-full w-full resize-none font-code text-sm"
                    spellCheck="false"
                  />
                )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 bg-muted/20 rounded-b-lg border flex items-center justify-center">
             <div className="text-center text-muted-foreground">
                <p>Preview is not available yet.</p>
                <p className="text-xs">Run code to see a preview here.</p>
             </div>
          </CardContent>
        </Card>
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
