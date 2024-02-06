import { z } from "zod";
import { TodoStatus } from "@prisma/client";

const numberRegex = new RegExp(/^[0-9]*$/);

const requiredString = z.string().min(1, "Required");

const requiredPhoneNumber = z
  .string()
  .transform((str) => str.trim().replaceAll(" ", ""))
  .refine((data) => numberRegex.test(data), "Invalid Number")
  .refine((data) => data.length === 10, { message: "Must be exactly 10 digits long." })
  .refine((data) => data.startsWith("07"), { message: "Needs to start with 07..." });

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

export const $LogInSchema = z
  .object({
    code: z.string().regex(numberRegex, "Invalid Number").max(4).optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: requiredPhoneNumber.optional().or(z.literal("")),
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
