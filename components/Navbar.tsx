import Link from "next/link";
import { Button } from "./ui/button";
import { auth, signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  const serverAction = async () => {
    "use server";

    await signOut({ redirectTo: "/", redirect: true });
  };

  return (
    <header className="shadow-sm">
      <nav className="m-auto flex max-w-5xl items-center justify-between px-3 py-5">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Todo App
        </Link>
        <div className="flex gap-6">
          {session?.user ? (
            <form action={serverAction}>
              <Button variant="ghost">Log Out</Button>
            </form>
          ) : (
            <Button asChild variant="outline">
              <Link href="/auth/login">Log In</Link>
            </Button>
          )}
          <Button asChild>
            <Link href="/todo/new">Make a ToDo</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
