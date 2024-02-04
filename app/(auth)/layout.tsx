import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ToDo App",
    template: "%s | ToDo App",
  },
  description: "See easily what you have to do.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-w-[350px]`}>
        <main className="m-auto my-10 max-w-md px-4">
          <div className="space-y-6 rounded-lg border p-4">{children}</div>
        </main>
      </body>
    </html>
  );
}
