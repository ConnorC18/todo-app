"use server";

import { signIn } from "@/auth";
import { $LogInSchema, LogInSchema } from "@/lib/validation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { use } from "react";

export async function logInAction(formData: LogInSchema) {
  const validatedFields = $LogInSchema.safeParse(formData);

  if (!validatedFields.success) return { error: "Invalid fields" };

  const { email, phone, code } = validatedFields.data;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
    include: { verificationToken: true },
  });

  if (!user) return { error: "Invalid credentials" };

  if (!code) {
    if (user.verificationToken) {
      await prisma.verificationToken.delete({
        where: { userId: user.id },
      });
    }

    const vToken = await prisma.verificationToken.create({
      data: {
        token: crypto.randomInt(100_000, 1_000_000),
        expires: new Date(new Date().getTime() + 300 * 1000),
        userId: user.id,
      },
    });

    // TODO: send token by email or sms

    return { twoFactor: true };
  }

  if (!user.verificationToken) return { error: "What? No token found" };

  if (user.verificationToken.expires < new Date()) return { error: "Token expired" };

  if (user.verificationToken.token.toString() !== code) return { error: "Invalid token" };

  await prisma.verificationToken.update({
    where: { userId: user.id },
    data: { verified: true },
  });

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
