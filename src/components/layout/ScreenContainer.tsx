import React from 'react';

const ScreenContainer: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  const extraClassName = className ? ` ${className}` : '';

  return (
    <div className={`min-h-screen w-full bg-black text-white flex flex-col px-8 py-6${extraClassName}`}>
      {children}
    </div>
  );
};

export default ScreenContainer;
