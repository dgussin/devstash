'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import SidebarContent from './SidebarContent';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200',
        collapsed ? 'w-14' : 'w-56'
      )}
    >
      <SidebarContent collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
    </aside>
  );
}
