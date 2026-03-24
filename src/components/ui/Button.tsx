import React from 'react';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  variant,
  size = 'md',
  icon,
  disabled = false,
  onClick,
  className = '',
  children,
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
  };

  const variantClasses = {
    primary: 'bg-primary text-on-primary hover:opacity-90 transition-opacity',
    secondary: 'bg-surface-container-high text-on-secondary-container hover:bg-surface-container-highest transition-colors',
    ghost: 'border border-outline-variant text-outline cursor-not-allowed',
  };

  const baseClasses = 'rounded-full font-semibold';
  const finalClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <button
      className={finalClasses}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="flex items-center gap-2">
        {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
        {children}
      </span>
    </button>
  );
}
