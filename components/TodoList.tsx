import { FilterSchema } from "@/lib/validation";
import TodoItem from "./TodoItem";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { TodoStatus } from "@prisma/client";

export default async function TodoList({ q, status, hasName }: FilterSchema) {
  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  const searchFilter: Prisma.TodoWhereInput = searchString
    ? {
        OR: [
          { text: { search: searchString } },
          { lastName: { search: searchString } },
          { firstName: { search: searchString } },
        ],
      }
    : {};

  const hasNameFilter: Prisma.TodoWhereInput = hasName
    ? { OR: [{ firstName: { not: null } }, { lastName: { not: null } }] }
    : {};

  const where: Prisma.TodoWhereInput = {
    AND: [searchFilter, hasNameFilter, status ? { status } : {}],
  };

  const todos = await prisma.todo.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex-grow space-y-4">
      {todos.map((todo) => (
        <TodoItem key={todo.id} {...todo} />
      ))}
      {todos.length == 0 && (
        <p className="m-auto text-center">Nothing found. Try adjusting your search filters.</p>
      )}
    </div>
  );
}
