import {
  PrismaClient,
  Workspace,
  Prisma,
  WorkspaceMember,
  PrismaClient as PrismaClientType,
} from "@prisma/client";


type PrismaTx = Prisma.TransactionClient

export class WorkspaceRepository {
  constructor(private prisma: PrismaClientType) {}

  async save(data: Prisma.WorkspaceCreateInput, tx?: PrismaTx): Promise<Workspace> {
    const client = tx ?? this.prisma
    return await client.workspace.create({
      data,
    });
  }

  async findById(id: string): Promise<Workspace | null> {
    return await this.prisma.workspace.findUnique({
      where: {
        id,
      },
    });
  }

  async addMember(data: {
    userId: string;
    workspaceId: string;
    role: "OWNER" | "ADMIN" | "AGENT" | "VIEWER";
  }, tx?: PrismaTx): Promise<WorkspaceMember> {
    const client = tx ?? this.prisma
    return client.workspaceMember.create({
      data,
    });
  }
}
