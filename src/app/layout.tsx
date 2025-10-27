import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { ChatHistoryProvider } from '@/components/chat-history-provider';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AgentVerse - Your Launchpad for Custom AI Agents',
  description:
    'Create and interact with sophisticated AI agents. Built with Next.js, Genkit, and ShadCN UI, AgentVerse is a fully-functional starting point for your next AI-powered application.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ChatHistoryProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className="md:pl-[--sidebar-width-icon] lg:pl-[--sidebar-width]">
                {children}
                <Toaster />
              </main>
            </SidebarProvider>
          </ChatHistoryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
