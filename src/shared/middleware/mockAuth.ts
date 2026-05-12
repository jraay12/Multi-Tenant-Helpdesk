import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}
export function mockAuth(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers["x-user-id"];

  if (!userId || typeof userId !== "string") {
    return res.status(401).json({
      message: "Unauthorized: missing x-user-id header",
    });
  }

  (req as any).user = {
    id: userId,
  };

  next();
}