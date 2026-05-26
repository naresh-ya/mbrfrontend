import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarToggle } from '@/components/layout/sidebar-toggle';
import { Toaster } from "@/components/ui/toaster";
import { UIMonthProvider } from '@/contexts/UIMonthContext';

export const metadata: Metadata = {
  title: 'LokI',
  description: 'Your AI-powered business intelligence dashboard.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <UIMonthProvider>
          <SidebarProvider>
            <div className="flex w-full">
              <AppSidebar />
              <SidebarInset className="w-full">
                <SidebarToggle />
                {children}
              </SidebarInset>
            </div>
          </SidebarProvider>
          <Toaster />
        </UIMonthProvider>
      </body>
    </html>
  );
}
