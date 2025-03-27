interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="p-4 rounded-lg bg-red-50 text-red-800">
      <p className="text-sm">{message}</p>
    </div>
  );
}
