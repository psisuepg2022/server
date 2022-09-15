import "reflect-metadata";
import "express-async-errors";
import "@containers/index";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import path from "path";

import { RoutesPrefix } from "@common/RoutesPrefix";
import { env } from "@helpers/env";
import {
  errorHandlerMiddleware,
  internationalizationMiddleware,
  isSupportMiddleware,
} from "@middlewares/index";
import { routes } from "@routes/index";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const xss = require("xss-clean");

const app = express();

app.use(helmet());
app.use(cors({ origin: env("LIST_ALLOWED_ORIGINS")?.split(",") }));
app.use(express.json({ limit: "10kb" }));
app.use(xss());
app.use(hpp());
app.use(internationalizationMiddleware);
app.use(RoutesPrefix.API, routes);
app.use(
  "/logs/:support",
  isSupportMiddleware,
  express.static(path.join(__dirname, "..", "..", "..", "..", "log", "db"))
);
app.use(errorHandlerMiddleware);

process.on("SIGTERM", () => {
  process.exit();
});

export { app };
