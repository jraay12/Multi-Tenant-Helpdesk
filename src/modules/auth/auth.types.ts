import z from "zod";
import { loginUserSchema } from "./auth.validation";


export type LoginUserDTO = z.infer<typeof loginUserSchema>;
