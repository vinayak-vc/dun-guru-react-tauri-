import React from 'react';
import ScreenContainer from '@/components/layout/ScreenContainer';
import useAppStore from '@/store/appStore';

const HomeScreen: React.FC = () => {
  const setScreen = useAppStore((state) => state.setScreen);

  return (
    <ScreenContainer className="flex items-center justify-center">
      <div>
        <label className="text-2xl">HOME</label>
        <p>Scaffold loaded</p>
        <button type="button" onClick={() => setScreen('VIDEO')}>Go VIDEO (temporary)</button>
      </div>
    </ScreenContainer>
  );
};

export default HomeScreen;
