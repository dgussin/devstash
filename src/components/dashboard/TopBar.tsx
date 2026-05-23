import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TopBar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 shrink-0">
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-muted-foreground">DevStash</span>
        <h1 className="text-sm font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="h-8 w-56 pl-8 text-sm"
          />
        </div>
        <Button size="sm" className="h-8 gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          New Item
        </Button>
      </div>
    </header>
  );
}
