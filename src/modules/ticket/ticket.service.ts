import { PrismaClient } from "@prisma/client";
import { WorkspaceRepository } from "../workspace/workspace.repository";
import { TicketRepository } from "./ticket.repository";
import { CreateTicketDTO } from "./ticket.type";
import { ForbbidenError } from "../../shared/errors/ForbiddenError";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export class TicketService {
  constructor(
    private ticketRepo: TicketRepository,
    private workspaceRepo: WorkspaceRepository,
    private prisma: PrismaClient,
  ) {}

  async createTicket(
    userId: string,
    workspaceId: string,
    data: CreateTicketDTO,
  ) {

    const workspace = await this.workspaceRepo.findById(workspaceId)
    if(!workspace) throw new NotFoundError("Workspace not found")

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
      workspace: {
        connect: {
          id: workspaceId
        }
      },
      createdBy: {
        connect: {
          id: userId
        }
      }
    });
  }

  async getTickets(
    userId: string,
    workspaceId: string
  ) {
    const member = await this.workspaceRepo.findMember(
      userId,
      workspaceId
    );

    if (!member) {
      throw new ForbbidenError("Unauthorized workspace access");
    }

    return this.ticketRepo.findManyByWorkspace(
      workspaceId
    );
  }

  async getTicketById(
    userId: string,
    workspaceId: string,
    ticketId: string
  ) {
    const member = await this.workspaceRepo.findMember(
      userId,
      workspaceId
    );

    if (!member) {
      throw new ForbbidenError("Unauthorized workspace access");
    }

    const ticket = await this.ticketRepo.findById(
      ticketId
    );

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    if (ticket.workspaceId !== workspaceId) {
      throw new ForbbidenError("Unauthorized ticket access");
    }

    return ticket;
  }
}
