import React from 'react';

const ScreenContainer: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return (
    <div className={`min-h-screen w-full bg-black text-white flex flex-col ${className}`}>
      {children}
    </div>
  );
};

export default ScreenContainer;
