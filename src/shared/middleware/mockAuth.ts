import { Request, Response, NextFunction } from "express";
import { userRepo } from "../../container";
import { UnAuthorized } from "../errors/UnAuthorized";
import jwt from "jsonwebtoken"

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
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized: missing or invalid Authorization header",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as { userId: string; email: string };

    const user = await userRepo.findById(decoded.userId);

    if (!user) {
      throw new UnAuthorized("Unauthorized: user not found");
    }

    (req as any).user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized: invalid or expired token",
    });
  }
}