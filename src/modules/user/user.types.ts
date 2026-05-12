import { createUserSchema } from "./user.validation";
import z from "zod";

export type CreateUserDTO = z.infer<typeof createUserSchema>;
