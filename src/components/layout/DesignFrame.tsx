import React from 'react';

export type DesignFrameProps = React.PropsWithChildren<{
  /**
   * Design canvas size from the SVG export (e.g. 2160x3840).
   * Children are positioned in this coordinate system.
   */
  designWidth: number;
  designHeight: number;
  /** Optional raster backdrop. Omit for solid black (use when SVG is layout reference only). */
  backgroundSrc?: string;
  className?: string;
}>;

export const DesignFrame: React.FC<DesignFrameProps> = ({
  designWidth,
  designHeight,
  backgroundSrc,
  className,
  children,
}) => {
  const extraClassName = className ? ` ${className}` : '';

  const [viewportSize, setViewportSize] = React.useState(() => ({
    width: typeof window === 'undefined' ? 0 : window.innerWidth,
    height: typeof window === 'undefined' ? 0 : window.innerHeight,
  }));

  React.useEffect(() => {
    const handleResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scale =
    viewportSize.width > 0 && viewportSize.height > 0
      ? Math.min(viewportSize.width / designWidth, viewportSize.height / designHeight)
      : 1;

  return (
    <div className={`h-[100svh] w-[100vw] bg-black overflow-hidden${extraClassName}`}>
      <div className="relative h-full w-full">
        <div
          className="absolute left-1/2 top-1/2 origin-center"
          style={{
            width: designWidth,
            height: designHeight,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          {backgroundSrc ? (
            <img
              src={backgroundSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full select-none pointer-events-none"
              draggable={false}
            />
          ) : null}
          <div className="absolute inset-0">{children}</div>
        </div>
      </div>
    </div>
  );
};

