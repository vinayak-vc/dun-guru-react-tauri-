import React from 'react';
import ScreenContainer from '@/components/layout/ScreenContainer';
import useAppStore from '@/store/appStore';
import { Button, GalleryItem } from '@/models/types';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Divider } from '@/components/ui/Divider';
import { ImageView } from '@/components/ui/ImageView';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const GalleryScreen: React.FC = () => {
  const setScreen = useAppStore((state) => state.setScreen);
  const setGalleryItem = useAppStore((state) => state.setGalleryItem);
  const selectedButton = useAppStore((state) => state.selectedButton);
  const selectedIndex = useAppStore((state) => state.selectedIndex);

  if (!isRecord(selectedButton)) {
    return (
      <ScreenContainer className="flex flex-col items-center justify-center gap-6">
        <SectionTitle title="Gallery" subtitle="No selection" />
        <button
          type="button"
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          onClick={() => setScreen('VIDEO')}
        >
          BACK
        </button>
      </ScreenContainer>
    );
  }

  const button = selectedButton as unknown as Button;
  const galleryItems = button.galleryItems ?? [];
  const index = selectedIndex ?? 0;
  const current: GalleryItem | null = galleryItems[index] ?? null;

  if (!current) {
    return (
      <ScreenContainer className="flex flex-col items-center justify-center gap-6">
        <SectionTitle title="Gallery" subtitle="No item available" />
        <button
          type="button"
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          onClick={() => setScreen('VIDEO')}
        >
          BACK
        </button>
      </ScreenContainer>
    );
  }

  const handleOpenDetails = () => {
    setGalleryItem(current);
    setScreen('DETAIL');
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handleOpenDetails();
  };

  return (
    <ScreenContainer className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <SectionTitle title={current.title ?? 'Gallery'} subtitle={button.title ?? null} />
        <button
          type="button"
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          onClick={() => setScreen('VIDEO')}
        >
          BACK
        </button>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="Open details"
        className="w-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        onClick={handleOpenDetails}
        onKeyDown={handleKeyDown}
      >
        <ImageView
          src={current.imageUrl}
          alt={current.title ?? 'Gallery image'}
          className="w-full h-[420px] rounded-xl"
        />
      </div>

      {current.shortDescription ? (
        <p className="text-white/70">{current.shortDescription}</p>
      ) : null}

      <Divider />

      {current.longDescription ? (
        <div className="text-white/80 whitespace-pre-wrap">{current.longDescription}</div>
      ) : null}
    </ScreenContainer>
  );
};

export default GalleryScreen;
