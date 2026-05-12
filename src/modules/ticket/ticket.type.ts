import { z } from "zod";
import { CreateTicketSchema } from "./ticket.validation";

export type CreateTicketDTO = z.infer<typeof CreateTicketSchema>;