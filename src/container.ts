import { UserRepository } from "./modules/user/user.repository";
import { UserService } from "./modules/user/user.service";
import { UserController } from "./modules/user/user.controller";
import { prisma } from "./lib/prisma";

// repository
const userRepo = new UserRepository(prisma)

// services
const userService = new UserService(userRepo)

// controller
export const userController = new UserController(userService)
