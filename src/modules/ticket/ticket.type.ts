import { z } from "zod";
import { CreateTicketSchema, CreateCommentSchema } from "./ticket.validation";

export type CreateTicketDTO = z.infer<typeof CreateTicketSchema>;
export type CreateCommentDTO = z.infer<typeof CreateCommentSchema>;