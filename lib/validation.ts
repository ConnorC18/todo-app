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
    id: requiredString,
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

const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/);
export const $LogInSchema = z
  .object({
    email: z.string().email().optional().or(z.literal("")),
    phone: z
      .string()
      .regex(phoneRegex, "Invalid Number")
      .min(10)
      .max(10)
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.email || data.phone, {
    message: "Nether Email or Phone number was given",
    path: ["email"],
  })
  .refine((data) => data.email || data.phone, {
    message: "Nether Email or Phone number was given",
    path: ["phone"],
  });

export type LogInSchema = z.infer<typeof $LogInSchema>;
