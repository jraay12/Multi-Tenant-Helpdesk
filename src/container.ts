import { UserRepository } from "./modules/user/user.repository";
import { UserService } from "./modules/user/user.service";
import { UserController } from "./modules/user/user.controller";
import { WorkspaceRepository } from "./modules/workspace/workspace.repository";
import { WorkspaceController } from "./modules/workspace/workspace.controller";
import { WorkspaceService } from "./modules/workspace/workspace.service";

import { prisma } from "./lib/prisma";

// repository
export const userRepo = new UserRepository(prisma)
const workspaceRepo = new WorkspaceRepository(prisma)

// services
const userService = new UserService(userRepo)
const workspaceService = new WorkspaceService(workspaceRepo, prisma)

// controller
export const userController = new UserController(userService)
export const workspaceController = new WorkspaceController(workspaceService)
