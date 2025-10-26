
'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { MessageSquare, Settings, Code, Plus, Trash2, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChatHistory } from '@/lib/chat-history';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { conversations, deleteConversation, isLoading } = useChatHistory();
  const { setTheme, theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const conversationId = pathname.startsWith('/chat/') ? pathname.split('/').pop() : null;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteConversation(id);
    if (pathname === `/chat/${id}`) {
      router.replace('/');
    }
  };

  const renderThemeToggle = () => {
    if (!isMounted) {
      return (
        <div className="flex w-full justify-center p-2 group-data-[collapsible=icon]:hidden">
          <Skeleton className="h-9 w-[76px] rounded-md" />
        </div>
      );
    }
    return (
      <>
        <div className="flex w-full justify-center p-2 group-data-[collapsible=icon]:hidden">
          <div className="rounded-md border p-1 flex items-center">
            <Button
              variant={theme === 'light' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setTheme('light')}
              className="h-7 w-7"
            >
              <Sun className="h-5 w-5" />
            </Button>
            <Button
              variant={theme === 'dark' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setTheme('dark')}
              className="h-7 w-7"
            >
              <Moon className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="hidden justify-center p-2 group-data-[collapsible=icon]:flex">
          {theme === 'light' ? (
            <Button variant="ghost" size="icon" onClick={() => setTheme('dark')} className="h-8 w-8">
              <Moon className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setTheme('light')} className="h-8 w-8">
              <Sun className="h-5 w-5" />
            </Button>
          )}
        </div>
      </>
    );
  };

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <img width="32" height="32" src="https://img.icons8.com/ink/48/chatbot.png" alt="chatbot"/>
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            AgentVerse
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col p-2">
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton asChild tooltip="New Chat">
               <Link href="/">
                 <Plus />
                 <span>New Chat</span>
               </Link>
             </SidebarMenuButton>
           </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <div className="flex-1 overflow-y-auto">
          <SidebarMenu>
            {isLoading ? (
               <div className="space-y-2 px-1">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
               </div>
            ) : (
              conversations.map((conv) => (
                <SidebarMenuItem key={conv.id} className="group/item relative">
                  <SidebarMenuButton
                    asChild
                    isActive={conversationId === conv.id}
                    tooltip={conv.title}
                  >
                    <Link href={`/chat/${conv.id}`}>
                      <MessageSquare />
                      <span className="truncate pr-6">{conv.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <button
                    onClick={(e) => handleDelete(e, conv.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground opacity-0 group-hover/item:opacity-100 hover:bg-destructive/10 hover:text-destructive group-data-[collapsible=icon]:hidden"
                    aria-label="Delete chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </div>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/sandbox'}
              tooltip="Sandbox"
            >
              <Link href="/sandbox">
                <Code />
                <span>Sandbox</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/settings'}
              tooltip="Settings"
            >
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        {renderThemeToggle()}
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Profile">
              <Avatar className="h-8 w-8">
                 <AvatarImage src="https://i.pinimg.com/736x/83/4f/e6/834fe637588ed7ccca41c0ebd659e855.jpg " alt="@user" data-ai-hint="user avatar" />
                 <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              <span className="group-data-[collapsible=icon]:hidden">Abiodun Abbey Aina</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
