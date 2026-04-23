import React from 'react';
import ScreenContainer from '@/components/layout/ScreenContainer';
import useAppStore from '@/store/appStore';
import { GalleryItem } from '@/models/types';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Divider } from '@/components/ui/Divider';
import { ImageView } from '@/components/ui/ImageView';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const DetailScreen: React.FC = () => {
  const setScreen = useAppStore((state) => state.setScreen);
  const selectedGalleryItem = useAppStore((state) => state.selectedGalleryItem);

  if (!isRecord(selectedGalleryItem)) {
    return (
      <ScreenContainer className="flex flex-col items-center justify-center gap-6">
        <SectionTitle title="Details" subtitle="No item selected" />
        <button
          type="button"
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          onClick={() => setScreen('GALLERY')}
        >
          BACK
        </button>
      </ScreenContainer>
    );
  }

  const item = selectedGalleryItem as unknown as GalleryItem;

  const metaRows: Array<{ label: string; value: string }> = [
    { label: 'Accession', value: item.accession ?? '' },
    { label: 'Period / Origin', value: item.periodOrOrigin ?? '' },
    { label: 'Credit', value: item.credit ?? '' },
    { label: 'More details', value: item.detailUrl ?? '' },
  ].filter((row) => row.value.trim().length > 0);

  return (
    <ScreenContainer className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <SectionTitle title={item.title ?? 'Details'} subtitle={item.accession ?? null} />
        <button
          type="button"
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          onClick={() => setScreen('GALLERY')}
        >
          BACK
        </button>
      </div>

      <ImageView
        src={item.imageUrl}
        alt={item.title ?? 'Detail image'}
        className="w-full h-[380px] rounded-xl"
      />

      {item.shortDescription ? (
        <p className="text-white/70">{item.shortDescription}</p>
      ) : null}

      <Divider />

      {item.longDescription ? (
        <div className="text-white/80 whitespace-pre-wrap">{item.longDescription}</div>
      ) : null}

      {metaRows.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
          {metaRows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 min-w-0">
              <div className="text-sm text-white/60">{row.label}</div>
              <div className="text-white/90 break-words">{row.value}</div>
            </div>
          ))}
        </div>
      ) : null}
    </ScreenContainer>
  );
};

export default DetailScreen;
