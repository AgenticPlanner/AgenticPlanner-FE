interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export default function LoadingSpinner({ fullScreen = true }: LoadingSpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center bg-background ${
        fullScreen ? 'min-h-screen' : 'py-20'
      }`}
    >
      <div
        className="h-12 w-12 rounded-full border-2 border-transparent animate-spin"
        style={{
          borderTopColor: '#106a68',
          borderBottomColor: '#106a68',
          boxShadow: '0 0 12px rgba(16, 106, 104, 0.3)',
        }}
      />
    </div>
  );
}
