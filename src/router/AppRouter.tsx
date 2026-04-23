import React from 'react';
import useAppStore from '@/store/appStore';
import HomeScreen from '@/screens/HomeScreen';
import VideoScreen from '@/screens/VideoScreen';
import GalleryScreen from '@/screens/GalleryScreen';
import DetailScreen from '@/screens/DetailScreen';
import FadeTransition from '@/components/transition/FadeTransition';

const AppRouter: React.FC = () => {
  const currentScreen = useAppStore((state) => state.currentScreen);

  switch (currentScreen) {
    case 'HOME':
      return (
        <FadeTransition screenKey={currentScreen}>
          <HomeScreen />
        </FadeTransition>
      );
    case 'VIDEO':
      return (
        <FadeTransition screenKey={currentScreen}>
          <VideoScreen />
        </FadeTransition>
      );
    case 'GALLERY':
      return (
        <FadeTransition screenKey={currentScreen}>
          <GalleryScreen />
        </FadeTransition>
      );
    case 'DETAIL':
      return (
        <FadeTransition screenKey={currentScreen}>
          <DetailScreen />
        </FadeTransition>
      );
    default:
      return (
        <FadeTransition screenKey="HOME">
          <HomeScreen />
        </FadeTransition>
      );
  }
};

export default AppRouter;
