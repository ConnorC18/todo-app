import prisma from "@/lib/prisma";
import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import credentials from "next-auth/providers/credentials";

import { $LogInSchema } from "./lib/validation";

export default {
  providers: [
    credentials({
      // Optional for /api/auth/signin
      credentials: {
        email: { label: "Email", type: "email" },
        phone: { label: "Phone", type: "tel" },
      },
      async authorize(credentials, req) {
        const validatedFields = $LogInSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, phone } = validatedFields.data;
          const user = await prisma.user.findFirst({
            where: {
              OR: [{ email }, { phone }],
            },
          });

          if (!user) return null;

          //TODO: Check email or phone!

          return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
