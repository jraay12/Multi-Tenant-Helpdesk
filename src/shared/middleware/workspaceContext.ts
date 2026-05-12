import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      workspaceId?: string;
    }
  }
}

export function workspaceContext(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const workspaceId = req.headers["x-workspace-id"];

  if (!workspaceId || typeof workspaceId !== "string") {
    return res.status(400).json({
      message: "Missing or invalid x-workspace-id header",
    });
  }

  req.workspaceId = workspaceId;

  next();
}