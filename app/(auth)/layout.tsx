export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="m-auto my-10 max-w-md px-4">
      <div className="space-y-6 rounded-lg border p-4">{children}</div>
    </main>
  );
}
