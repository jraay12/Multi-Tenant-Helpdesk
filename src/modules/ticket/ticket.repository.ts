import {
  Prisma,
  PrismaClient as PrismaClientType,
  Ticket,
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
}
