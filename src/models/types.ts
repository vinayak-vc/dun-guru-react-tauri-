export type ApiResponseUnknown = unknown;

export interface Button {
  _id: string;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  trailers?: Trailer[] | null;
  galleryItems?: GalleryItem[] | null;
}

export interface Trailer {
  title?: string | null;
  /** Trailer intro copy (API `description`). */
  description?: string | null;
  url?: string | null;
  thumbnailUrl?: string | null;
}

export interface GalleryItem {
  _id?: string | null;
  title?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  imageUrl?: string | null;
  accession?: string | null;
  periodOrOrigin?: string | null;
  credit?: string | null;
  detailUrl?: string | null;
}

export type ExperienceItem = {
  id: string;
  title: string | null;
  description: string | null;
  /** Card / hero image from API (`imageUrl` when present). */
  imageUrl: string | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  /** Normalized `trailers` from API (e.g. `trailers[0].videoUrl`, `trailers[0].description`). */
  trailers: Trailer[];
  galleryItems: GalleryItem[];
};

export interface AppData {
  appId: string | null;
  name: string | null;
  description: string | null;
  items: ExperienceItem[];
}
