import React from 'react';
import homePng from '@/assets/images/home.png';

export type HomeNavIconButtonProps = {
  /** Design-space X (SVG userSpace units, e.g. 2160×3840). */
  leftPx: number;
  /** Design-space Y */
  topPx: number;
  ariaLabel?: string;
  onClick: () => void;
  /** Hit target size in design pixels (Figma group is ~176×176). */
  sizePx?: number;
};

/**
 * Home control matching Figma group sizing (~176×176) with raster icon.
 */
export const HomeNavIconButton: React.FC<HomeNavIconButtonProps> = ({
  leftPx,
  topPx,
  ariaLabel = 'Home',
  onClick,
  sizePx = 176,
}) => {
  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onClick();
  };

  return (
    <button
      type="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="absolute z-20 flex items-center justify-center bg-transparent transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
      style={{ left: leftPx, top: topPx, width: sizePx, height: sizePx }}
    >
      <img src={homePng} alt="" draggable={false} className="h-full w-full select-none object-contain" aria-hidden />
    </button>
  );
};
