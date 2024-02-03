"use server";

import prisma from "@/lib/prisma";
import { Todo } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type FormState = { error?: string } | undefined;

export async function editTodo({
  id,
  text,
  firstName,
  lastName,
  status,
}: Todo): Promise<FormState> {
  try {
    await prisma.todo.update({
      where: { id },
      data: { text, firstName, lastName, status },
    });

    revalidatePath("/");
  } catch (e) {
    let message = "Unexpected error";
    if (e instanceof Error) message = e.message;
    return { error: message };
  }
}

export async function deleteTodo(prevState: any, formData: FormData): Promise<FormState> {
  try {
    const id = formData.get("id") as string;

    await prisma.todo.delete({
      where: { id },
    });

    revalidatePath("/");
  } catch (e) {
    let message = "Unexpected error";
    if (e instanceof Error) message = e.message;
    return { error: message };
  }

  redirect("/");
}
