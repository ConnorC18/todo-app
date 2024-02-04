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
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// TODO: Remove default from every component!

export default function Page() {
  const router = useRouter();
  const [usePhone, setUsePhone] = useState(false);

  const form = useForm<LogInSchema>({
    resolver: zodResolver($LogInSchema),
    defaultValues: { email: "", phone: "" },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = form;

  async function onSubmit(values: LogInSchema) {
    const out = await logInAction(values);
    console.log(out?.error);
  }

  return (
    <Form {...form}>
      <form className="relative flex flex-col gap-4" noValidate onSubmit={handleSubmit(onSubmit)}>
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
                <Input {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton className="w-full" type="submit" loading={isSubmitting}>
          Log In
        </LoadingButton>
        <Button type="button" variant="link" className="m-auto w-fit" onClick={() => router.back()}>
          Go back
        </Button>
      </form>
    </Form>
  );
}
