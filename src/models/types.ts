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

export interface AppData {
  buttons: Button[];
}
