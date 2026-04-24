import React from 'react';

type FadeTransitionProps = {
  screenKey: string;
  children: React.ReactNode;
  className?: string;
  /** Animation duration in ms. */
  durationMs?: number;
};

const FadeTransition: React.FC<FadeTransitionProps> = ({
  screenKey,
  children,
  className,
  durationMs = 160,
}) => {
  const [prev, setPrev] = React.useState<React.ReactNode | null>(null);
  const [prevKey, setPrevKey] = React.useState<string | null>(null);
  const [enter, setEnter] = React.useState(false);

  // Keep a stable "current" node and remember previous one on key change.
  const currentRef = React.useRef<React.ReactNode>(children);
  const currentKeyRef = React.useRef(screenKey);

  React.useEffect(() => {
    if (currentKeyRef.current === screenKey) return;
    setEnter(false);
    const outgoing = currentRef.current;
    setPrev(outgoing);
    setPrevKey(currentKeyRef.current);
    currentRef.current = children;
    currentKeyRef.current = screenKey;

    const raf = requestAnimationFrame(() => setEnter(true));
    const tid = window.setTimeout(() => {
      setPrev(null);
      setPrevKey(null);
    }, durationMs);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(tid);
    };
  }, [children, durationMs, screenKey]);

  React.useEffect(() => {
    // First mount enter.
    const raf = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const extraClassName = className ? ` ${className}` : '';

  return (
    <div className={`relative h-full w-full overflow-hidden${extraClassName}`}>
      {prev ? (
        <div
          key={prevKey ?? 'prev'}
          className="absolute inset-0 kiosk-screen-exit"
          style={{
            animationDuration: `${durationMs}ms`,
          }}
        >
          {prev}
        </div>
      ) : null}
      <div
        key={screenKey}
        className={`absolute inset-0 ${enter ? 'kiosk-screen-enter' : ''}`}
        style={{
          animationDuration: `${durationMs}ms`,
        }}
      >
        {currentRef.current}
      </div>
    </div>
  );
};

export default FadeTransition;
