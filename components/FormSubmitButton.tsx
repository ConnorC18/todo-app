"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function FormSubmitButton({
  children,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      <span className="flex items-center justify-center gap-1">
        {pending && <Loader2 size={16} className="animate-spin" />}
        {children}
      </span>
    </Button>
  );
}
