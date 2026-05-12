import { TicketService } from "./ticket.service";
import { CreateTicketSchema } from "./ticket.validation";
import { Request, Response, NextFunction } from "express";

export class TicketController {
  constructor(private ticketService: TicketService) {}

  createTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateTicketSchema.parse(req.body);

      const ticket = await this.ticketService.createTicket(
        req.user!.id,
        req.workspaceId!,
        parsed,
      );

      return res.status(201).json({
        message: "Ticket created successfully",
        data: ticket,
      });
    } catch (err: any) {
      next(err);
    }
  };

  getTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await this.ticketService.getTickets(
        req.user!.id,
        req.workspaceId!,
      );

      return res.status(200).json({
        data: ticket,
      });
    } catch (err: any) {
      next(err);
    }
  };
}
