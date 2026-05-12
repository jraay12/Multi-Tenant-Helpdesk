import { Request, Response, NextFunction } from "express";
import { userRepo } from "../../container";
import { UnAuthorized } from "../errors/UnAuthorized";
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}
export async function mockAuth(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers["x-user-id"];

  if (!userId || typeof userId !== "string") {
    return res.status(401).json({
      message: "Unauthorized: missing x-user-id header",
    });
  }

  const user = await userRepo.findById(userId);
  if (!user) {
    throw new UnAuthorized("Unauthorized: user not found")
  }

  (req as any).user = {
    id: userId,
  };

  next();
}