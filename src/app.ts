import http from "node:http";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import MongoDb from "./db/mongodb";
import noteRouter from "./routes/file";
import { PORT, NODE_ENV, CORS } from "./constants";
import { StatusCodes } from "http-status-codes";
import DigitalOcean from "./api/digitalOcean";
import Tasks from "./tasks";

(async () => {
  console.log(NODE_ENV, "mode");
  console.log("allowing hosts:", CORS);
  const db = new MongoDb();
  await db.connect();
  const tasks = new Tasks(db);
  const digitalOcean = new DigitalOcean();
  const app = express();

  app.use(morgan("dev"));
  app.use(helmet());
  app.options("/{*splat}", cors());
  app.use(
    cors({
      origin: CORS,
    })
  );
  app.use(express.json({ limit: "100mb" }));
  app.use((req, res, next) => {
    res.locals.db = db;
    res.locals.api = { digitalOcean };
    next();
  });

  app.use("/api/file", noteRouter);
  app.all("/{*splat}", (req, res) => {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "Not found" });
  });

  http.createServer(app).listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });

  await tasks.initialize();
})();
