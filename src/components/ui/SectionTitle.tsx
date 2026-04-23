import React from 'react';

export const SectionTitle: React.FC<{ title: string; subtitle?: string | null; className?: string }> = ({ title, subtitle, className }) => (
  <div role="heading" aria-level={2} className={`flex flex-col gap-1 ${className ?? ""}`.trimEnd()}>
    <h2 className="text-2xl font-semibold tracking-wide">{title}</h2>
    {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
  </div>
);
