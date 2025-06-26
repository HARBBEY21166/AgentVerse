'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChatHistory } from '@/lib/chat-history';
import { Loader2 } from 'lucide-react';

export default function NewChatPage() {
  const router = useRouter();
  const { startNewChat } = useChatHistory();

  useEffect(() => {
    const newChatId = startNewChat();
    router.replace(`/chat/${newChatId}`);
  }, [startNewChat, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
