import React from 'react';

export type VideoPlayerProps = {
  src?: string | null;
  className?: string;
  onEnded?: () => void;
  onError?: () => void;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, className, onEnded, onError }) => {
  if (!src || src.trim() === '') {
    return (
      <div className="bg-white/5 text-white/60 flex items-center justify-center rounded-xl" aria-label="Video unavailable">
        Video unavailable
      </div>
    );
  }

  return (
    <video
      src={src}
      autoPlay
      muted
      playsInline
      controls={false}
      onEnded={onEnded}
      onError={onError}
      className={`w-full h-full object-cover rounded-xl bg-black ${className}`}
    />
  );
};
