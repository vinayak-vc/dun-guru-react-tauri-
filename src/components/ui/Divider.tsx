import React from 'react';

export const Divider: React.FC<{ className?: string }> = ({ className }) => (
  <div role="separator" aria-orientation="horizontal" className={`h-px w-full bg-white/15 ${className ?? ""}`.trimEnd()} />
);
