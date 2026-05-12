import { Router } from "express"
import { WorkspaceController } from "./workspace.controller"
import { mockAuth } from "../../shared/middleware/mockAuth"
const workspaceRoutes = (workspaceController: WorkspaceController): Router => {
  const routes = Router()

  routes.post("/", mockAuth, workspaceController.createWorkspace)
  
  return routes

}

export default workspaceRoutes