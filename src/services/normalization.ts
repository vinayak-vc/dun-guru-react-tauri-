import { AppData, ExperienceItem, GalleryItem, Trailer } from '@/models/types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const readNullableString = (value: unknown): string | null => {
  if (typeof value === 'string') return value;
  return null;
};

const normalizeSikhApiTrailer = (raw: unknown): Trailer => {
  if (!isRecord(raw)) return { title: null, description: null, url: null, thumbnailUrl: null };
  const description = readNullableString(raw.description);
  return {
    title: description ?? readNullableString(raw.title),
    description,
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

const normalizeSikhApiButtonToItem = (rawButton: unknown): ExperienceItem | null => {
  if (!isRecord(rawButton)) {
    return null;
  }

  const rb = rawButton as Record<string, unknown>;
  const rawGalleries = Array.isArray(rb.galleries)
    ? rb.galleries
    : Array.isArray(rb.gallaries)
      ? rb.gallaries
      : [];
  const rawTrailers = rawButton.trailers;
  const galleries = rawGalleries.map(normalizeSikhApiGalleryItem);
  const trailers = Array.isArray(rawTrailers) ? rawTrailers.map(normalizeSikhApiTrailer) : [];

  const buttonImageUrl = readNullableString(rawButton.imageUrl);
  const fallbackThumb =
    buttonImageUrl ??
    galleries.find((g) => typeof g.imageUrl === 'string' && g.imageUrl.trim().length > 0)?.imageUrl ??
    trailers.find((t) => typeof t.thumbnailUrl === 'string' && t.thumbnailUrl.trim().length > 0)?.thumbnailUrl ??
    null;

  const id = typeof rawButton._id === 'string' ? rawButton._id : String(rawButton._id ?? '');
  if (!id) return null;

  const title = readNullableString(rawButton.buttonName) ?? readNullableString(rawButton.title);
  const videoUrl =
    trailers.find((t) => typeof t.url === 'string' && t.url?.trim().length)?.url ??
    null;

  return {
    id,
    title,
    description: null,
    imageUrl: buttonImageUrl,
    thumbnailUrl: fallbackThumb,
    videoUrl,
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

const readNullableArray = (value: unknown): unknown[] | null => (Array.isArray(value) ? value : null);

const normalizeGoldenTempleItem = (raw: unknown, index: number): ExperienceItem | null => {
  if (!isRecord(raw)) return null;
  const id = readNullableString(raw._id) ?? String(index);
  const title = readNullableString(raw.title);
  const thumbnailUrl = readNullableString(raw.thumbnail);
  const videoUrl = readNullableString(raw.video);
  return {
    id,
    title,
    description: null,
    imageUrl: null,
    thumbnailUrl,
    videoUrl,
    trailers: [],
    galleryItems: [],
  };
};

const normalizeTimelineGalleryItemToGallery = (raw: unknown): GalleryItem => {
  if (!isRecord(raw)) return {};
  return {
    _id: readNullableString(raw._id),
    title: readNullableString(raw.year) ?? readNullableString(raw.title),
    shortDescription: readNullableString(raw.shortDescription),
    longDescription: readNullableString(raw.longDescription),
    imageUrl: readNullableString(raw.image) ?? readNullableString(raw.thumbnail),
    accession: null,
    periodOrOrigin: readNullableString(raw.year),
    credit: null,
    detailUrl: null,
  };
};

const normalizeTimelineItem = (raw: unknown, index: number): ExperienceItem | null => {
  if (!isRecord(raw)) return null;
  const id = readNullableString(raw._id) ?? String(index);
  const title = readNullableString(raw.year) ?? readNullableString(raw.title);
  const thumbnailUrl = readNullableString(raw.thumbnail);
  const imageUrl = readNullableString(raw.image);
  const galleryItems: GalleryItem[] = [normalizeTimelineGalleryItemToGallery(raw)];
  return {
    id,
    title,
    description: readNullableString(raw.shortDescription),
    imageUrl: imageUrl ?? null,
    thumbnailUrl: thumbnailUrl ?? imageUrl ?? null,
    videoUrl: null,
    trailers: [],
    galleryItems,
  };
};

const normalizeAppToItems = (app: unknown): { appId: string | null; name: string | null; description: string | null; items: ExperienceItem[] } | null => {
  if (!isRecord(app)) return null;
  const appId = readNullableString(app._id);
  const name = readNullableString(app.name);
  const description = readNullableString(app.description);

  const buttons = readNullableArray(app.buttons);
  if (buttons) {
    const items = buttons
      .map(normalizeSikhApiButtonToItem)
      .filter((v): v is ExperienceItem => Boolean(v));
    return { appId, name, description, items };
  }

  const goldenTemples = readNullableArray(app.goldenTemples);
  if (goldenTemples) {
    const items = goldenTemples
      .map(normalizeGoldenTempleItem)
      .filter((v): v is ExperienceItem => Boolean(v));
    return { appId, name, description, items };
  }

  const timelineGalleries = readNullableArray(app.timelineGalleries);
  if (timelineGalleries) {
    const items = timelineGalleries
      .map(normalizeTimelineItem)
      .filter((v): v is ExperienceItem => Boolean(v));
    return { appId, name, description, items };
  }

  return { appId, name, description, items: [] };
};

/** Select `data[i]` where the first entry in `buttons` has this `_id` (Sikh History kiosk bundle). */
export const DEFAULT_HOME_FIRST_BUTTON_ID = '69a16102cef5996af9807c67';

const readFirstButtonId = (app: unknown): string | null => {
  if (!isRecord(app)) return null;
  const buttons = readNullableArray(app.buttons);
  if (!buttons?.length) return null;
  const first = buttons[0];
  if (!isRecord(first)) return null;
  if (typeof first._id === 'string') return first._id;
  return first._id != null ? String(first._id) : null;
};

export function getAppData(response: unknown, homeFirstButtonIdOverride: string | null): AppData {
  const apps = extractItemsArray(response);
  const marker = (homeFirstButtonIdOverride?.trim() || DEFAULT_HOME_FIRST_BUTTON_ID);

  const rawApp =
    apps.find((item) => {
      const id = readFirstButtonId(item);
      return id === marker;
    }) ?? null;

  if (!rawApp) {
    return { appId: null, name: null, description: null, items: [] };
  }

  const picked = normalizeAppToItems(rawApp);
  if (!picked) {
    return { appId: null, name: null, description: null, items: [] };
  }

  return {
    appId: picked.appId,
    name: picked.name,
    description: picked.description,
    items: picked.items,
  };
}
