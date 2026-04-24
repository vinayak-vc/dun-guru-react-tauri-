import React from 'react';

export type BackNavIconButtonProps = {
  leftPx: number;
  topPx: number;
  ariaLabel?: string;
  onClick: () => void;
  /** Raster back control (`src/assets/images/Common/BackButton.png`). */
  iconSrc?: string;
  /** Hit target size in design pixels (Figma group is ~176×176). */
  sizePx?: number;
};

/** Matches Figma nav hit area, or raster `iconSrc` at same hit size. */
export const BackNavIconButton: React.FC<BackNavIconButtonProps> = ({
  leftPx,
  topPx,
  ariaLabel = 'Back',
  onClick,
  iconSrc,
  sizePx = 176,
}) => {
  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onClick();
  };

  const raster = Boolean(iconSrc);

  return (
    <button
      type="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`absolute z-20 flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 ${
        raster
          ? 'bg-transparent hover:opacity-90'
          : 'rounded-full bg-[#131313] text-white shadow-[0_0_0_2px_rgba(255,255,255,0.12)] hover:bg-[#1c1c1c]'
      }`}
      style={{ left: leftPx, top: topPx, width: sizePx, height: sizePx }}
    >
      {raster ? (
        <img src={iconSrc} alt="" draggable={false} className="h-full w-full select-none object-contain" aria-hidden />
      ) : (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path
            d="M14 6L8 12l6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};
