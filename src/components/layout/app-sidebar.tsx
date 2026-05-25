'use client';

// use plain <img> to avoid SSR/Client attribute mismatches from next/image
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  FileText,
  User,
  X,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar className="bg-[#003ea5]">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative h-30 w-36">
              <img
                src="/pmi_logo.png"
                alt="PMI logo"
                className="h-30 w-32 object-contain"
              />
            </div>
            <span className="text-white text-lg font-bold tracking-wide mt-3">LokI</span>
          </div>
          <Button
            variant="ghost"
            size="icon" 
            onClick={toggleSidebar}
            className="h-8 w-8 shrink-0"
            title="Close sidebar"
          >
            <X className="size-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
          <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Ask MBR">
              <Link href="/" className="flex items-center gap-2 px-3 py-1">
                <Bot className="h-4 w-4 shrink-0 text-white" />
                <span className="text-xs font-semibold text-white">Ask MBR</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/story'} tooltip="iSynesis">
              <Link href="/story" className="flex items-center gap-2 px-3 py-1">
                <BookOpen className="h-4 w-4 shrink-0 text-white" />
                <span className="text-xs font-semibold text-white">iSynesis</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/kpi'} tooltip="Outcome Indicators">
              <Link href="/kpi" className="flex items-center gap-2 px-3 py-1">
                <LayoutDashboard className="h-4 w-4 shrink-0 text-white" />
                <span className="text-xs font-semibold text-white">Outcome Indicators</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/driving-indicators'} tooltip="Driving Indicators">
              <Link href="/driving-indicators" className="flex items-center gap-2 px-3 py-1">
                <FileText className="h-4 w-4 shrink-0 text-white" />
                <span className="text-xs font-semibold text-white">Driving Indicators</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="My Space (upcoming)" isActive={pathname === '/my-space'}>
              <Link href="/my-space" className="flex items-center gap-2 px-3 py-1">
                <User className="h-4 w-4 shrink-0 text-white" />
                <span className="text-xs font-semibold text-white">My Space <em className="italic">(upcoming)</em></span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Separator className="my-2" />
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://picsum.photos/seed/shivam/100/100" data-ai-hint="profile person" />
            <AvatarFallback>SS</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">Shivam Sharma</span>
            <span className="text-xs text-muted-foreground">
              View Profile
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
