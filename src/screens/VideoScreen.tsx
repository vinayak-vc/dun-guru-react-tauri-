import React from 'react';
import ScreenContainer from '@/components/layout/ScreenContainer';
import useAppStore from '@/store/appStore';

const VideoScreen: React.FC = () => {
  const setScreen = useAppStore((state) => state.setScreen);
  const setSelectedIndex = useAppStore((state) => state.setSelectedIndex);
  const selectedButton = useAppStore((state) => state.selectedButton);

  if (!selectedButton) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <div>
          <label className="text-2xl">No video selected</label>
          <button type="button" onClick={() => setScreen('HOME')}>BACK</button>
        </div>
      </ScreenContainer>
    );
  }

  const src = (selectedButton.trailers && selectedButton.trailers[0]?.url) || null;
  const thumbnails: ThumbnailStripItem[] = selectedButton.galleryItems ? 
    selectedButton.galleryItems.map((item, index) => ({
      id: item._id || String(index),
      title: item.title,
      thumbnailUrl: item.imageUrl
    })) : [];

  return (
    <ScreenContainer className="flex flex-col items-center justify-center">
      <div>
        <SectionTitle title={selectedButton.title || "Video"} />
        <button type="button" onClick={() => setScreen('HOME')}>BACK</button>
      </div>
      <div className="mt-4 w-full">
        <VideoPlayer
          src={src}
          onEnded={() => {
            setSelectedIndex(0);
            setScreen('GALLERY');
          }}
        />
      </div>
      <div className="mt-4 w-full">
        <ThumbnailStrip
          items={thumbnails}
          selectedIndex={null}
          onSelectIndex={(index) => {
            setSelectedIndex(index);
            setScreen('GALLERY');
          }}
        />
      </div>
    </ScreenContainer>
  );
};

export default VideoScreen;
