import { PrismaClient } from "@prisma/client";
import { WorkspaceRepository } from "./workspace.repository";
import { generateSlug } from "../../shared/utils/generateSlug";
import { CreateWorkspaceDTO } from "./workspace.types";

export class WorkspaceService {
  constructor(private workspaceRepo: WorkspaceRepository, private prisma: PrismaClient){}


  async createWorkspace(userId: string, data: CreateWorkspaceDTO) {
    return this.prisma.$transaction(async (tx) => {
      const slug = generateSlug(data.name)

      const workspace = await this.workspaceRepo.save({
        name: data.name,
        slug
      }, tx)

      await this.workspaceRepo.addMember({
        userId,
        role: "OWNER",
        workspaceId: workspace.id
      }, tx)

      return workspace
    })
  }
}