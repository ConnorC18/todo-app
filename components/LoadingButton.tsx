import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";

type Props = {
  loading: boolean;
} & ButtonProps;

export default function LoadingButton({ children, loading, ...props }: Props) {
  return (
    <Button disabled={loading} {...props}>
      <span className="flex items-center justify-center gap-1">
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </span>
    </Button>
  );
}
