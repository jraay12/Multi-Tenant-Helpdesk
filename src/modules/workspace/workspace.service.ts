import { PrismaClient } from "@prisma/client";
import { WorkspaceRepository } from "./workspace.repository";
import { generateSlug } from "../../shared/utils/generateSlug";
import { CreateWorkspaceDTO } from "./workspace.types";
import { ForbbidenError } from "../../shared/errors/ForbiddenError";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export class WorkspaceService {
  constructor(
    private workspaceRepo: WorkspaceRepository,
    private prisma: PrismaClient,
  ) {}

  async createWorkspace(userId: string, data: CreateWorkspaceDTO) {
    return this.prisma.$transaction(async (tx) => {
      const baseSlug = generateSlug(data.name);

      let slug = baseSlug;
      let counter = 1;

      while (await this.workspaceRepo.findBySlug(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const workspace = await this.workspaceRepo.save(
        {
          name: data.name,
          slug,
          description: data.description
        },
        tx,
      );

      await this.workspaceRepo.addMember(
        {
          userId,
          role: "OWNER",
          workspaceId: workspace.id,
        },
        tx,
      );

      return workspace;
    });
  }

  async getMyWorkspaces(userId: string) {
    const workspaces = await this.workspaceRepo.findByUserId(userId);

    return workspaces;
  }

  async getWorkspaceById(userId: string, workspaceId: string) {
    const member = await this.workspaceRepo.findMember(userId, workspaceId);

    if (!member)
      throw new ForbbidenError(
        "FORBIDDEN: You don't have access to this workspace",
      );

    const workspace = await this.workspaceRepo.findById(workspaceId);

    if (!workspace) throw new NotFoundError("Workspace not found");

    return {
      workspace,
      role: member.role,
    };
  }

  async switchWorkspace(userId: string, workspaceId: string) {
    const workspace = await this.workspaceRepo.findById(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    const member = await this.workspaceRepo.findMember(userId, workspaceId);

    if (!member)
      throw new ForbbidenError(
        "FORBIDDEN: You don't have access to this workspace",
      );

    return {
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
      },
      role: member.role,
    };
  }

  async members(userId: string, workspaceId: string) {
    const workspace = await this.workspaceRepo.findById(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    const member = await this.workspaceRepo.findMember(userId, workspaceId);

    if (!member)
      throw new ForbbidenError(
        "FORBIDDEN: You don't have access to this workspace",
      );

    const workspaceMember = await this.workspaceRepo.findAllMember(workspaceId);
    return workspaceMember;
  }
}
