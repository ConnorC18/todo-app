"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const errorSearchParams = useSearchParams().get("error");

  let errorMessage = "Auth Error";
  if (errorSearchParams) errorMessage = errorSearchParams;

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-semibold text-red-500">{errorMessage}</h1>
      <Button type="button" variant="link" onClick={() => router.back()}>
        Go back
      </Button>
    </div>
  );
}
