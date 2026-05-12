import { Router } from "express"
import { TicketController } from "./ticket.controller"
import { mockAuth } from "../../shared/middleware/mockAuth"
import { workspaceContext } from "../../shared/middleware/workspaceContext"

const ticketRoute = (ticketController: TicketController): Router => {
  const routes = Router()

  routes.post("/", mockAuth, workspaceContext, ticketController.createTicket)
  routes.get("/", mockAuth, workspaceContext, ticketController.getTickets)
  routes.get("/:ticketId", mockAuth, workspaceContext, ticketController.getTicketById)

  return routes

}

export default ticketRoute