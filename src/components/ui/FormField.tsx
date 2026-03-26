import React from 'react';

interface FormFieldProps {
  label: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormField({ label, icon, children, className = '' }: FormFieldProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-lg">{icon}</span>
        <span className="text-sm font-semibold text-on-surface">{label}</span>
      </div>
      {children}
    </div>
  );
}
