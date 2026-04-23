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

const normalizeSikhApiTrailer = (raw: unknown): Trailer => {
  if (!isRecord(raw)) return { title: null, url: null, thumbnailUrl: null };
  return {
    title: readNullableString(raw.description) ?? readNullableString(raw.title),
    // Postman: trailer.videoUrl
    url: readNullableString(raw.videoUrl) ?? readNullableString(raw.url),
    thumbnailUrl: readNullableString(raw.thumbnail) ?? readNullableString(raw.thumbnailUrl),
  };
};

const normalizeSikhApiGalleryItem = (raw: unknown): GalleryItem => {
  if (!isRecord(raw)) return {};
  return {
    _id: readNullableString(raw._id),
    title: readNullableString(raw.title),
    shortDescription: readNullableString(raw.shortDescription),
    longDescription: readNullableString(raw.longDescription),
    // Postman: gallery.image
    imageUrl: readNullableString(raw.image) ?? readNullableString(raw.imageUrl),
    accession: readNullableString(raw.accession),
    // Postman: gallery.period
    periodOrOrigin: readNullableString(raw.period) ?? readNullableString(raw.periodOrOrigin),
    credit: readNullableString(raw.credit),
    // Postman: gallery.moreDetail
    detailUrl: readNullableString(raw.moreDetail) ?? readNullableString(raw.detailUrl),
  };
};

const normalizeSikhApiButton = (rawButton: unknown): Button => {
  if (!isRecord(rawButton)) {
    return { _id: '', title: null, subtitle: null, description: null, thumbnailUrl: null, trailers: null, galleryItems: null };
  }

  const rawGalleries = rawButton.galleries;
  const rawTrailers = rawButton.trailers;
  const galleries = Array.isArray(rawGalleries) ? rawGalleries.map(normalizeSikhApiGalleryItem) : null;
  const trailers = Array.isArray(rawTrailers) ? rawTrailers.map(normalizeSikhApiTrailer) : null;

  const fallbackThumb =
    galleries?.find((g) => typeof g.imageUrl === 'string' && g.imageUrl.trim().length > 0)?.imageUrl ??
    trailers?.find((t) => typeof t.thumbnailUrl === 'string' && t.thumbnailUrl.trim().length > 0)?.thumbnailUrl ??
    null;

  return {
    _id: typeof rawButton._id === 'string' ? rawButton._id : String(rawButton._id ?? ''),
    // Postman: button.buttonName
    title: readNullableString(rawButton.buttonName) ?? readNullableString(rawButton.title),
    subtitle: null,
    description: null,
    thumbnailUrl: fallbackThumb,
    trailers,
    galleryItems: galleries,
  };
};

const extractItemsArray = (response: unknown): unknown[] => {
  if (!isRecord(response)) return Array.isArray(response) ? response : [];
  const data = response.data;

  // Axios response shape: { data: <payload> }
  if (isRecord(data)) {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.items)) return data.items;
  }

  if (Array.isArray(data)) return data;
  if (Array.isArray(response.items)) return response.items;
  return [];
};

export function getAppData(response: unknown, targetButtonId: string | null): AppData {
  let items: unknown[] = [];

  items = extractItemsArray(response);

  // Sikh kiosk API (Postman): one of the items has { name: 'tenGurus', buttons: [...] }
  const tenGurusItem = items.find((item) => isRecord(item) && Array.isArray(item.buttons));
  const rawButtons = isRecord(tenGurusItem) ? tenGurusItem.buttons : null;

  if (!Array.isArray(rawButtons)) {
    return { buttons: [] };
  }

  const normalizedButtons = rawButtons
    .filter((rawButton) => isRecord(rawButton) && Boolean(rawButton._id))
    .map(normalizeSikhApiButton)
    .filter((button) => Boolean(button._id));

  if (!targetButtonId) {
    return { buttons: normalizedButtons };
  }

  const filteredButtons = normalizedButtons.filter((b) => b._id === targetButtonId);

  return { buttons: filteredButtons.length > 0 ? filteredButtons : normalizedButtons };
}
