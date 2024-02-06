import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "@/auth.config";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  interface User extends PrismaUser {}
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
      if (!user.loginVerified || user.loginVerified < new Date()) return false;

      await prisma.user.update({
        where: { id: user.id },
        data: { loginVerified: null, verifyRequestId: null },
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
