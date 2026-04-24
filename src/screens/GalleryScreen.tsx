import React from 'react';
import useAppStore from '@/store/appStore';
import { DesignFrame } from '@/components/layout/DesignFrame';
import { ExperienceItem, GalleryItem } from '@/models/types';
import { BackNavIconButton } from '@/components/home/BackNavIconButton';
import { GalleryBottomStrip } from '@/components/gallery/GalleryBottomStrip';
import logoPng from '@/assets/images/logo.png';
import backButtonPng from '@/assets/images/Common/BackButton.png';
import nextSpritePng from '@/assets/images/Common/NextButtonSprite.png';
import prevSpritePng from '@/assets/images/Common/PreviousButtonSprite.png';
import { DESIGN_H, DESIGN_W, pct } from '@/utils/designSpec';
import { AutoFitText } from '@/components/ui/AutoFitText';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

/**
 * Screen 3 — image + text. Layout reference: Figma export `SHM Ui - Screen 3` (2160×3840).
 * Same kiosk pattern: `DesignFrame` + absolute slots, no SVG as live background.
 */
const GalleryScreen: React.FC = () => {
  const setScreen = useAppStore((state) => state.setScreen);
  const setGalleryItem = useAppStore((state) => state.setGalleryItem);
  const setSelectedIndex = useAppStore((state) => state.setSelectedIndex);
  const selectedButton = useAppStore((state) => state.selectedButton);
  const selectedIndex = useAppStore((state) => state.selectedIndex);

  const handleBackToVideo = () => {
    setScreen('VIDEO');
  };

  /** Centers a square hit target inside Figma nav group (left%, right% of canvas width). */
  const navButtonLeftPx = (leftPct: number, rightPct: number, sizePx: number): number => {
    const groupW = pct(1 - leftPct - rightPct, DESIGN_W);
    return pct(leftPct, DESIGN_W) + Math.round((groupW - sizePx) / 2);
  };

  /** Centers a square hit target vertically (top%, bottom% of canvas height). */
  const navButtonTopPx = (topPct: number, bottomPct: number, sizePx: number): number => {
    const groupH = pct(1 - topPct - bottomPct, DESIGN_H);
    return pct(topPct, DESIGN_H) + Math.round((groupH - sizePx) / 2);
  };

  if (!isRecord(selectedButton)) {
    return (
      <DesignFrame designWidth={DESIGN_W} designHeight={DESIGN_H}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
          <p className="text-[40px] text-white/80">No selection</p>
          <button
            type="button"
            tabIndex={0}
            className="rounded-xl border border-white/20 bg-white/10 px-10 py-4 text-[28px] text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            onClick={handleBackToVideo}
          >
            Back
          </button>
        </div>
      </DesignFrame>
    );
  }

  const item = selectedButton as unknown as ExperienceItem;
  const galleryItems = item.galleryItems ?? [];
  const index = selectedIndex ?? 0;
  const current: GalleryItem | null = galleryItems[index] ?? null;

  if (!current) {
    return (
      <DesignFrame designWidth={DESIGN_W} designHeight={DESIGN_H}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
          <p className="text-[40px] text-white/80">No item available</p>
          <button
            type="button"
            tabIndex={0}
            className="rounded-xl border border-white/20 bg-white/10 px-10 py-4 text-[28px] text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            onClick={handleBackToVideo}
          >
            Back
          </button>
        </div>
      </DesignFrame>
    );
  }

  const n = galleryItems.length;

  const goPrev = () => {
    if (n <= 0) return;
    setSelectedIndex((index - 1 + n) % n);
  };

  const goNext = () => {
    if (n <= 0) return;
    setSelectedIndex((index + 1) % n);
  };

  const swipeRef = React.useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  const handleMainPointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    swipeRef.current = { x: event.clientX, y: event.clientY, active: true };
  };

  const handleMainPointerUp: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!swipeRef.current.active) return;
    swipeRef.current.active = false;
    const dx = event.clientX - swipeRef.current.x;
    const dy = event.clientY - swipeRef.current.y;
    if (Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  const handleMainKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    setGalleryItem(current);
    setScreen('DETAIL');
  };

  const handleSideNavKeyDown =
    (dir: 'prev' | 'next'): React.KeyboardEventHandler<HTMLButtonElement> =>
    (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      if (dir === 'prev') goPrev();
      else goNext();
    };

  const stripItems = galleryItems.map((g, i) => ({
    id: g._id ?? String(i),
    title: g.title,
    thumbnailUrl: g.imageUrl,
  }));

  const mainSrc = current.imageUrl;
  const titleText = current.title ?? 'Gallery';

  return (
    <DesignFrame designWidth={DESIGN_W} designHeight={DESIGN_H}>
      {/** Figma nav group ~176×176 */} 
      {(() => {
        const navSize = 176;
        return (
          <>
      <BackNavIconButton
        leftPx={navButtonLeftPx(0.0481, 0.8705, navSize)}
        topPx={navButtonTopPx(0.0271, 0.9271, navSize)}
        ariaLabel="Back to video"
        onClick={handleBackToVideo}
        iconSrc={backButtonPng}
        sizePx={navSize}
      />
      <BackNavIconButton
        leftPx={navButtonLeftPx(0.0556, 0.863, navSize)}
        topPx={navButtonTopPx(0.9115, 0.0428, navSize)}
        ariaLabel="Back to video"
        onClick={handleBackToVideo}
        iconSrc={backButtonPng}
        sizePx={navSize}
      />
          </>
        );
      })()}

      {/* Title — UX: center within safe band between Back (left) and Logo (right) */} 
      <div
        className="pointer-events-none absolute text-center"
        style={{
          top: pct(0.0328, DESIGN_H),
          left: 320, // clears 176px back control + padding
          right: DESIGN_W - 1809 + 24, // clears logo zone (+small padding)
        }}
      >
        <AutoFitText
          text={titleText}
          maxFontPx={80}
          minFontPx={56}
          lineHeightPx={128}
          fontWeight={700}
          className="text-white"
        />
      </div>

      <div className="pointer-events-none absolute left-[1809px] top-[41px] h-[298px] w-[298px]">
        <img
          src={logoPng}
          alt="Sikh History Museum"
          draggable={false}
          className="h-full w-full select-none object-contain"
        />
      </div>

      {/* Prev/Next for main image (keep kiosk behavior) — use provided sprites */} 
      {/** Figma arrow controls are large; match nav sprite scale */} 
      <button
        type="button"
        tabIndex={0}
        aria-label="Previous image"
        onClick={goPrev}
        onKeyDown={handleSideNavKeyDown('prev')}
        className="absolute z-10 flex items-center justify-center rounded-full bg-transparent transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
        style={{ left: 215, top: 773, width: 176, height: 176 }}
      >
        <img src={prevSpritePng} alt="" draggable={false} className="max-h-[160px] max-w-[160px] object-contain" aria-hidden />
      </button>

      <button
        type="button"
        tabIndex={0}
        aria-label="Next image"
        onClick={goNext}
        onKeyDown={handleSideNavKeyDown('next')}
        className="absolute z-10 flex items-center justify-center rounded-full bg-transparent transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
        style={{ left: 1825, top: 773, width: 176, height: 176 }}
      >
        <img src={nextSpritePng} alt="" draggable={false} className="max-h-[160px] max-w-[160px] object-contain" aria-hidden />
      </button>

      <div
        role="button"
        tabIndex={0}
        aria-label="Open details"
        className="absolute overflow-hidden rounded-[32px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
        style={{
          left: pct(0.2735, DESIGN_W),
          // Figma clip group shows top 7.29% (image starts below the 102px title)
          top: pct(0.0729, DESIGN_H),
          width: pct(1 - 0.2735 - 0.2745, DESIGN_W),
          height: pct(1 - 0.0729 - 0.6399, DESIGN_H),
          touchAction: 'pan-y',
        }}
        onClick={() => {
          setGalleryItem(current);
          setScreen('DETAIL');
        }}
        onKeyDown={handleMainKeyDown}
        onPointerDown={handleMainPointerDown}
        onPointerUp={handleMainPointerUp}
        onPointerCancel={() => {
          swipeRef.current.active = false;
        }}
      >
        {mainSrc ? (
          <div key={mainSrc ?? String(index)} className="snap-image-enter h-full w-full">
            <img
              src={mainSrc}
              alt={titleText}
              draggable={false}
              className="h-full w-full object-contain bg-black"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5 text-[32px] text-white/50">
            No image
          </div>
        )}
      </div>

      {current.shortDescription ? (
        <div
          className="absolute"
          style={{
            left: pct(0.0755, DESIGN_W),
            top: pct(0.3969, DESIGN_H),
            width: pct(1 - 0.0755 - 0.0662, DESIGN_W),
          }}
        >
          <p className="text-[72px] font-medium leading-[91px] text-white text-justify">
            {current.shortDescription}
          </p>
        </div>
      ) : null}

      {/* Static divider line — Figma: border 5px @ top 48.12% */} 
      <div
        className="pointer-events-none absolute border-t-[5px] border-white"
        style={{
          left: pct(0.0756, DESIGN_W),
          top: pct(0.4812, DESIGN_H),
          width: pct(1 - 0.0756 - 0.0772, DESIGN_W),
        }}
        aria-hidden
      />

      {current.longDescription ? (
        <div
          className="absolute overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            left: 163,
            top: 1955,
            width: 1854,
            height: 1350,
          }}
        >
          <p className="whitespace-pre-wrap text-[72px] font-medium leading-[90px] text-white text-justify">
            {current.longDescription}
          </p>
        </div>
      ) : null}

      {stripItems.length > 0 ? (
        <GalleryBottomStrip
          items={stripItems}
          selectedIndex={index}
          onSelectIndex={(i) => {
            setSelectedIndex(i);
          }}
        />
      ) : null}
    </DesignFrame>
  );
};

export default GalleryScreen;
