import z from "zod";
import { CreateWorkspaceSchema } from "./workspace.validation";

export type CreateWorkspaceDTO = z.infer<typeof CreateWorkspaceSchema>;
