import React from 'react';
import playButtonPng from '@/assets/images/VideoPlayer/PlayButton.png';
import pauseButtonPng from '@/assets/images/VideoPlayer/PauseButton.png';

export type KioskVideoPlayerProps = {
  src: string | null;
  poster?: string | null;
  className?: string;
  onEnded?: () => void;
  onError?: () => void;
};

type OverlayMode = 'pause-visible' | 'hidden' | 'play-visible';

const CONTROL_IMG_CLASS =
  'pointer-events-none max-h-[min(309px,38%)] max-w-[min(308px,38%)] select-none object-contain';

/**
 * Video region from `SHM Ui - Screen 5.svg`. Play / pause use `VideoPlayer/PlayButton.png` and `PauseButton.png`.
 * Autoplays muted; shows pause while playing, auto-hides after 3s; tap surface when hidden pauses and shows play.
 */
export const KioskVideoPlayer: React.FC<KioskVideoPlayerProps> = ({
  src,
  poster,
  className,
  onEnded,
  onError,
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoPaused, setVideoPaused] = React.useState(true);
  const [overlayMode, setOverlayMode] = React.useState<OverlayMode>('pause-visible');
  const [progress01, setProgress01] = React.useState(0);

  React.useEffect(() => {
    setVideoPaused(true);
    setOverlayMode('pause-visible');
  }, [src]);

  React.useEffect(() => {
    const el = videoRef.current;
    if (!el || !src) return;
    const onPlay = () => setVideoPaused(false);
    const onPause = () => setVideoPaused(true);
    const onTime = () => {
      const duration = Number.isFinite(el.duration) && el.duration > 0 ? el.duration : 0;
      if (!duration) return;
      setProgress01(Math.min(1, Math.max(0, el.currentTime / duration)));
    };
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onTime);
    return () => {
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onTime);
    };
  }, [src]);

  React.useEffect(() => {
    const el = videoRef.current;
    if (!el || !src || src.trim() === '') return;
    el.muted = true;
    const playAttempt = el.play();
    if (playAttempt) {
      void playAttempt.catch(() => {
        setVideoPaused(true);
        setOverlayMode('pause-visible');
      });
    }
  }, [src]);

  React.useEffect(() => {
    if (overlayMode !== 'pause-visible' || videoPaused) return;
    const id = window.setTimeout(() => {
      setOverlayMode('hidden');
    }, 3000);
    return () => window.clearTimeout(id);
  }, [overlayMode, videoPaused, src]);

  const handleOverlayActivate = () => {
    const el = videoRef.current;
    if (!el || !src) return;
    if (overlayMode === 'pause-visible') {
      if (el.paused) {
        void el.play().catch(() => {});
        return;
      }
      el.pause();
      setOverlayMode('play-visible');
      return;
    }
    if (overlayMode === 'play-visible') {
      void el.play().catch(() => {});
      setOverlayMode('pause-visible');
    }
  };

  const handleHiddenSurfaceClick = () => {
    const el = videoRef.current;
    if (!el || overlayMode !== 'hidden') return;
    if (!el.paused) {
      el.pause();
      setOverlayMode('play-visible');
    }
  };

  const handleOverlayKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handleOverlayActivate();
  };

  const handleHiddenKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handleHiddenSurfaceClick();
  };

  const handleSeekBarClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const el = videoRef.current;
    if (!el) return;
    const duration = Number.isFinite(el.duration) && el.duration > 0 ? el.duration : 0;
    if (!duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(rect.width, Math.max(0, event.clientX - rect.left));
    const t = (x / rect.width) * duration;
    el.currentTime = t;
  };

  const handleSeekBarKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    const el = videoRef.current;
    if (!el) return;
    const duration = Number.isFinite(el.duration) && el.duration > 0 ? el.duration : 0;
    if (!duration) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const stepSec = Math.max(1, duration * 0.03);
    el.currentTime = Math.min(duration, Math.max(0, el.currentTime + (event.key === 'ArrowRight' ? stepSec : -stepSec)));
  };

  if (!src || src.trim() === '') {
    return (
      <div
        className={`flex items-center justify-center rounded-[48px] bg-white/5 text-[32px] text-white/60 ${className ?? ''}`}
        aria-label="Video unavailable"
      >
        Video unavailable
      </div>
    );
  }

  const showPauseGlyph = overlayMode === 'pause-visible' && !videoPaused;
  const showPlayGlyph = overlayMode === 'play-visible' || (overlayMode === 'pause-visible' && videoPaused);

  return (
    <div className={`relative overflow-hidden rounded-[48px] bg-black ${className ?? ''}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster ?? undefined}
        preload="auto"
        muted
        playsInline
        controls={false}
        onEnded={onEnded}
        onError={onError}
        className="h-full w-full object-cover"
      />

      {/* Seek bar — bottom center inside player */} 
      <div className="absolute bottom-[28px] left-1/2 z-30 w-[88%] -translate-x-1/2">
        <button
          type="button"
          tabIndex={0}
          aria-label="Seek"
          onClick={handleSeekBarClick}
          onKeyDown={handleSeekBarKeyDown}
          className="relative h-[42px] w-full rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
        >
          <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-[#B9B9B9]" aria-hidden />
          <span
            className="absolute left-0 top-1/2 h-[9px] -translate-y-1/2 rounded-full bg-[#C8C8C8]"
            style={{ width: `${Math.round(progress01 * 100)}%` }}
            aria-hidden
          />
          <span
            className="absolute top-1/2 h-[41px] w-[41px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D9D9D9]"
            style={{ left: `${Math.round(progress01 * 100)}%` }}
            aria-hidden
          />
        </button>
      </div>

      {overlayMode === 'hidden' ? (
        <button
          type="button"
          tabIndex={0}
          aria-label="Pause video"
          onClick={handleHiddenSurfaceClick}
          onKeyDown={handleHiddenKeyDown}
          className="absolute inset-0 z-10 cursor-pointer bg-transparent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
        />
      ) : null}

      {overlayMode === 'pause-visible' || overlayMode === 'play-visible' ? (
        <button
          type="button"
          tabIndex={0}
          aria-label={videoPaused ? 'Play video' : 'Pause video'}
          onClick={handleOverlayActivate}
          onKeyDown={handleOverlayKeyDown}
          className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center bg-gradient-to-t from-black/40 via-transparent to-black/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
        >
          {showPauseGlyph ? (
            <img src={pauseButtonPng} alt="" className={CONTROL_IMG_CLASS} draggable={false} aria-hidden />
          ) : showPlayGlyph ? (
            <img src={playButtonPng} alt="" className={CONTROL_IMG_CLASS} draggable={false} aria-hidden />
          ) : null}
        </button>
      ) : null}
    </div>
  );
};
