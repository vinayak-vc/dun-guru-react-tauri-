import React from 'react';

export type ZoomPanImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** Minimum zoom (1 = fitted). */
  minScale?: number;
  /** Maximum zoom. */
  maxScale?: number;
};

type PointerPoint = { x: number; y: number };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Zoom + pan image:
 * - mouse wheel zoom
 * - mouse/touch drag pan
 * - touch pinch zoom (pointer events)
 */
export const ZoomPanImage: React.FC<ZoomPanImageProps> = ({
  src,
  alt,
  className,
  minScale = 1,
  maxScale = 6,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(minScale);
  const [translate, setTranslate] = React.useState({ x: 0, y: 0 });

  const pointersRef = React.useRef<Map<number, PointerPoint>>(new Map());
  const gestureRef = React.useRef<{
    mode: 'none' | 'pan' | 'pinch';
    startScale: number;
    startTranslate: { x: number; y: number };
    startCenter: PointerPoint;
    startDistance: number;
    lastPanPointerId: number | null;
    lastPanPoint: PointerPoint;
  }>({
    mode: 'none',
    startScale: minScale,
    startTranslate: { x: 0, y: 0 },
    startCenter: { x: 0, y: 0 },
    startDistance: 0,
    lastPanPointerId: null,
    lastPanPoint: { x: 0, y: 0 },
  });

  React.useEffect(() => {
    setScale(minScale);
    setTranslate({ x: 0, y: 0 });
    pointersRef.current.clear();
    gestureRef.current.mode = 'none';
  }, [src, minScale]);

  const getBounds = (nextScale: number) => {
    const el = containerRef.current;
    if (!el) return { minX: -Infinity, maxX: Infinity, minY: -Infinity, maxY: Infinity };
    const { width, height } = el.getBoundingClientRect();
    const extraX = (width * (nextScale - 1)) / 2;
    const extraY = (height * (nextScale - 1)) / 2;
    return { minX: -extraX, maxX: extraX, minY: -extraY, maxY: extraY };
  };

  const applyClampedTranslate = (nextScale: number, nextTranslate: { x: number; y: number }) => {
    const b = getBounds(nextScale);
    return {
      x: clamp(nextTranslate.x, b.minX, b.maxX),
      y: clamp(nextTranslate.y, b.minY, b.maxY),
    };
  };

  const zoomAt = (nextScaleRaw: number, anchor: PointerPoint) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nextScale = clamp(nextScaleRaw, minScale, maxScale);
    const ax = anchor.x - (rect.left + rect.width / 2);
    const ay = anchor.y - (rect.top + rect.height / 2);

    // Keep the point under cursor stable:
    // newTranslate = oldTranslate + (1 - next/old) * anchorOffset
    setTranslate((t) => {
      const ratio = nextScale / scale;
      const next = { x: t.x + (1 - ratio) * ax, y: t.y + (1 - ratio) * ay };
      return applyClampedTranslate(nextScale, next);
    });
    setScale(nextScale);
  };

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    const delta = event.deltaY;
    const factor = delta > 0 ? 0.92 : 1.08;
    zoomAt(scale * factor, { x: event.clientX, y: event.clientY });
  };

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const el = containerRef.current;
    if (!el) return;
    el.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const pts = Array.from(pointersRef.current.values());
    const g = gestureRef.current;
    if (pts.length === 1) {
      g.mode = 'pan';
      g.lastPanPointerId = event.pointerId;
      g.lastPanPoint = { x: event.clientX, y: event.clientY };
      g.startScale = scale;
      g.startTranslate = translate;
      return;
    }

    if (pts.length === 2) {
      const [a, b] = pts;
      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      g.mode = 'pinch';
      g.startScale = scale;
      g.startTranslate = translate;
      g.startCenter = { x: cx, y: cy };
      g.startDistance = Math.hypot(dx, dy);
    }
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const pts = Array.from(pointersRef.current.values());
    const g = gestureRef.current;

    if (g.mode === 'pan' && g.lastPanPointerId === event.pointerId && pts.length === 1) {
      const dx = event.clientX - g.lastPanPoint.x;
      const dy = event.clientY - g.lastPanPoint.y;
      g.lastPanPoint = { x: event.clientX, y: event.clientY };
      setTranslate((t) => applyClampedTranslate(scale, { x: t.x + dx, y: t.y + dy }));
      return;
    }

    if (pts.length === 2) {
      const [a, b] = pts;
      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (!g.startDistance) return;

      const nextScale = clamp(g.startScale * (dist / g.startDistance), minScale, maxScale);
      setScale(nextScale);

      // Pan by center delta
      const dcx = cx - g.startCenter.x;
      const dcy = cy - g.startCenter.y;
      setTranslate(applyClampedTranslate(nextScale, { x: g.startTranslate.x + dcx, y: g.startTranslate.y + dcy }));
      g.mode = 'pinch';
      return;
    }
  };

  const handlePointerUpOrCancel: React.PointerEventHandler<HTMLDivElement> = (event) => {
    pointersRef.current.delete(event.pointerId);
    const pts = pointersRef.current.size;
    const g = gestureRef.current;
    if (pts === 0) {
      g.mode = 'none';
      g.lastPanPointerId = null;
      return;
    }
    if (pts === 1) {
      // Switch back to pan with remaining pointer
      const remainingId = Array.from(pointersRef.current.keys())[0] ?? null;
      const remainingPt = remainingId !== null ? pointersRef.current.get(remainingId) : null;
      g.mode = 'pan';
      g.lastPanPointerId = remainingId;
      g.lastPanPoint = remainingPt ?? g.lastPanPoint;
      g.startScale = scale;
      g.startTranslate = translate;
    }
  };

  const mergedClassName = className ? ` ${className}` : '';

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden bg-black${mergedClassName}`}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      style={{ touchAction: 'none', cursor: scale > 1 ? 'grab' : 'default' }}
      role="application"
      aria-label="Zoomable image"
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="absolute left-1/2 top-1/2 max-h-none max-w-none select-none"
        style={{
          transform: `translate(calc(-50% + ${translate.x}px), calc(-50% + ${translate.y}px)) scale(${scale})`,
          transformOrigin: 'center',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
};

