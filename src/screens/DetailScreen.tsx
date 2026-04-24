import React from 'react';
import useAppStore from '@/store/appStore';
import { DesignFrame } from '@/components/layout/DesignFrame';
import { GalleryItem } from '@/models/types';
import { BackNavIconButton } from '@/components/home/BackNavIconButton';
import logoPng from '@/assets/images/logo.png';
import backButtonPng from '@/assets/images/Common/BackButton.png';
import { DESIGN_H, DESIGN_W, pct } from '@/utils/designSpec';
import { ZoomPanImage } from '@/components/ui/ZoomPanImage';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const resolveDetailHref = (raw: string): string | null => {
  const t = raw.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  if (/^www\./i.test(t)) return `https://${t}`;
  if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(t)) return `https://${t}`;
  return null;
};

/**
 * Screen 4 — detail / metadata. Layout reference: `UI/Detail/SHM Ui - Screen 3 - painting 1.svg` (2160×3840).
 * Same pattern as Gallery: `DesignFrame` + absolute slots, no SVG as live background.
 * Fields: `accession`, `periodOrOrigin`, `credit`, `detailUrl` (API `moreDetail` normalized in `normalization.ts`).
 */
const DetailScreen: React.FC = () => {
  const setScreen = useAppStore((state) => state.setScreen);
  const selectedGalleryItem = useAppStore((state) => state.selectedGalleryItem);

  const handleBackToGallery = () => {
    setScreen('GALLERY');
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

  if (!isRecord(selectedGalleryItem)) {
    return (
      <DesignFrame designWidth={DESIGN_W} designHeight={DESIGN_H}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
          <p className="text-[40px] text-white/80">No item selected</p>
          <button
            type="button"
            tabIndex={0}
            className="rounded-xl border border-white/20 bg-white/10 px-10 py-4 text-[28px] text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            onClick={handleBackToGallery}
          >
            Back
          </button>
        </div>
      </DesignFrame>
    );
  }

  const item = selectedGalleryItem as unknown as GalleryItem;
  const title = item.title ?? 'Details';
  const accession = (item.accession ?? '').trim() || '—';
  const period = (item.periodOrOrigin ?? '').trim() || '—';
  const credit = (item.credit ?? '').trim() || '—';
  const moreRaw = (item.detailUrl ?? '').trim() || '—';
  const moreHref = moreRaw !== '—' ? resolveDetailHref(moreRaw) : null;

  return (
    <DesignFrame designWidth={DESIGN_W} designHeight={DESIGN_H}>
      <h1 className="sr-only">{title}</h1>

      {/* Back buttons — use provided raster `Common/BackButton.png` */} 
      {/** Figma nav group ~176×176 */} 
      {(() => {
        const navSize = 176;
        return (
          <>
      <BackNavIconButton
        leftPx={navButtonLeftPx(0.0556, 0.8631, navSize)}
        topPx={navButtonTopPx(0.0266, 0.9277, navSize)}
        ariaLabel="Back to gallery"
        onClick={handleBackToGallery}
        iconSrc={backButtonPng}
        sizePx={navSize}
      />
      <BackNavIconButton
        leftPx={navButtonLeftPx(0.0556, 0.863, navSize)}
        topPx={navButtonTopPx(0.9115, 0.0428, navSize)}
        ariaLabel="Back to gallery"
        onClick={handleBackToGallery}
        iconSrc={backButtonPng}
        sizePx={navSize}
      />
          </>
        );
      })()}

      <div className="pointer-events-none absolute left-[1809px] top-[41px] h-[298px] w-[298px]">
        <img
          src={logoPng}
          alt="Sikh History Museum"
          draggable={false}
          className="h-full w-full select-none object-contain"
        />
      </div>

      {/* Main image — Figma: left 4.59% right 4.66% top 10.34% bottom 22.82% (2566.9px height) */} 
      <div
        className="absolute overflow-hidden rounded-[24px] bg-black"
        style={{
          left: pct(0.0459, DESIGN_W),
          top: pct(0.1034, DESIGN_H),
          width: pct(1 - 0.0459 - 0.0466, DESIGN_W),
          height: pct(1 - 0.1034 - 0.2282, DESIGN_H),
        }}
      >
        {item.imageUrl ? (
          <ZoomPanImage src={item.imageUrl} alt={title} />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5 text-[36px] text-white/50">
            No image
          </div>
        )}
      </div>

      {/* Metadata — render as full-width rows (no overlap on wrap) */} 
      <div
        className="absolute text-white"
        style={{
          left: pct(0.0741, DESIGN_W),
          top: pct(0.7909, DESIGN_H),
          width: pct(1 - 0.0741 - 0.0741, DESIGN_W),
        }}
      >
        <div className="flex w-full flex-col gap-[18px]">
          <p className="min-w-0 break-words text-[64px] font-medium leading-[81px]">{accession}</p>
          <p className="min-w-0 break-words text-[64px] font-medium leading-[81px]">{period}</p>
          <p className="min-w-0 break-words text-[64px] font-medium leading-[81px]">{credit}</p>
          <div className="min-w-0 break-words text-[64px] font-medium leading-[81px]">
            {moreHref ? (
              <a
                href={moreHref}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={0}
                aria-label="Open more details link"
                className="underline decoration-white/35 underline-offset-8 transition hover:text-white/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
              >
                {moreRaw}
              </a>
            ) : (
              <span>{moreRaw}</span>
            )}
          </div>
        </div>
      </div>
    </DesignFrame>
  );
};

export default DetailScreen;
