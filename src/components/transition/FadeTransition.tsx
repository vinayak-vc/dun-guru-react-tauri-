import React, { useEffect, useState } from 'react';

type FadeTransitionProps = {
  screenKey: string;
  children: React.ReactNode;
  className?: string;
};

const FadeTransition: React.FC<FadeTransitionProps> = ({
  screenKey,
  children,
  className,
}) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(0);
    requestAnimationFrame(() => {
      setOpacity(1);
    });
  }, [screenKey]);

  const extraClassName = className ? ` ${className}` : '';

  return (
    <div
      className={`transition-opacity duration-200 ease-out${extraClassName}`}
      style={{ opacity }}
    >
      {children}
    </div>
  );
};

export default FadeTransition;
