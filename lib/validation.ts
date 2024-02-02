import { z } from "zod";
import { TodoStatus } from "@prisma/client";

const requiredString = z.string().min(1, "Required");

const nameSchema = z
  .object({
    firstName: z.string().max(30).optional(),
    lastName: z.string().max(30).optional(),
  })
  .refine((data) => (data.firstName && data.lastName) || !(data.firstName || data.lastName), {
    message: "First and last name required, or neither",
    path: ["firstName"],
  });

export const $CreateTodo = z
  .object({
    text: requiredString.max(100),
  })
  .and(nameSchema);

export type CreateTodo = z.infer<typeof $CreateTodo>;

export const $EditTodo = z
  .object({
    status: z.nativeEnum(TodoStatus),
  })
  .and($CreateTodo);

export type EditTodo = z.infer<typeof $EditTodo>;

export const $FilterSchema = z.object({
  q: z.string().optional(),
  status: z.nativeEnum(TodoStatus).optional().or(z.literal("")),
  hasName: z.coerce.boolean().optional(),
});

export type FilterSchema = z.infer<typeof $FilterSchema>;
