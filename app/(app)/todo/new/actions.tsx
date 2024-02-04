"use server";

import { CreateTodo } from "@/lib/validation";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createTodo({ text, firstName, lastName }: CreateTodo) {
  await prisma.todo.create({
    data: {
      text: text.trim(),
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
    },
  });

  redirect("/");
}
