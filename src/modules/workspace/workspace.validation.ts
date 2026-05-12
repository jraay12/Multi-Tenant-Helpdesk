import { z } from "zod";

export const CreateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, "Workspace name must be at least 2 characters")
    .max(50, "Workspace name must be at most 50 characters")
    .trim(),
});