import express from "express";
import { errorHandler } from "./shared/middleware/errorHandler";
const app = express();

app.use(express.json());

app.use(errorHandler)

app.get("/health", (req, res) => {
  res.send("Express + TypeScript is running 🚀");
});

export default app