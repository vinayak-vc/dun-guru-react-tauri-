import React from 'react';
import ScreenContainer from '@/components/layout/ScreenContainer';
import useAppStore from '@/store/appStore';
import { useAppData } from '@/hooks/useAppData';
import { Button } from '@/models/types';
import { ButtonCard } from '@/components/ui/ButtonCard';
import { Divider } from '@/components/ui/Divider';
import { SectionTitle } from '@/components/ui/SectionTitle';

const HomeScreen: React.FC = () => {
  const setScreen = useAppStore((state) => state.setScreen);
  const setButton = useAppStore((state) => state.setButton);
  const appData = useAppData();

  if (appData.isLoading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <p className="text-white/70">Loading application data...</p>
      </ScreenContainer>
    );
  }

  if (appData.isError) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <div className="max-w-xl w-full bg-white/5 rounded-xl p-6">
          <SectionTitle title="Unable to load content" subtitle="Please check the API connection and try again." />
          <div className="mt-4">
            <Divider />
          </div>
          <pre className="mt-4 text-xs text-white/70 whitespace-pre-wrap break-words">
            {String(appData.error)}
          </pre>
        </div>
      </ScreenContainer>
    );
  }

  const buttons: Button[] = appData.data?.buttons || [];

  return (
    <ScreenContainer className="gap-6">
      <header className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center"
            aria-label="DusGuru logo"
          >
            <span className="text-lg font-semibold tracking-wide">DG</span>
          </div>
          <SectionTitle
            title="DusGuru"
            subtitle="Select an experience to begin"
          />
        </div>
      </header>

      <Divider />

      {buttons.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/70">No content available.</p>
        </div>
      ) : (
        <section className="flex-1 min-h-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-widest text-white/60">
              Experiences
            </h3>
            <p className="text-sm text-white/60">
              {buttons.length} item{buttons.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {buttons.map((button) => {
              const title = button.title ?? button._id;

              return (
                <ButtonCard
                  key={button._id}
                  title={title}
                  subtitle={button.subtitle}
                  description={button.description}
                  thumbnailUrl={button.thumbnailUrl}
                  ariaLabel={`Open ${title}`}
                  onClick={() => {
                    setButton(button);
                    setScreen('VIDEO');
                  }}
                />
              );
            })}
          </div>
        </section>
      )}
    </ScreenContainer>
  );
};

export default HomeScreen;
