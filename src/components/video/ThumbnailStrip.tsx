import React from 'react';
import { ImageView } from '@/components/ui/ImageView';

export type ThumbnailStripItem = {
  id: string;
  title?: string | null;
  thumbnailUrl?: string | null;
};

export type ThumbnailStripProps = {
  items: ThumbnailStripItem[];
  selectedIndex?: number | null;
  onSelectIndex: (index: number) => void;
  className?: string;
};

const ThumbnailStripImpl: React.FC<ThumbnailStripProps> = ({
  items,
  selectedIndex = null,
  onSelectIndex,
  className,
}) => {
  return (
    <div
      className={`flex gap-3 overflow-x-auto no-scrollbar ${className}`}
      role="navigation"
      aria-label="Video thumbnail strip"
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          tabIndex={0}
          onClick={() => onSelectIndex(index)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSelectIndex(index);
            }

            if (e.key === ' ') {
              e.preventDefault();
              onSelectIndex(index);
            }
          }}
          className={`w-24 h-16 rounded-lg overflow-hidden ${
            selectedIndex === index ? 'ring ring-2 ring-white/50' : ''
          }`}
          aria-label={item.title || item.id}
        >
          <ImageView
            src={item.thumbnailUrl}
            alt={item.title || item.id}
            fallbackText="Thumbnail unavailable"
          />
        </button>
      ))}
    </div>
  );
};

export const ThumbnailStrip = React.memo(ThumbnailStripImpl);
ThumbnailStrip.displayName = 'ThumbnailStrip';
