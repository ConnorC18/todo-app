"use client";
import { useFormStatus } from "react-dom";
import LoadingButton from "./LoadingButton";
import { ButtonProps } from "./ui/button";

export default function FormSubmitButton({ ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return <LoadingButton {...props} type="submit" loading={pending} />;
}
