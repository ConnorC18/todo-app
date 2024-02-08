"use client";

import { Input } from "@/components/ui/input";
import { logInAction } from "./action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { $LogInSchema, LogInSchema } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn, formatPhoneNumber } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

// TODO: Remove default from every component!

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [usePhone, setUsePhone] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const form = useForm<LogInSchema>({
    resolver: zodResolver($LogInSchema),
    defaultValues: { email: "", phone: "", code: "" },
  });

  const {
    handleSubmit,
    control,
    reset,
    clearErrors,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  async function onSubmit(values: LogInSchema) {
    const out = await logInAction(values, searchParams.get("callbackUrl"));
    if (out?.error) {
      // An error that is not associated with an input field will be persisted until cleared with clearErrors.
      setError("email", { type: "custom", message: out.error });
      setError("phone", { type: "custom", message: out.error });
      setError("code", { type: "custom", message: out.error });
    }

    if (out?.twoFactor) {
      setShowTwoFactor(true);
      clearErrors();
    }
  }

  return (
    <Form {...form}>
      <form className="relative flex flex-col gap-4" noValidate onSubmit={handleSubmit(onSubmit)}>
        {showTwoFactor && (
          <>
            <p className="absolute right-0 top-0 h-fit p-0 pt-1 text-xs">
              Wait 2 min to get the code
            </p>
            <FormField
              control={control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="1234" autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {!showTwoFactor && (
          <>
            <Button
              type="button"
              variant="link"
              className="absolute right-0 top-0 h-fit p-0 pt-1 text-xs"
              onClick={() => {
                setUsePhone(!usePhone);
                reset();
              }}
            >
              {usePhone ? "Use Email" : "Use Phone Number"}
            </Button>
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className={cn(usePhone && "hidden")}>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <FormItem className={cn(!usePhone && "hidden")}>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <LoadingButton className="w-full" type="submit" loading={isSubmitting}>
          {showTwoFactor ? "Confirm" : "Log In"}
        </LoadingButton>
        <Button type="button" variant="link" className="m-auto w-fit" onClick={() => router.back()}>
          Go back
        </Button>
      </form>
    </Form>
  );
}
