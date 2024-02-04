import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import EditTodoForm from "./EditTodoForm";
import { auth } from "@/auth";

type Props = {
  params: { slug: string };
};

// Separated cached function because it's need it in 2 places:
const getTodo = cache(async (slug: string) => {
  const todo = await prisma.todo.findUnique({
    where: { id: slug },
  });

  if (!todo) notFound();

  return todo;
});

// For static render
export async function generateStaticParams() {
  const todos = await prisma.todo.findMany({
    select: { id: true },
  });

  return todos.map(({ id }) => id);
}

// For dynamic metadata, like page title
export async function generateMetadata({ params: { slug } }: Props): Promise<Metadata> {
  const todo = await getTodo(slug);

  return {
    title: todo.text,
  };
}

export default async function Page({ params: { slug } }: Props) {
  const session = await auth();
  return <div>{JSON.stringify(session)}</div>;

  const todo = await getTodo(slug);

  return <EditTodoForm {...todo} />;
}
