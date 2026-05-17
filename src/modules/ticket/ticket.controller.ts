import { TicketPriority, TicketStatus } from "@prisma/client";
import { TicketService } from "./ticket.service";
import {
  CreateTicketSchema,
  UpdatePrioritySchema,
  UpdateStatusSchema,
} from "./ticket.validation";
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

  getTicketById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.params as { ticketId: string };
      const ticket = await this.ticketService.getTicketById(
        req.user!.id,
        req.workspaceId!,
        params.ticketId,
      );

      return res.status(200).json({
        data: ticket,
      });
    } catch (err: any) {
      next(err);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const workspaceId = req.workspaceId!;
      const { ticketId } = req.params as { ticketId: string };

      // validate request body
      const { status } = UpdateStatusSchema.parse(req.body);

      const updatedTicket = await this.ticketService.updateTicketStatus(
        userId,
        workspaceId,
        ticketId,
        status as TicketStatus,
      );

      return res.status(200).json({
        message: "Ticket status updated successfully",
        data: updatedTicket,
      });
    } catch (err: any) {
      next(err);
    }
  };

  assignTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.workspaceId!;
      const { ticketId } = req.params as { ticketId: string };
      const { assignedId } = req.body as { assignedId: string };
      const assignTicket = await this.ticketService.assignTickets(
        assignedId,
        workspaceId,
        ticketId,
      );

      return res.status(200).json({
        message: "Ticket assign successfully",
        data: assignTicket,
      });
    } catch (err: any) {
      next(err);
    }
  };

  createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const workspaceId = req.workspaceId!;
      const { ticketId } = req.params as { ticketId: string };
      const { message } = req.body as { message: string };
      const ticketComment = await this.ticketService.createComment(
        ticketId,
        userId,
        workspaceId,
        { message },
      );

      return res.status(200).json({
        message: "Ticket comment successfully added",
        data: ticketComment,
      });
    } catch (err: any) {
      next(err);
    }
  };

  dashboardStatistics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const workspaceId = req.workspaceId!;
      const stats = await this.ticketService.dashboardStatistics(
        userId,
        workspaceId,
      );

      return res.status(200).json({
        data: stats,
      });
    } catch (err: any) {
      next(err);
    }
  };

  recentTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const workspaceId = req.workspaceId!;
      const ticket = await this.ticketService.recentTicket(userId, workspaceId);

      return res.status(200).json({
        data: ticket,
      });
    } catch (err: any) {
      next(err);
    }
  };

  updatePriority = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const workspaceId = req.workspaceId!;
      const { ticketId } = req.params as { ticketId: string };

      // validate request body
      const { priority } = UpdatePrioritySchema.parse(req.body);

      const updatedPriority = await this.ticketService.updatePriority(
        userId,
        workspaceId,
        ticketId,
        priority as TicketPriority,
      );

      return res.status(200).json({
        message: "Ticket priority updated successfully",
        data: updatedPriority,
      });
    } catch (err: any) {
      next(err);
    }
  };
}
