import React from 'react';

interface CardProps {
  hover?: boolean;
  padding?: 'sm' | 'md';
  className?: string;
  children: React.ReactNode;
}

export default function Card({
  hover = true,
  padding = 'md',
  className = '',
  children,
}: CardProps) {
  const paddingClasses = {
    sm: 'p-6',
    md: 'p-8',
  };

  const hoverClasses = hover
    ? 'hover:bg-surface-container-low hover:border-primary-container/30 transition-colors'
    : '';

  const baseClasses = 'bg-surface-container-lowest rounded-xl border border-transparent relative overflow-hidden group';

  const finalClasses = `${baseClasses} ${paddingClasses[padding]} ${hoverClasses} ${className}`;

  return <div className={finalClasses}>{children}</div>;
}
