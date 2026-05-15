import { Request, Response, NextFunction } from "express";
import { CreateWorkspaceSchema } from "./workspace.validation";
import { WorkspaceService } from "./workspace.service";

export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  createWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = CreateWorkspaceSchema.parse(req.body);
      const userId = req.user!.id;
      const result = await this.workspaceService.createWorkspace(userId, {
        name,
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getMyWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const result = await this.workspaceService.getMyWorkspaces(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getWorkspaceById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const { workspace_id } = req.params as { workspace_id: string };
      const result = await this.workspaceService.getWorkspaceById(
        userId,
        workspace_id,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  switchWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { workspace_id } = req.params as { workspace_id: string };
      const result = await this.workspaceService.switchWorkspace(
        userId,
        workspace_id,
      );
      return res.json({
        message: "Workspace switched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  members = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.workspaceId!;
      const userId = req.user!.id;
      const result = await this.workspaceService.members(userId, workspaceId);
      return res.json({
        message: "Fetch workspace members",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
