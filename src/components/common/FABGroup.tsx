interface FABGroupProps {
  onShare?: () => void;
  onAdd?: () => void;
  addIcon?: string;
}

export default function FABGroup({
  onShare,
  onAdd,
  addIcon = 'add_task',
}: FABGroupProps) {
  return (
    <div className="fixed bottom-10 right-10 flex flex-col space-y-4 z-50">
      {/* Share Button */}
      {onShare && (
        <button
          onClick={onShare}
          className="w-14 h-14 rounded-full bg-surface-container-lowest text-on-surface shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined">share</span>
        </button>
      )}

      {/* Add Button */}
      {onAdd && (
        <button
          onClick={onAdd}
          className="w-16 h-16 rounded-full signature-gradient text-on-primary flex items-center justify-center hover:scale-105 transition-transform"
          style={{ boxShadow: '0 20px 40px -10px rgba(16, 106, 104, 0.4)' }}
        >
          <span className="material-symbols-outlined text-2xl">{addIcon}</span>
        </button>
      )}
    </div>
  );
}
