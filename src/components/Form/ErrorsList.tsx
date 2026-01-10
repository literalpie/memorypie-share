import { AlertCircle } from "lucide-react";

export const ErrorsList = ({ errors }: { errors: string[] }) => {
  return errors.map((error) => (
    <span className="text-destructive-text flex flex-row items-center gap-2">
      <AlertCircle className="shrink-0" aria-label="Error:" size={16} />
      {error}
    </span>
  ));
};
