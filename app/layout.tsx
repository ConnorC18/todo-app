import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ToDo App",
    template: "%s | ToDo App",
  },
  description: "See easily what you have to do.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${inter.className} min-w-[350px]`}>
          <Toaster />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
