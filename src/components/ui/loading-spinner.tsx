interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-rose-500 ${className || 'h-12 w-12'}`} />
  );
}
