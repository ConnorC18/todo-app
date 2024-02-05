import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "@/auth.config";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";

// https://authjs.dev/getting-started/typescript
declare module "next-auth" {
  interface User {}
  interface Account {}
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user }) {
      // user is the exact user object return from authorize func
      // and this func is run only at the login
      // return true for letting the user login or false for not

      const verificationToken = await prisma.verificationToken.findUnique({
        where: { userId: user.id },
      });

      if (
        !verificationToken ||
        !verificationToken.verified ||
        verificationToken.expires < new Date() // redundant but ok
      )
        return false;

      await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      });

      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await prisma.user.findUnique({
        where: { id: token.sub },
      });

      if (!user) return token;

      token.role = user.role;

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
