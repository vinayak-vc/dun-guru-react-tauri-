import React from 'react';
import ScreenContainer from '@/components/layout/ScreenContainer';
import useAppStore from '@/store/appStore';

const GalleryScreen: React.FC = () => {
  const setScreen = useAppStore((state) => state.setScreen);

  return (
    <ScreenContainer className="flex items-center justify-center">
      <div>
        <label className="text-2xl">GALLERY</label>
        <button type="button" onClick={() => setScreen('VIDEO')}>BACK</button>
        <button type="button" onClick={() => setScreen('DETAIL')}>NEXT</button>
      </div>
    </ScreenContainer>
  );
};

export default GalleryScreen;
