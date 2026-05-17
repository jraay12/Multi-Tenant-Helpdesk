import { z } from "zod";

export const CreateTicketSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),

  description: z.string().max(1000, "Description too long").optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  category: z.string().max(1000, "Description too long").optional(),
  customer_name: z.string().trim(),
});

export const UpdateStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

export const CreateCommentSchema = z.object({
  message: z.string().min(1).max(1000),
});

export const UpdatePrioritySchema = z.object({
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});