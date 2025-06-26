import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import { Toaster } from '@/components/ui/toaster';

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
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <SidebarProvider>
          <AppSidebar />
          <main className="md:pl-[--sidebar-width-icon] lg:pl-[--sidebar-width]">
            {children}
            <Toaster />
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
