import {
  PrismaClient,
  Workspace,
  Prisma,
  WorkspaceMember,
  PrismaClient as PrismaClientType,
} from "@prisma/client";

type PrismaTx = Prisma.TransactionClient;

export class WorkspaceRepository {
  constructor(private prisma: PrismaClientType) {}

  async save(
    data: Prisma.WorkspaceCreateInput,
    tx?: PrismaTx,
  ): Promise<Workspace> {
    const client = tx ?? this.prisma;
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

  async findBySlug(slug: string, tx?: PrismaTx): Promise<Workspace | null> {
    const client = tx ?? this.prisma;
    return await client.workspace.findUnique({
      where: {
        slug,
      },
    });
  }

  async addMember(
    data: {
      userId: string;
      workspaceId: string;
      role: "OWNER" | "ADMIN" | "AGENT" | "VIEWER";
    },
    tx?: PrismaTx,
  ): Promise<WorkspaceMember> {
    const client = tx ?? this.prisma;
    return await client.workspaceMember.create({
      data,
    });
  }

  async findByUserId(userId: string): Promise<Workspace[]> {
    return await this.prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
  }

  async findMember(userId: string, workspaceId: string) {
    return await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
  }

  async findAllMember(workspaceId: string) {
    return await this.prisma.workspaceMember.findMany({
      where: {
        workspaceId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
  }
}
