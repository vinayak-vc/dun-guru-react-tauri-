import React from 'react';
import { ImageView } from '@/components/ui/ImageView';
import nextSpritePng from '@/assets/images/Common/NextButtonSprite.png';
import prevSpritePng from '@/assets/images/Common/PreviousButtonSprite.png';

export type KioskThumb = {
  id: string;
  title?: string | null;
  thumbnailUrl?: string | null;
};

export type KioskThumbnailCarouselProps = {
  items: KioskThumb[];
  selectedIndex: number | null;
  onSelectIndex: (index: number) => void;
};

const THUMB = 194;
const GAP = 36;
const STEP = THUMB + GAP;

/**
 * Thumbnail row from `SHM Ui - Screen 5.svg`: y=3487, thumbs 194×194, gap ≈36, strip width 1114.
 */
export const KioskThumbnailCarousel: React.FC<KioskThumbnailCarouselProps> = ({
  items,
  selectedIndex,
  onSelectIndex,
}) => {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const itemButtonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const n = items.length;
  const safeSelectedIndex = Number.isFinite(selectedIndex) ? selectedIndex ?? 0 : 0;
  const normalizedIndex = n > 0 ? ((safeSelectedIndex % n) + n) % n : 0;
  const loopItems = n > 0 ? [...items, ...items, ...items] : items;
  const base = n;
  const activeVirtualIndex = n > 0 ? base + normalizedIndex : 0;
  const dragRef = React.useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  const scrollToVirtualIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const scroller = scrollerRef.current;
    const el = itemButtonRefs.current[index];
    if (!scroller || !el) return false;
    const target = el.offsetLeft + el.offsetWidth / 2 - scroller.clientWidth / 2;
    scroller.scrollTo({ left: target, behavior });
    return true;
  };

  React.useLayoutEffect(() => {
    if (n <= 0) return;
    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.scrollLeft = n * STEP;
    }

    const id1 = window.requestAnimationFrame(() => {
      const ok = scrollToVirtualIndex(activeVirtualIndex, 'auto');
      if (ok) return;
      window.requestAnimationFrame(() => scrollToVirtualIndex(activeVirtualIndex, 'auto'));
    });
    return () => window.cancelAnimationFrame(id1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeSelectedIndex, n]);

  const normalizeScrollWindow = () => {
    const el = scrollerRef.current;
    if (!el || n <= 0) return;
    const segment = n * STEP;
    if (el.scrollLeft < segment * 0.5) el.scrollLeft += segment;
    if (el.scrollLeft > segment * 1.5) el.scrollLeft -= segment;
  };

  const handleScrollPrev = () => {
    if (n <= 0) return;
    onSelectIndex((normalizedIndex - 1 + n) % n);
  };

  const handleScrollNext = () => {
    if (n <= 0) return;
    onSelectIndex((normalizedIndex + 1) % n);
  };

  const handlePrevKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handleScrollPrev();
  };

  const handleNextKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handleScrollNext();
  };

  return (
    <div
      className="absolute left-[523px] top-[3487px] flex h-[194px] w-[1114px] items-center overflow-visible"
      role="navigation"
      aria-label="Gallery thumbnails"
    >
      <button
        type="button"
        tabIndex={0}
        aria-label="Scroll thumbnails left"
        onClick={handleScrollPrev}
        onKeyDown={handlePrevKeyDown}
        className="absolute left-[-120px] flex h-[176px] w-[176px] items-center justify-center rounded-full bg-transparent transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
      >
        <img src={prevSpritePng} alt="" draggable={false} className="max-h-[160px] max-w-[160px] object-contain" aria-hidden />
      </button>

      <div
        ref={scrollerRef}
        className="no-scrollbar flex h-full w-full items-center gap-[36px] overflow-x-auto overflow-y-hidden pr-1"
        onScroll={normalizeScrollWindow}
        onPointerDown={(event) => {
          dragRef.current = { x: event.clientX, y: event.clientY, active: true };
        }}
        onPointerUp={(event) => {
          if (!dragRef.current.active) return;
          dragRef.current.active = false;
          const dx = event.clientX - dragRef.current.x;
          const dy = event.clientY - dragRef.current.y;
          if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return;
          if (dx < 0) handleScrollNext();
          else handleScrollPrev();
        }}
        onPointerCancel={() => {
          dragRef.current.active = false;
        }}
        style={{ touchAction: 'pan-y' }}
      >
        {loopItems.map((item, virtualIndex) => {
          const logicalIndex = n > 0 ? virtualIndex % n : virtualIndex;
          const selected = n > 0 && virtualIndex === base + normalizedIndex;
          return (
            <button
              key={`${item.id}-${virtualIndex}`}
              ref={(el) => {
                itemButtonRefs.current[virtualIndex] = el;
              }}
              type="button"
              tabIndex={0}
              aria-label={item.title || `Thumbnail ${logicalIndex + 1}`}
              aria-current={selected ? 'true' : undefined}
              onClick={() => onSelectIndex(logicalIndex)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectIndex(logicalIndex);
                }
              }}
              className={`relative h-[194px] w-[194px] shrink-0 overflow-hidden rounded-[24px] border-2 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/55 ${
                selected ? 'border-white ring-2 ring-white/60' : 'border-white/25 hover:border-white/50'
              }`}
            >
              <ImageView
                src={item.thumbnailUrl}
                alt={item.title || `Thumbnail ${logicalIndex + 1}`}
                className={`h-full w-full object-cover transition ${selected ? '' : 'grayscale opacity-45'}`}
                fallbackText=""
              />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        tabIndex={0}
        aria-label="Scroll thumbnails right"
        onClick={handleScrollNext}
        onKeyDown={handleNextKeyDown}
        className="absolute right-[-120px] flex h-[176px] w-[176px] items-center justify-center rounded-full bg-transparent transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
      >
        <img src={nextSpritePng} alt="" draggable={false} className="max-h-[160px] max-w-[160px] object-contain" aria-hidden />
      </button>
    </div>
  );
};
