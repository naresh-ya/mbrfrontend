'use client';

import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export function SidebarToggle() {
  const { toggleSidebar, state } = useSidebar();

  // Only show menu icon when sidebar is collapsed
  if (state === 'expanded') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-40">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="h-10 w-10"
        title="Open sidebar"
      >
        <Menu className="size-5" />
      </Button>
    </div>
  );
}
