import express from "express";
import { errorHandler } from "./shared/middleware/errorHandler";
import userRoutes from "./modules/user/user.routes";
import { userController, workspaceController } from "./container";
import workspaceRoutes from "./modules/workspace/workspace.routes";
const app = express();

app.use(express.json());

app.use("/api/v1/users", userRoutes(userController));
app.use("/api/v1/workspace", workspaceRoutes(workspaceController));


app.use(errorHandler);

app.get("/health", (req, res) => {
  res.send("Express + TypeScript is running 🚀");
});

export default app;
