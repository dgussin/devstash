import Link from 'next/link';
import { Star, type LucideIcon } from 'lucide-react';

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface TypeIcon {
  Icon: LucideIcon;
  color: string;
}

interface CollectionCardProps {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  isFavorite: boolean;
  dominantColor: string;
  typeIcons: TypeIcon[];
}

export default function CollectionCard({
  id,
  name,
  description,
  itemCount,
  isFavorite,
  dominantColor,
  typeIcons,
}: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${id}`}
      className="group relative flex min-h-[120px] flex-col rounded-lg border p-4 transition-opacity hover:opacity-90"
      style={{
        backgroundColor: hexToRgba(dominantColor, 0.12),
        borderColor: hexToRgba(dominantColor, 0.3),
      }}
    >
      {isFavorite && (
        <Star className="absolute right-3 top-3 h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      )}

      <div className="mb-1 pr-5">
        <p className="font-semibold leading-tight">{name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{itemCount} items</p>
      </div>

      <p className="line-clamp-2 flex-1 text-xs text-muted-foreground">{description}</p>

      <div className="mt-3 flex items-center gap-2">
        {typeIcons.map(({ Icon, color }, i) => (
          <Icon key={i} className="h-3.5 w-3.5" style={{ color }} />
        ))}
      </div>
    </Link>
  );
}
