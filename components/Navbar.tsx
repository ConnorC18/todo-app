import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <header className="shadow-sm">
      <nav className="m-auto flex max-w-5xl items-center justify-between px-3 py-5">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Todo App
        </Link>
        <Button asChild>
          <Link href="/todo/new">Make a ToDo</Link>
        </Button>
      </nav>
    </header>
  );
}
