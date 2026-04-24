import React from 'react';
import useAppStore from '@/store/appStore';
import { useAppData } from '@/hooks/useAppData';
import { DesignFrame } from '@/components/layout/DesignFrame';
import { ExperienceItem } from '@/models/types';
import { BackNavIconButton } from '@/components/home/BackNavIconButton';
import { KioskVideoPlayer } from '@/components/video/KioskVideoPlayer';
import { KioskThumbnailCarousel } from '@/components/video/KioskThumbnailCarousel';
import logoPng from '@/assets/images/logo.png';
import backButtonPng from '@/assets/images/Common/BackButton.png';
import closeIconPng from '@/assets/images/Common/CloseIcon.png';
import { DESIGN_H, DESIGN_W, pct } from '@/utils/designSpec';

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

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

/**
 * Screen 2 — video + gallery intro. Layout from Figma `SHM Ui - Screen 5` / `UI/Video/SHM Ui - Screen 5.svg` (2160×3840).
 * Raster nav: `Common/BackButton.png`, `Common/CloseIcon.png`; carousel chevrons: Previous/Next sprite PNGs.
 */
const VideoScreen: React.FC = () => {
  const setScreen = useAppStore((state) => state.setScreen);
  const setSelectedIndex = useAppStore((state) => state.setSelectedIndex);
  const reset = useAppStore((state) => state.reset);
  const selectedButton = useAppStore((state) => state.selectedButton);
  const selectedIndex = useAppStore((state) => state.selectedIndex);
  const appQuery = useAppData();

  const handleBack = () => {
    reset();
    setScreen('HOME');
  };

  const handleCloseKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handleBack();
  };

  if (!isRecord(selectedButton)) {
    return (
      <DesignFrame designWidth={DESIGN_W} designHeight={DESIGN_H}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
          <p className="text-[40px] text-white/80">No video selected</p>
          <button
            type="button"
            tabIndex={0}
            className="rounded-xl border border-white/20 bg-white/10 px-10 py-4 text-[28px] text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            onClick={handleBack}
          >
            Back to home
          </button>
        </div>
      </DesignFrame>
    );
  }

  if (appQuery.isLoading) {
    return (
      <DesignFrame designWidth={DESIGN_W} designHeight={DESIGN_H}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[44px] text-white/80">Loading…</p>
        </div>
      </DesignFrame>
    );
  }

  if (appQuery.isError) {
    return (
      <DesignFrame designWidth={DESIGN_W} designHeight={DESIGN_H}>
        <div className="absolute inset-0 flex items-center justify-center px-[120px]">
          <p className="text-center text-[32px] text-white/75">{String(appQuery.error)}</p>
        </div>
      </DesignFrame>
    );
  }

  const item = selectedButton as unknown as ExperienceItem;
  const appName = appQuery.data?.name ?? '';
  const trailer0 = item.trailers?.[0];
  const videoSrc = trailer0?.url ?? item.videoUrl ?? null;
  const videoPoster = trailer0?.thumbnailUrl ?? item.thumbnailUrl ?? null;
  const trailerDescription = trailer0?.description ?? trailer0?.title ?? null;

  const galleryItems = item.galleryItems ?? [];
  const thumbs = galleryItems.map((g, index) => ({
    id: g._id ?? String(index),
    title: g.title,
    thumbnailUrl: g.imageUrl,
  }));

  const bannerSrc = item.imageUrl ?? item.thumbnailUrl ?? videoPoster;

  const stripSelected = selectedIndex ?? 0;

  const videoLeft = pct(0.0699, DESIGN_W);
  const videoWidth = pct(1 - 0.0699 - 0.0739, DESIGN_W);
  const videoTop = pct(0.4643, DESIGN_H);
  const videoHeight = pct(1 - 0.4643 - 0.2733, DESIGN_H);

  const navSize = 176;
  const topBackLeft = navButtonLeftPx(0.0481, 0.8705, navSize);
  const topBackTop = navButtonTopPx(0.0271, 0.9271, navSize);
  const bottomBackLeft = navButtonLeftPx(0.0556, 0.863, navSize);
  const bottomBackTop = navButtonTopPx(0.9115, 0.0428, navSize);

  return (
    <DesignFrame designWidth={DESIGN_W} designHeight={DESIGN_H}>
      <BackNavIconButton
        leftPx={topBackLeft}
        topPx={topBackTop}
        ariaLabel="Back to home"
        onClick={handleBack}
        iconSrc={backButtonPng}
        sizePx={navSize}
      />
      <BackNavIconButton
        leftPx={bottomBackLeft}
        topPx={bottomBackTop}
        ariaLabel="Back to home"
        onClick={handleBack}
        iconSrc={backButtonPng}
        sizePx={navSize}
      />

      <button
        type="button"
        tabIndex={0}
        aria-label="Close and return home"
        onClick={handleBack}
        onKeyDown={handleCloseKeyDown}
        className="absolute left-[1932px] top-[155px] z-20 flex items-center justify-center bg-transparent transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
        style={{ width: navSize, height: navSize }}
      >
        <img src={closeIconPng} alt="" draggable={false} className="h-full w-full object-contain" aria-hidden />
      </button>

      <div className="pointer-events-none absolute left-[808px] top-[59px] h-[578px] w-[578px]">
        <img
          src={logoPng}
          alt="Sikh History Museum"
          draggable={false}
          className="h-full w-full select-none object-contain"
        />
      </div>

      {/* Museum name — Figma ~19.43% / 77.58% band, ~52.55% width */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center"
        style={{ top: pct(0.1943, DESIGN_H), width: pct(1 - 0.2372 - 0.2373, DESIGN_W) }}
      >
        {appName ? (
          <h1 className="text-balance font-bold uppercase tracking-[0.06em] text-[72px] leading-[86px] text-white">
            {appName}
          </h1>
        ) : null}
      </div>

      {/* “GALLERIES” — Figma ~23.62% / 72.51% */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center"
        style={{ top: pct(0.2362, DESIGN_H), width: pct(1 - 0.2376 - 0.2423, DESIGN_W) }}
      >
        <p className="font-bold uppercase tracking-[0.22em] text-white text-[56px] leading-[68px]">GALLERIES</p>
      </div>

      {bannerSrc ? (
        <div
          className="pointer-events-none absolute overflow-hidden rounded-[60px] border-[3px] border-white"
          style={{ left: 155, top: 1176, width: 1850, height: 487 }}
        >
          <img
            src={bannerSrc}
            alt=""
            aria-hidden
            draggable={false}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" aria-hidden />
        </div>
      ) : null}

      <div
        className="absolute overflow-hidden rounded-[48px] border-[3px] border-white bg-black"
        style={{
          left: videoLeft,
          top: videoTop,
          width: videoWidth,
          height: videoHeight,
        }}
      >
        <KioskVideoPlayer
          src={videoSrc}
          poster={videoPoster}
          className="h-full w-full"
          onEnded={() => {
            setSelectedIndex(0);
            setScreen('GALLERY');
          }}
        />
      </div>

      {trailerDescription ? (
        <div
          className="absolute rounded-[28px] border-[3px] border-white/60 bg-black/20 px-[56px] py-[44px]"
          style={{
            left: Math.round(DESIGN_W / 2 - 1568 / 2 - 4.3),
            top: pct(0.7415, DESIGN_H),
            width: 1568,
          }}
        >
          <p className="max-h-[380px] overflow-y-auto whitespace-pre-wrap text-[56px] font-medium leading-[72px] text-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {trailerDescription}
          </p>
        </div>
      ) : null}

      {thumbs.length > 0 ? (
        <KioskThumbnailCarousel
          items={thumbs}
          selectedIndex={stripSelected}
          onSelectIndex={(index) => {
            setSelectedIndex(index);
            setScreen('GALLERY');
          }}
        />
      ) : null}
    </DesignFrame>
  );
};

export default VideoScreen;
