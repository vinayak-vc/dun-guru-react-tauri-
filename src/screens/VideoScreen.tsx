import React from 'react';
import ScreenContainer from '@/components/layout/ScreenContainer';
import useAppStore from '@/store/appStore';
import { Button } from "@/models/types";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { ThumbnailStrip, type ThumbnailStripItem } from "@/components/video/ThumbnailStrip";

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

const VideoScreen: React.FC = () => {
  const setScreen = useAppStore((state) => state.setScreen);
  const setSelectedIndex = useAppStore((state) => state.setSelectedIndex);
  const selectedButton = useAppStore((state) => state.selectedButton);

  if (!isRecord(selectedButton)) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <div>
          <label className="text-2xl">No video selected</label>
          <button type="button" onClick={() => setScreen('HOME')}>BACK</button>
        </div>
      </ScreenContainer>
    );
  }

  const button = selectedButton as unknown as Button;
  const videoSrc = button.trailers?.[0]?.url ?? null;
  const galleryItems = button.galleryItems ?? [];
  const thumbnails: ThumbnailStripItem[] = galleryItems.map((item, index) => ({
    id: item._id ?? String(index),
    title: item.title ?? null,
    thumbnailUrl: item.imageUrl ?? null,
  }));
  const selectedIndex = useAppStore((s) => s.selectedIndex);

  return (
    <ScreenContainer className="flex flex-col items-center justify-center">
      <div>
        <SectionTitle title={button.title || "Video"} />
        <button type="button" onClick={() => setScreen('HOME')}>BACK</button>
      </div>
      <div className="mt-4 w-full">
        <VideoPlayer
          src={videoSrc}
          onEnded={() => {
            setSelectedIndex(0);
            setScreen('GALLERY');
          }}
        />
      </div>
      <div className="mt-4 w-full">
        <ThumbnailStrip
          items={thumbnails}
          selectedIndex={selectedIndex}
          onSelectIndex={(index: number) => {
            setSelectedIndex(index);
            setScreen('GALLERY');
          }}
        />
      </div>
    </ScreenContainer>
  );
};

export default VideoScreen;
