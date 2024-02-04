import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <header className="shadow-sm">
      <nav className="m-auto flex max-w-5xl items-center justify-between px-3 py-5">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Todo App
        </Link>
        <div className="flex gap-6">
          <Button asChild>
            <Link href="/todo/new">Make a ToDo</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/login">Log In</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
