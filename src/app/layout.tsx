import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { ChatHistoryProvider } from '@/components/chat-history-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AgentVerse',
  description: 'A fully functional AI Agent',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ChatHistoryProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="md:pl-[--sidebar-width-icon] lg:pl-[--sidebar-width]">
              {children}
              <Toaster />
            </main>
          </SidebarProvider>
        </ChatHistoryProvider>
      </body>
    </html>
  );
}
