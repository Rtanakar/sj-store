import { CheckCircle } from "lucide-react";

// type Props = {
// message?: string;
// };

export const FormSuccess = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 bg-emerald-500/35 my-4 text-xs font-medium text-foreground p-3 rounded-md">
      <CheckCircle className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};
