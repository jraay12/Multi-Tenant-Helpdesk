import {
  Prisma,
  PrismaClient as PrismaClientType,
  Ticket,
  TicketComment,
  TicketPriority,
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
      include: {
        assignedTo: {
          select: {
            name: true,
          },
        },
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
            name: true,
          },
        },
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

  async createComment(
    data: Prisma.TicketCommentCreateInput,
  ): Promise<TicketComment> {
    return await this.prisma.ticketComment.create({
      data,
    });
  }

  async ticketStatistics(workspaceId: string) {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const weekStart = new Date();

    weekStart.setDate(weekStart.getDate() - 7);

    const [statusCounts, openToday, inProgressToday, resolvedThisWeek] =
      await Promise.all([
        this.prisma.ticket.groupBy({
          by: ["status"],
          where: {
            workspaceId,
          },
          _count: {
            status: true,
          },
        }),

        this.prisma.ticket.count({
          where: {
            workspaceId,
            status: "OPEN",
            createdAt: {
              gte: today,
            },
          },
        }),

        this.prisma.ticket.count({
          where: {
            workspaceId,
            status: "IN_PROGRESS",
            createdAt: {
              gte: today,
            },
          },
        }),

        this.prisma.ticket.count({
          where: {
            workspaceId,
            status: "RESOLVED",
            updatedAt: {
              gte: weekStart,
            },
          },
        }),
      ]);

    const formatted = {
      OPEN: {
        total: 0,
        today: openToday,
      },

      IN_PROGRESS: {
        total: 0,
        today: inProgressToday,
      },

      RESOLVED: {
        total: 0,
        thisWeek: resolvedThisWeek,
      },

      CLOSED: {
        total: 0,
      },
    };

    statusCounts.forEach((item) => {
      formatted[item.status].total = item._count.status;
    });

    return formatted;
  }

  async recentTickets(workspaceId: string) {
    return await this.prisma.ticket.findMany({
      where: {
        workspaceId,
      },
      select: {
        title: true,
        status: true,
        category: true,
        customer_name: true,
        createdAt: true,
        priority: true,
        id: true,
        assignedTo: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });
  }

  async priorityUpdate(
    ticketId: string,
    workspaceId: string,
    priority: TicketPriority,
  ) {
    return await this.prisma.ticket.update({
      where: {
        id: ticketId,
        workspaceId,
      },
      data: {
        priority,
        updatedAt: new Date(),
      },
    });
  }
}
