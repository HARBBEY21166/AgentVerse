
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChatHistory } from '@/lib/chat-history';
import { Skeleton } from '@/components/ui/skeleton';
import { AppHeader } from '@/components/app-header';


function NewChatSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
       <div className="flex flex-col items-center gap-4">
         <p className="text-muted-foreground">Starting new chat...</p>
         <Skeleton className="h-8 w-48" />
       </div>
    </div>
  );
}

export default function NewChatPage() {
  const router = useRouter();
  const { startNewChat } = useChatHistory();

  useEffect(() => {
    const newChatId = startNewChat();
    router.replace(`/chat/${newChatId}`);
  }, [startNewChat, router]);

  return <NewChatSkeleton />;
}

    