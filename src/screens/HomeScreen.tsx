import React from 'react';
import ScreenContainer from '@/components/layout/ScreenContainer';
import useAppStore from '@/store/appStore';
import { useAppData } from '@/hooks/useAppData';

const HomeScreen: React.FC = () => {
  const setScreen = useAppStore((state) => state.setScreen);
  const appData = useAppData();

  if (appData.isLoading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <p>Loading application data...</p>
      </ScreenContainer>
    );
  }

  if (appData.isError) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <p className="text-red-600">Error loading data: {String(appData.error)}</p>
      </ScreenContainer>
    );
  }

  const buttons = appData.data?.buttons || [];

  return (
    <ScreenContainer className="flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <label className="text-2xl">HOME</label>
        <p>Welcome back!</p>
        
        <div className="flex flex-wrap gap-4 justify-center">
            {buttons.map((button: any) => (
                <button 
                    key={button._id} 
                    type="button" 
                    onClick={() => {
                        setButton(button);
                        setScreen('VIDEO');
                    }}
                    className="p-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition duration-150"
                >
                    {button.title ?? button._id}
                </button>
            ))}
        </div>
      </div>
    </ScreenContainer>
  );
};

export default HomeScreen;
