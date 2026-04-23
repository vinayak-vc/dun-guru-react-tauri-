import React from 'react';
import ScreenContainer from '@/components/layout/ScreenContainer';
import useAppStore from '@/store/appStore';

const DetailScreen: React.FC = () => {
  const setScreen = useAppStore((state) => state.setScreen);

  return (
    <ScreenContainer className="flex items-center justify-center">
      <div>
        <label className="text-2xl">DETAIL</label>
        <button type="button" onClick={() => setScreen('GALLERY')}>BACK</button>
      </div>
    </ScreenContainer>
  );
};

export default DetailScreen;
