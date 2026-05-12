import { PrismaClient } from "@prisma/client";
import { WorkspaceRepository } from "./workspace.repository";
import { generateSlug } from "../../shared/utils/generateSlug";
import { CreateWorkspaceDTO } from "./workspace.types";

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
}
