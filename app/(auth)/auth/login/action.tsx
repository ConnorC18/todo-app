"use server";

import { signIn } from "@/auth";
import { $LogInSchema, LogInSchema } from "@/lib/validation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export async function logInAction(formData: LogInSchema) {
  const validatedFields = $LogInSchema.safeParse(formData);

  if (!validatedFields.success) return { error: "Invalid fields" };

  const { email, phone } = validatedFields.data;

  try {
    await signIn("credentials", { email, phone, redirectTo: DEFAULT_LOGIN_REDIRECT });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }

    throw error;
  }
}
