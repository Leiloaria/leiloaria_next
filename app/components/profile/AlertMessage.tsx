interface AlertMessageProps {
  message: string;
  type: "error" | "success";
}

export function AlertMessage({ message, type }: AlertMessageProps) {
  if (type === "error") {
    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        {message}
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
      {message}
    </div>
  );
}
