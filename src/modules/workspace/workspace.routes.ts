import { Router } from "express";
import { WorkspaceController } from "./workspace.controller";
import { mockAuth } from "../../shared/middleware/mockAuth";
import { workspaceContext } from "../../shared/middleware/workspaceContext";
const workspaceRoutes = (workspaceController: WorkspaceController): Router => {
  const routes = Router();

  routes.post("/", mockAuth, workspaceController.createWorkspace);
  routes.get("/members", mockAuth, workspaceContext, workspaceController.members)
  routes.get("/", mockAuth, workspaceController.getMyWorkspace);
  routes.get("/:workspace_id", mockAuth, workspaceController.getWorkspaceById);
  routes.post("/:workspace_id/switch", mockAuth, workspaceController.switchWorkspace);

  return routes;
};

export default workspaceRoutes;
