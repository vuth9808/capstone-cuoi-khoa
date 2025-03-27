interface SuccessMessageProps {
  message: string;
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <div className="p-4 rounded-lg bg-green-50 text-green-800">
      <p className="text-sm">{message}</p>
    </div>
  );
}
