import React from 'react';

interface GlassPanelProps {
  className?: string;
  children: React.ReactNode;
}

export default function GlassPanel({ className = '', children }: GlassPanelProps) {
  return (
    <div
      className={`bg-white-glass backdrop-blur-md shadow-lg rounded-xl overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}