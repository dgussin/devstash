import { Star, Pin, type LucideIcon } from 'lucide-react';

interface ItemCardProps {
  title: string;
  description?: string | null;
  contentType: string;
  content?: string | null;
  url?: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  tags: string[];
  typeColor: string;
  TypeIcon: LucideIcon;
}

export default function ItemCard({
  title,
  description,
  contentType,
  content,
  url,
  isFavorite,
  isPinned,
  tags,
  typeColor,
  TypeIcon,
}: ItemCardProps) {
  const preview = contentType === 'URL' ? url : content;
  const truncatedPreview = preview ? preview.slice(0, 180) : null;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-2">
        <TypeIcon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: typeColor }} />
        <p className="flex-1 text-sm font-medium leading-tight">{title}</p>
        <div className="flex shrink-0 items-center gap-1.5">
          {isFavorite && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
          {isPinned && <Pin className="h-3.5 w-3.5 text-muted-foreground" />}
        </div>
      </div>

      {description && (
        <p className="line-clamp-1 text-xs text-muted-foreground">{description}</p>
      )}

      {truncatedPreview && (
        <div className="line-clamp-3 overflow-hidden rounded-md bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground">
          {truncatedPreview}
        </div>
      )}

      {tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1 pt-1">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
