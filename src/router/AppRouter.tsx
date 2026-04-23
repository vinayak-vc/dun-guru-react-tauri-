import React from 'react';
import { useAppStore } from '@/store/appStore';
import HomeScreen from '@/screens/HomeScreen';
import VideoScreen from '@/screens/VideoScreen';
import GalleryScreen from '@/screens/GalleryScreen';
import DetailScreen from '@/screens/DetailScreen';

const AppRouter: React.FC = () => {
  const currentScreen = useAppStore((state) => state.currentScreen);

  switch (currentScreen) {
    case 'HOME':
      return <HomeScreen />;
    case 'VIDEO':
      return <VideoScreen />;
    case 'GALLERY':
      return <GalleryScreen />;
    case 'DETAIL':
      return <DetailScreen />;
    default:
      return <HomeScreen />;
  }
};

export default AppRouter;
