import prisma from "@/lib/prisma";
import { $LogInSchema, LogInSchema } from "@/lib/validation";

type FormState = { error?: string } | undefined;

export async function logInAction(formData: LogInSchema) {
  const { email, phone } = $LogInSchema.parse(formData);

  return;
}
