import React from 'react';
import { ImageView } from '@/components/ui/ImageView';

export type ButtonCardProps = {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
};

export const ButtonCard: React.FC<ButtonCardProps> = ({
  title,
  subtitle,
  description,
  thumbnailUrl,
  onClick,
  onKeyDown,
  className,
  ariaLabel,
  disabled,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const extraClassName = className ? ` ${className}` : '';
  const buttonAriaLabel = ariaLabel || title;

  return (
    <button
      type="button"
      tabIndex={0}
      aria-label={buttonAriaLabel}
      disabled={disabled}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`w-full text-left rounded-xl bg-white/5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed p-4 flex items-center gap-4${extraClassName}`}
    >
      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
        <ImageView
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full"
          fallbackText="No image"
        />
      </div>

      <div className="min-w-0 flex-1 flex flex-col gap-1">
        <div className="text-lg font-semibold tracking-wide truncate">
          {title}
        </div>
        {subtitle ? (
          <div className="text-sm text-white/70 truncate">{subtitle}</div>
        ) : null}
        {description ? (
          <div className="text-sm text-white/60 overflow-hidden text-ellipsis line-clamp-2">
            {description}
          </div>
        ) : null}
      </div>
    </button>
  );
};
