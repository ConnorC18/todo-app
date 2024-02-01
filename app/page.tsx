import Image from "next/image";
import prisma from "@/lib/prisma";

export default async function Home() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "asc" },
  });

  return <main className="">{JSON.stringify(todos)}</main>;
}
