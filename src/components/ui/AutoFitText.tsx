import React from 'react';

export type AutoFitTextProps = {
  text: string;
  /** Max font size in px. */
  maxFontPx: number;
  /** Min font size in px. */
  minFontPx: number;
  /** Line height in px (kept constant to match Figma). */
  lineHeightPx: number;
  /** Font weight (e.g. 700). */
  fontWeight?: number;
  /** Optional className applied to the text element. */
  className?: string;
  /** Optional aria label override. */
  ariaLabel?: string;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Auto-fits text to a single line by reducing font-size until it fits its container width.
 * Designed for fixed-size kiosk frames (e.g. 825px title box on Screen 3).
 */
export const AutoFitText: React.FC<AutoFitTextProps> = ({
  text,
  maxFontPx,
  minFontPx,
  lineHeightPx,
  fontWeight = 700,
  className,
  ariaLabel,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [fontPx, setFontPx] = React.useState(maxFontPx);

  const recompute = React.useCallback(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const available = container.clientWidth;
    if (!available) return;

    // Binary search for best font-size.
    let lo = minFontPx;
    let hi = maxFontPx;
    let best = minFontPx;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      measure.style.fontSize = `${mid}px`;
      // Force sync layout read
      const w = measure.getBoundingClientRect().width;
      if (w <= available) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    setFontPx(clamp(best, minFontPx, maxFontPx));
  }, [maxFontPx, minFontPx]);

  React.useLayoutEffect(() => {
    recompute();
  }, [recompute, text]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => recompute());
    ro.observe(el);
    return () => ro.disconnect();
  }, [recompute]);

  const extra = className ? ` ${className}` : '';

  return (
    <div ref={containerRef} className="w-full">
      {/* Hidden measurement span */} 
      <span
        ref={measureRef}
        className="invisible absolute left-[-99999px] top-0 whitespace-nowrap"
        style={{ fontWeight, lineHeight: `${lineHeightPx}px` }}
        aria-hidden
      >
        {text}
      </span>

      <span
        className={`block w-full whitespace-nowrap text-center${extra}`}
        style={{ fontSize: `${fontPx}px`, fontWeight, lineHeight: `${lineHeightPx}px` }}
        aria-label={ariaLabel ?? text}
      >
        {text}
      </span>
    </div>
  );
};

