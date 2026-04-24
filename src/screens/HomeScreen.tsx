import React from 'react';
import useAppStore from '@/store/appStore';
import { useAppData } from '@/hooks/useAppData';
import { DesignFrame } from '@/components/layout/DesignFrame';
import { ExperienceItem } from '@/models/types';
import { HomeNavIconButton } from '@/components/home/HomeNavIconButton';
import logoPng from '@/assets/images/logo.png';
import { DESIGN_H, DESIGN_W, pct } from '@/utils/designSpec';

/**
 * Layout reference: `UI/HOME/Home Screen.svg` (2160×3840). Do not render that SVG as the live background.
 * Numeric slots also align with Figma/CSS export: carousel clips at 7.19% inset, tops 46.25% / 61.54%;
 * headline band ~20.05% top; description ~29.22% top; hint "Click on the thumbnail…" 48px/58px @ 84.82% top, 1049px wide.
 */

/** Carousel rows: height = 100% − top% − bottom% on design canvas. */
const CARD_SLOTS: Array<{ top: number; height: number; titleAlign: 'left' | 'right' }> = [
  { top: pct(0.4625, DESIGN_H), height: pct(1 - 0.4625 - 0.4114, DESIGN_H), titleAlign: 'right' },
  { top: pct(0.6154, DESIGN_H), height: pct(1 - 0.6154 - 0.2584, DESIGN_H), titleAlign: 'left' },
];

type HomeHeroCardProps = {
  item: ExperienceItem;
  topPx: number;
  heightPx: number;
  titleAlign: 'left' | 'right';
  onActivate: () => void;
};

const HomeHeroCard: React.FC<HomeHeroCardProps> = ({ item, topPx, heightPx, titleAlign, onActivate }) => {
  const title = item.title ?? item.id;
  const cardImage = item.imageUrl ?? item.thumbnailUrl;

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onActivate();
  };

  const justifyClass = titleAlign === 'right' ? 'justify-end text-right' : 'justify-start text-left';

  return (
    <button
      type="button"
      tabIndex={0}
      aria-label={`Open ${title}`}
      onClick={onActivate}
      onKeyDown={handleKeyDown}
      className="absolute overflow-hidden rounded-[60px] border-[3px] border-white bg-[#0a0a0a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
      style={{
        left: pct(0.0719, DESIGN_W),
        width: pct(1 - 0.0719 - 0.0719, DESIGN_W),
        top: topPx,
        height: heightPx,
      }}
    >
      {cardImage ? (
        <img
          src={cardImage}
          alt=""
          aria-hidden
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        />
      ) : null}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" aria-hidden />
      <span className={`relative z-10 flex h-full w-full items-end px-[72px] pb-[56px] ${justifyClass}`}>
        <span className="max-w-[1400px] font-bold uppercase leading-none tracking-wide text-white text-[56px]">
          {title}
        </span>
      </span>
    </button>
  );
};

const HomeScreen: React.FC = () => {
  const setScreen = useAppStore((state) => state.setScreen);
  const setButton = useAppStore((state) => state.setButton);
  const reset = useAppStore((state) => state.reset);
  const appData = useAppData();

  const handleHomeClick = () => {
    reset();
    setScreen('HOME');
  };

  if (appData.isLoading) {
    return (
      <DesignFrame designWidth={2160} designHeight={3840}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[44px] text-white/80">Loading…</p>
        </div>
      </DesignFrame>
    );
  }

  if (appData.isError) {
    return (
      <DesignFrame designWidth={2160} designHeight={3840}>
        <div className="absolute inset-0 flex items-center justify-center px-[120px]">
          <div className="w-full max-w-[1600px] rounded-[28px] border border-white/15 bg-[#111] px-[48px] py-[40px]">
            <div className="text-[48px] font-semibold text-white">Unable to load content</div>
            <div className="mt-[16px] text-[28px] text-white/75">
              Please check the API connection and try again.
            </div>
            <div className="mt-[28px] h-px w-full bg-white/15" />
            <pre className="mt-[28px] max-h-[520px] overflow-auto text-[22px] text-white/70 whitespace-pre-wrap break-words">
              {String(appData.error)}
            </pre>
          </div>
        </div>
      </DesignFrame>
    );
  }

  const title = appData.data?.name ?? '';
  const description = appData.data?.description ?? '';
  const items = appData.data?.items ?? [];

  const handleOpenItem = (item: ExperienceItem) => {
    setButton(item);
    setScreen('VIDEO');
  };

  return (
    <DesignFrame designWidth={2160} designHeight={3840}>
      <HomeNavIconButton leftPx={155} topPx={155} sizePx={176} onClick={handleHomeClick} />
      {/* Bottom back: Figma group ~3.15% / 90.13% — button centered in slot → left ≈119px */}
      <HomeNavIconButton leftPx={119} topPx={pct(0.9013, DESIGN_H)} sizePx={176} onClick={handleHomeClick} />

      <div className="pointer-events-none absolute left-[808px] top-[59px] h-[578px] w-[578px]">
        <img
          src={logoPng}
          alt="Sikh History Museum"
          className="h-full w-full select-none object-contain"
          draggable={false}
        />
      </div>

      {/* Title: ~23.72% / 23.73% horizontal margins → ~1135px band; top ~20.05% */}
      <div
        className="pointer-events-none absolute left-1/2 text-center -translate-x-1/2"
        style={{ top: pct(0.2005, DESIGN_H), width: pct(1 - 0.2372 - 0.2373, DESIGN_W) }}
      >
        {title ? (
          <h1 className="text-balance font-bold uppercase tracking-[0.06em] text-[72px] leading-[86px] text-white">
            {title}
          </h1>
        ) : null}
      </div>
      {/* Description: ~16.44% / 17.75% margins; top ~29.22% */}
      {description ? (
        <div
          className="pointer-events-none absolute text-center -translate-x-1/2 left-1/2"
          style={{
            top: pct(0.2922, DESIGN_H),
            width: pct(1 - 0.1644 - 0.1775, DESIGN_W),
          }}
        >
          <p className="mx-auto text-[32px] font-light leading-[44px] text-white/88">{description}</p>
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[40px] text-white/75">No content available.</p>
        </div>
      ) : (
        <>
          {CARD_SLOTS.map((slot, index) => {
            const item = items[index];
            if (!item) return null;
            return (
              <HomeHeroCard
                key={`${item.id}-${index}`}
                item={item}
                topPx={slot.top}
                heightPx={slot.height}
                titleAlign={slot.titleAlign}
                onActivate={() => handleOpenItem(item)}
              />
            );
          })}
        </>
      )}

      {/* Figma: Inter 48/58, width 1049px, vertical ~84.82% — using design tokens; font follows app (Geometria). */}
      <p
        className="pointer-events-none absolute left-1/2 top-[84.82%] w-[1049px] -translate-x-1/2 text-center text-[48px] font-normal leading-[58px] text-white"
      >
        Click on the thumbnail to explore the artwork.
      </p>
    </DesignFrame>
  );
};

export default HomeScreen;
