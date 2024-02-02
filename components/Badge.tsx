import { PropsWithChildren } from "react";

export default function Badge({ children }: PropsWithChildren) {
  return (
    <span className="grid place-items-center rounded border bg-muted px-2 py-0.5 text-sm font-medium">
      {children}
    </span>
  );
}
