interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 rounded-xl px-5 py-4 flex items-start gap-3">
      <span className="material-symbols-outlined text-red-500 text-xl shrink-0 mt-0.5">
        error
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-red-600">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-xs font-semibold text-primary hover:underline"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
