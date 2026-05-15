import {
  Prisma,
  PrismaClient as PrismaClientType,
  Ticket,
  TicketComment,
  TicketStatus,
} from "@prisma/client";

type PrismaTx = Prisma.TransactionClient;

export class TicketRepository {
  constructor(private prisma: PrismaClientType) {}

  async save(data: Prisma.TicketCreateInput, tx?: PrismaTx): Promise<Ticket> {
    const client = tx ?? this.prisma;
    return await client.ticket.create({
      data,
    });
  }

  async findById(id: string): Promise<Ticket | null> {
    return await this.prisma.ticket.findUnique({
      where: {
        id,
      },
    });
  }

  async findManyByWorkspace(workspaceId: string): Promise<Ticket[]> {
    return await this.prisma.ticket.findMany({
      where: {
        workspaceId,
      },
      include: {
        assignedTo: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async statusUpdate(
    ticketId: string,
    workspaceId: string,
    status: TicketStatus,
  ) {
    return await this.prisma.ticket.update({
      where: {
        id: ticketId,
        workspaceId,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
  }

  async assignTask(assigneeId: string, ticketId: string) {
    return await this.prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        assignedToId: assigneeId,
      },
    });
  }

  async findByIdAndWorkspace(ticketId: string, workspaceId: string) {
    return await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        workspaceId,
      },
    });
  }

  async createComment(data: Prisma.TicketCommentCreateInput): Promise<TicketComment>  {
    return await this.prisma.ticketComment.create({
      data
    })
  }
}
