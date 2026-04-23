import { AppData, Button, GalleryItem, Trailer } from '@/models/types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const readNullableString = (value: unknown): string | null => {
  if (typeof value === 'string') return value;
  return null;
};

const normalizeTrailer = (raw: unknown): Trailer => {
  if (!isRecord(raw)) return { title: null, url: null, thumbnailUrl: null };
  return {
    title: readNullableString(raw.title),
    url: readNullableString(raw.url),
    thumbnailUrl: readNullableString(raw.thumbnailUrl),
  };
};

const normalizeGalleryItem = (raw: unknown): GalleryItem => {
  if (!isRecord(raw)) return {};
  return {
    _id: readNullableString(raw._id),
    title: readNullableString(raw.title),
    shortDescription: readNullableString(raw.shortDescription),
    longDescription: readNullableString(raw.longDescription),
    imageUrl: readNullableString(raw.imageUrl),
    accession: readNullableString(raw.accession),
    periodOrOrigin: readNullableString(raw.periodOrOrigin),
    credit: readNullableString(raw.credit),
    detailUrl: readNullableString(raw.detailUrl),
  };
};

const normalizeButton = (rawButton: unknown): Button => {
  if (!isRecord(rawButton)) {
    return {
      _id: '',
      title: null,
      subtitle: null,
      description: null,
      thumbnailUrl: null,
      trailers: null,
      galleryItems: null,
    };
  }

  const rawTrailers = rawButton.trailers;
  const rawGalleryItems = rawButton.galleryItems;

  return {
    _id: typeof rawButton._id === 'string' ? rawButton._id : String(rawButton._id ?? ''),
    title: readNullableString(rawButton.title),
    subtitle: readNullableString(rawButton.subtitle),
    description: readNullableString(rawButton.description),
    thumbnailUrl: readNullableString(rawButton.thumbnailUrl),
    trailers: Array.isArray(rawTrailers) ? rawTrailers.map(normalizeTrailer) : null,
    galleryItems: Array.isArray(rawGalleryItems)
      ? rawGalleryItems.map(normalizeGalleryItem)
      : null,
  };
};

export function getAppData(response: unknown, targetButtonId: string): AppData {
  let items: unknown[] = [];

  if (isRecord(response)) {
    const data = response.data;
    if (isRecord(data) && Array.isArray(data.data)) {
      items = data.data;
    } else if (Array.isArray(data)) {
      items = data;
    } else if (Array.isArray(response.items)) {
      items = response.items;
    }
  } else if (Array.isArray(response)) {
    items = response;
  }

  const targetItem = items.find((item) => {
    if (!isRecord(item) || !Array.isArray(item.buttons)) return false;
    const firstButton = item.buttons[0];
    if (!isRecord(firstButton)) return false;
    return firstButton._id === targetButtonId;
  });

  if (!isRecord(targetItem) || !Array.isArray(targetItem.buttons)) {
    return { buttons: [] };
  }

  const normalizedButtons = targetItem.buttons
    .filter((rawButton) => isRecord(rawButton) && Boolean(rawButton._id))
    .map(normalizeButton)
    .filter((button) => Boolean(button._id));

  return { buttons: normalizedButtons };
}
