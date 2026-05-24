import {
  Code, Sparkles, Terminal, StickyNote, Link as LinkIcon,
  File, Image as ImageIcon, Layers, FolderOpen, Star, BookMarked,
  type LucideIcon,
} from 'lucide-react';
import { mockItemTypes, mockTypeCounts, mockCollections, mockItems } from '@/lib/mock-data';
import StatsCard from '@/components/dashboard/StatsCard';
import CollectionCard from '@/components/dashboard/CollectionCard';
import ItemCard from '@/components/dashboard/ItemCard';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link: LinkIcon,
  File,
  Image: ImageIcon,
};

export default function DashboardPage() {
  const totalItems = Object.values(mockTypeCounts).reduce((a, b) => a + b, 0);
  const totalCollections = mockCollections.length;
  const favoriteItemCount = mockItems.filter((i) => i.isFavorite).length;
  const favoriteCollectionCount = mockCollections.filter((c) => c.isFavorite).length;

  const typeMap = Object.fromEntries(mockItemTypes.map((t) => [t.id, t]));

  // Build collectionId → unique ordered typeIds from items (dominant type first)
  const collectionTypeIds: Record<string, Set<string>> = {};
  for (const item of mockItems) {
    for (const colId of item.collectionIds) {
      if (!collectionTypeIds[colId]) collectionTypeIds[colId] = new Set();
      collectionTypeIds[colId].add(item.itemTypeId);
    }
  }

  const pinnedItems = mockItems.filter((i) => i.isPinned);
  const recentItems = mockItems.slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatsCard label="Items" value={totalItems} icon={Layers} />
        <StatsCard label="Collections" value={totalCollections} icon={FolderOpen} />
        <StatsCard label="Favorite Items" value={favoriteItemCount} icon={Star} />
        <StatsCard label="Favorite Collections" value={favoriteCollectionCount} icon={BookMarked} />
      </div>

      {/* Collections */}
      <section>
        <h2 className="mb-3 text-sm font-semibold">
          Collections{' '}
          <span className="font-normal text-muted-foreground">({totalCollections})</span>
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockCollections.map((col) => {
            const dominantType = typeMap[col.dominantTypeId];
            const dominantColor = dominantType?.color ?? '#6b7280';

            // Unique type IDs for this collection: dominant first, then others from items
            const knownTypeIds = collectionTypeIds[col.id]
              ? [col.dominantTypeId, ...Array.from(collectionTypeIds[col.id]).filter((id) => id !== col.dominantTypeId)]
              : [col.dominantTypeId];

            const typeIcons = knownTypeIds.map((typeId) => {
              const t = typeMap[typeId];
              return { Icon: t ? (ICON_MAP[t.icon] ?? File) : File, color: t?.color ?? '#6b7280' };
            });

            return (
              <CollectionCard
                key={col.id}
                id={col.id}
                name={col.name}
                description={col.description}
                itemCount={col.itemCount}
                isFavorite={col.isFavorite}
                dominantColor={dominantColor}
                typeIcons={typeIcons}
              />
            );
          })}
        </div>
      </section>

      {/* Pinned Items */}
      {pinnedItems.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold">Pinned Items</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {pinnedItems.map((item) => {
              const type = typeMap[item.itemTypeId];
              const Icon = type ? (ICON_MAP[type.icon] ?? File) : File;
              const color = type?.color ?? '#6b7280';
              return (
                <ItemCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  contentType={item.contentType}
                  content={item.content}
                  url={item.url}
                  isFavorite={item.isFavorite}
                  isPinned={item.isPinned}
                  tags={item.tags}
                  typeColor={color}
                  TypeIcon={Icon}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Recent Items */}
      <section>
        <h2 className="mb-3 text-sm font-semibold">Recent Items</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recentItems.map((item) => {
            const type = typeMap[item.itemTypeId];
            const Icon = type ? (ICON_MAP[type.icon] ?? File) : File;
            const color = type?.color ?? '#6b7280';
            return (
              <ItemCard
                key={item.id}
                title={item.title}
                description={item.description}
                contentType={item.contentType}
                content={item.content}
                url={item.url}
                isFavorite={item.isFavorite}
                isPinned={item.isPinned}
                tags={item.tags}
                typeColor={color}
                TypeIcon={Icon}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
