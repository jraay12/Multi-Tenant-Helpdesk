import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),

  email: z.email("Invalid email format"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100)
    
});