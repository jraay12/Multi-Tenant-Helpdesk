import { Router } from "express"
import { AuthController } from "./auth.controller"

const authRoutes = (authController: AuthController): Router => {
  const routes = Router()

  routes.post("/", authController.login)
  
  return routes

}

export default authRoutes