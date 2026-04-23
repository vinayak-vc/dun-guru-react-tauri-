import React from 'react';
import ScreenContainer from '@/components/layout/ScreenContainer';
import useAppStore from '@/store/appStore';
import ImageView from '@/components/ui/ImageView';
import Divider from '@/components/ui/Divider';
import SectionTitle from '@/components/ui/SectionTitle';

const GalleryScreen: React.FC = () => {
  const setScreen = useAppStore((state) => state.setScreen);
  const setGalleryItem = useAppStore((state) => state.setGalleryItem);
  const selectedButton = useAppStore((state) => state.selectedButton);
  const selectedIndex = useAppStore((state) => state.selectedIndex);

  if (!selectedButton || typeof selectedButton !== 'object') {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <SectionTitle title="Gallery" />
        <button type="button" onClick={() => setScreen('VIDEO')}>
          BACK
        </button>
      </ScreenContainer>
    );
  }

  const button = selectedButton as unknown as Button;
  const galleryItems = button.galleryItems ?? [];
  const index = selectedIndex ?? 0;
  const current = galleryItems[index] ?? null;

  if (!current) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <SectionTitle title="Gallery" />
        <p>No item available</p>
        <button type="button" onClick={() => setScreen('VIDEO')}>
          BACK
        </button>
      </ScreenContainer>
    );
  }

  const handleImageClick = () => {
    setGalleryItem(current);
    setScreen('DETAIL');
  };

  return (
    <ScreenContainer className="flex flex-col items-center justify-center">
      <SectionTitle title={current.title || 'Gallery'} />
      <button type="button" onClick={() => setScreen('VIDEO')}>
        BACK
      </button>
      <div tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleImageClick()} role="button" onClick={handleImageClick}>
        <ImageView src={current.imageUrl} alt={current.title || 'Gallery image'} />
      </div>
      {current.shortDescription && (
        <p className="text-white/70">{current.shortDescription}</p>
      )}
      <Divider />
      {current.longDescription && (
        <pre className="text-white/80 whitespace-pre-wrap">{current.longDescription}</pre>
      )}
    </ScreenContainer>
  );
};

export default GalleryScreen;
