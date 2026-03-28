interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export default function EmptyState({
  icon = 'inbox',
  title,
  description,
  ctaLabel,
  onCta,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-8 space-y-4">
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-2">
        <span className="material-symbols-outlined text-3xl text-outline">{icon}</span>
      </div>
      <h3 className="font-headline font-bold text-xl text-on-surface">{title}</h3>
      {description && (
        <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">{description}</p>
      )}
      {ctaLabel && onCta && (
        <button
          type="button"
          onClick={onCta}
          className="mt-4 signature-gradient text-on-primary px-6 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
