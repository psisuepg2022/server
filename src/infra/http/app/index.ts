import "reflect-metadata";
import "express-async-errors";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { errorHandlerMiddleware } from "@middlewares/errorHandlerMiddleware";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(errorHandlerMiddleware);

process.on("SIGTERM", () => {
  process.exit();
});

export { app };
