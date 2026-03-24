import React from 'react';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  titleSize?: 'xl' | '2xl' | '4xl' | '5xl';
  align?: 'left' | 'right';
  rightSlot?: React.ReactNode;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  titleSize = '4xl',
  align = 'left',
  rightSlot,
}: SectionHeaderProps) {
  const alignClasses = align === 'right' ? 'text-right' : 'text-left';
  const titleSizeClasses = {
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
  };

  return (
    <div className={`${alignClasses}`}>
      <span className="block text-primary font-bold tracking-widest text-xs uppercase mb-2">
        {eyebrow}
      </span>
      <div className="flex items-end justify-between gap-8">
        <div>
          <h2 className={`font-headline font-extrabold ${titleSizeClasses[titleSize]} text-on-surface mb-2`}>
            {title}
          </h2>
          {subtitle && <p className="text-on-surface-variant text-lg">{subtitle}</p>}
        </div>
        {rightSlot && <div>{rightSlot}</div>}
      </div>
    </div>
  );
}
