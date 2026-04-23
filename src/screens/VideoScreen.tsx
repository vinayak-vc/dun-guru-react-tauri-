import React from 'react';
import ScreenContainer from '@/components/layout/ScreenContainer';
import useAppStore from '@/store/appStore';

const VideoScreen: React.FC = () => {
  const setScreen = useAppStore((state) => state.setScreen);

  return (
    <ScreenContainer className="flex items-center justify-center">
      <div>
        <label className="text-2xl">VIDEO</label>
        <button type="button" onClick={() => setScreen('HOME')}>BACK</button>
        <button type="button" onClick={() => setScreen('GALLERY')}>NEXT</button>
      </div>
    </ScreenContainer>
  );
};

export default VideoScreen;
