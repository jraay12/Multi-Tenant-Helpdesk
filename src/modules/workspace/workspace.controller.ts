import { Request, Response, NextFunction } from "express";
import { CreateWorkspaceSchema } from "./workspace.validation";
import { WorkspaceService } from "./workspace.service";

export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  createWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {name} = CreateWorkspaceSchema.parse(req.body)
      const userId = req.user!.id;
      const result = await this.workspaceService.createWorkspace(userId, {name});
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
}
