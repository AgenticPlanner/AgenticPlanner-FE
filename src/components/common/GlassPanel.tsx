import React from 'react';

interface GlassPanelProps {
  className?: string;
  children: React.ReactNode;
}

export default function GlassPanel({ className = '', children }: GlassPanelProps) {
  return (
    <div
      className={`bg-white/80 backdrop-blur-xl rounded-xl shadow-xl shadow-slate-200/40 border border-white/20 ${className}`}
    >
      {children}
    </div>
  );
}
