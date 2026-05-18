import { PrismaClient, TicketPriority, TicketStatus } from "@prisma/client";
import { WorkspaceRepository } from "../workspace/workspace.repository";
import { TicketRepository } from "./ticket.repository";
import { CreateCommentDTO, CreateTicketDTO } from "./ticket.type";
import { ForbbidenError } from "../../shared/errors/ForbiddenError";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { BadRequestError } from "../../shared/errors/BadRequestError";
import { UserRepository } from "../user/user.repository";
import { getTimeAgo } from "../../shared/utils/getMinutesAgo";

export class TicketService {
  constructor(
    private ticketRepo: TicketRepository,
    private workspaceRepo: WorkspaceRepository,
    private userRepo: UserRepository,
    private prisma: PrismaClient,
  ) {}

  async createTicket(
    userId: string,
    workspaceId: string,
    data: CreateTicketDTO,
  ) {
    const workspace = await this.workspaceRepo.findById(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    // validate membership
    const member = await this.workspaceRepo.findMember(userId, workspaceId);

    if (!member) {
      throw new ForbbidenError("Unauthorized workspace access");
    }

    return this.ticketRepo.save({
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority ?? "MEDIUM",
      customer_name: data.customer_name,
      workspace: {
        connect: {
          id: workspaceId,
        },
      },
      createdBy: {
        connect: {
          id: userId,
        },
      },
    });
  }

  async getTickets(userId: string, workspaceId: string) {
    const member = await this.workspaceRepo.findMember(userId, workspaceId);

    if (!member) {
      throw new ForbbidenError("Unauthorized workspace access");
    }

    return this.ticketRepo.findManyByWorkspace(workspaceId);
  }

  async getTicketById(userId: string, workspaceId: string, ticketId: string) {
    const member = await this.workspaceRepo.findMember(userId, workspaceId);

    if (!member) {
      throw new ForbbidenError("Unauthorized workspace access");
    }

    const ticket = await this.ticketRepo.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    if (ticket.workspaceId !== workspaceId) {
      throw new ForbbidenError("Unauthorized ticket access");
    }

    return ticket;
  }

  async updateTicketStatus(
    userId: string,
    workspaceId: string,
    ticketId: string,
    status: TicketStatus,
  ) {
    // 1. Validate workspace membership
    const member = await this.workspaceRepo.findMember(userId, workspaceId);

    if (!member) {
      throw new Error("Unauthorized workspace access");
    }

    // 2. Validate ticket exists inside workspace
    const ticket = await this.ticketRepo.findById(ticketId);

    if (!ticket || ticket.workspaceId !== workspaceId) {
      throw new NotFoundError("Ticket not found");
    }

    // 3. Optional: prevent invalid transitions (SaaS rule)
    if (ticket.status === "CLOSED") {
      throw new BadRequestError("Cannot update a closed ticket");
    }

    // 4. Update status
    return this.ticketRepo.statusUpdate(ticketId, workspaceId, status);
  }

  async assignTickets(
    assigneeId: string,
    workspaceId: string,
    ticketId: string,
  ) {
    const userExist = await this.userRepo.findById(assigneeId);
    if (!userExist) throw new NotFoundError("User not found");

    const member = await this.workspaceRepo.findMember(assigneeId, workspaceId);
    if (!member) throw new ForbbidenError("Unauthorized workspace access");

    const ticketExist = await this.ticketRepo.findById(ticketId);
    if (!ticketExist) throw new NotFoundError("Ticket not found");

    // 3. Optional: prevent invalid transitions (SaaS rule)
    if (ticketExist.status === "CLOSED") {
      throw new BadRequestError("Cannot update a closed ticket");
    }

    return await this.ticketRepo.assignTask(assigneeId, ticketId);
  }

  async createComment(
    ticketId: string,
    userId: string,
    workspaceId: string,
    data: CreateCommentDTO,
  ) {
    const ticketExist = await this.ticketRepo.findByIdAndWorkspace(
      ticketId,
      workspaceId,
    );
    if (!ticketExist) throw new NotFoundError("Ticket not found");

    const member = await this.workspaceRepo.findMember(
      userId,
      ticketExist.workspaceId,
    );

    if (!member) {
      throw new ForbbidenError("Unauthorized workspace access");
    }

    return await this.ticketRepo.createComment({
      message: data.message,
      ticket: {
        connect: {
          id: ticketId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    });
  }

  async dashboardStatistics(userId: string, workspaceId: string) {
    const workspace = await this.workspaceRepo.findById(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    const member = await this.workspaceRepo.findMember(userId, workspaceId);

    if (!member) {
      throw new ForbbidenError("Unauthorized workspace access");
    }

    return await this.ticketRepo.ticketStatistics(workspaceId);
  }

  async recentTicket(userId: string, workspaceId: string) {
    const workspace = await this.workspaceRepo.findById(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    const member = await this.workspaceRepo.findMember(userId, workspaceId);

    if (!member) {
      throw new ForbbidenError("Unauthorized workspace access");
    }
    const tickets = await this.ticketRepo.recentTickets(workspaceId);

    const formatted = tickets.map((ticket) => ({
      ...ticket,
      timeAgo: getTimeAgo(ticket.createdAt),
    }));

    return formatted;
  }

  async updatePriority(
    userId: string,
    workspaceId: string,
    ticketId: string,
    priority: TicketPriority,
  ) {
    // 1. Validate workspace membership
    const member = await this.workspaceRepo.findMember(userId, workspaceId);

    if (!member) {
      throw new Error("Unauthorized workspace access");
    }

    // 2. Validate ticket exists inside workspace
    const ticket = await this.ticketRepo.findById(ticketId);

    if (!ticket || ticket.workspaceId !== workspaceId) {
      throw new NotFoundError("Ticket not found");
    }

    // 4. Update status
    return this.ticketRepo.priorityUpdate(ticketId, workspaceId, priority);
  }

  async getTicketComment(
    userId: string,
    workspaceId: string,
    ticketId: string,
  ) {
    // 1. Validate workspace membership
    const member = await this.workspaceRepo.findMember(userId, workspaceId);

    if (!member) {
      throw new Error("Unauthorized workspace access");
    }

    // 2. Validate ticket exists inside workspace
    const ticket = await this.ticketRepo.findById(ticketId);

    if (!ticket || ticket.workspaceId !== workspaceId) {
      throw new NotFoundError("Ticket not found");
    }

    const comments = await this.ticketRepo.ticketComment(ticketId);

    const {description, customer_name, ...record} = ticket

    const formattedComments = comments.map(({ ticket, ...comment }) => comment);

    return {
      ticket: {
        description,
        customer_name
      },
      comments: formattedComments,
    };
  }
}
