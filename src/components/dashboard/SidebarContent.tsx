'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Code, Sparkles, Terminal, StickyNote, Link as LinkIcon,
  File, Image as ImageIcon, LayoutDashboard, Clock, Star,
  Settings, ChevronLeft, ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { mockItemTypes, mockTypeCounts, mockCollections, mockUser } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link: LinkIcon,
  File,
  Image: ImageIcon,
};

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Recent', href: '/dashboard/recent', icon: Clock },
  { label: 'Favorites', href: '/dashboard/favorites', icon: Star },
];

interface SidebarContentProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

function SidebarTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span className="contents" />}>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  collapsed,
  active,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  collapsed?: boolean;
  active?: boolean;
}) {
  const el = (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        active && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
        collapsed && 'justify-center'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );

  return collapsed ? <SidebarTooltip label={label}>{el}</SidebarTooltip> : el;
}

export default function SidebarContent({ collapsed = false, onToggle }: SidebarContentProps) {
  const pathname = usePathname();

  const favoriteCollections = mockCollections.filter((c) => c.isFavorite);
  const recentCollections = mockCollections.filter((c) => !c.isFavorite).slice(0, 3);

  const initials = mockUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-2 pt-3">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            collapsed={collapsed}
            active={pathname === item.href}
          />
        ))}
      </nav>

      <div className="mx-3 border-t border-sidebar-border" />

      {/* Scrollable middle */}
      <div className="flex-1 overflow-y-auto">
        {/* Types */}
        <div className="p-2">
          {!collapsed && (
            <p className="mb-1 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Types
            </p>
          )}
          <div className="flex flex-col gap-0.5">
            {mockItemTypes.map((type) => {
              const Icon = ICON_MAP[type.icon] ?? File;
              const count = mockTypeCounts[type.id] ?? 0;
              const slug = type.name.toLowerCase() + 's';

              const el = (
                <Link
                  key={type.id}
                  href={`/items/${slug}`}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    collapsed && 'justify-center'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{type.name}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
                    </>
                  )}
                </Link>
              );

              return collapsed ? (
                <SidebarTooltip key={type.id} label={`${type.name} (${count})`}>
                  {el}
                </SidebarTooltip>
              ) : (
                el
              );
            })}
          </div>
        </div>

        {/* Collections — only shown when expanded */}
        {!collapsed && (
          <div className="p-2">
            <div className="mx-2 border-t border-sidebar-border mb-2" />
            <p className="mb-1 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Favorites
            </p>
            <div className="flex flex-col gap-0.5">
              {favoriteCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                  <span className="truncate">{col.name}</span>
                </Link>
              ))}
            </div>

            <p className="mb-1 mt-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recent
            </p>
            <div className="flex flex-col gap-0.5">
              {recentCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{col.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User area */}
      <div className="border-t border-sidebar-border p-2">
        {collapsed ? (
          <div className="flex justify-center py-1">
            <SidebarTooltip label={`${mockUser.name} · ${mockUser.email}`}>
              <Avatar className="h-7 w-7 cursor-pointer">
                <AvatarImage src={mockUser.image ?? undefined} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            </SidebarTooltip>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarImage src={mockUser.image ?? undefined} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{mockUser.name}</p>
              <p className="truncate text-xs text-muted-foreground">{mockUser.email}</p>
            </div>
            <Settings className="h-4 w-4 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground" />
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={cn(
            'mt-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors',
            'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            collapsed && 'justify-center'
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
