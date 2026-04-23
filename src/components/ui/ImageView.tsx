import React from 'react';

export type ImageViewProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackText?: string;
};

export const ImageView: React.FC<ImageViewProps> = ({
  src,
  alt,
  className,
  fallbackText,
}) => {
  const trimmedSrc = typeof src === 'string' ? src.trim() : '';
  const imageClassName = className ? ` ${className}` : '';

  if (!trimmedSrc) {
    return (
      <div
        className="bg-white/5 text-white/60 flex items-center justify-center"
        aria-label={alt}
      >
        {fallbackText || 'Image unavailable'}
      </div>
    );
  }

  return (
    <img
      src={trimmedSrc}
      alt={alt}
      loading="lazy"
      className={`block w-full h-full object-cover${imageClassName}`.trim()}
    />
  );
};
