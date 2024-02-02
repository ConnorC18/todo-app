import { z } from "zod";
import { TodoStatus } from "@prisma/client";

export const $FilterSchema = z.object({
  q: z.string().optional(),
  status: z.nativeEnum(TodoStatus).optional().or(z.literal("")),
  hasName: z.coerce.boolean().optional(),
});

export type FilterSchema = z.infer<typeof $FilterSchema>;
