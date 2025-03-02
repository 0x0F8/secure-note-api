import http from "node:http";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import MongoDb from "./db/mongodb";
import noteRouter from "./routes/note";
import { PORT, NODE_ENV, CORS } from "./constants";
import { StatusCodes } from "http-status-codes";

(async () => {
  console.log(NODE_ENV, "mode");
  console.log("allowing hosts:", CORS);
  const db = new MongoDb();
  await db.connect();
  const app = express();

  app.use(morgan("dev"));
  app.use(helmet());
  app.options("/{*splat}", cors());
  app.use(
    cors({
      origin: CORS,
    })
  );
  app.use(express.json());
  app.use((req, res, next) => {
    res.locals.db = db;
    next();
  });

  app.use("/api/note", noteRouter);
  app.all("/{*splat}", (req, res) => {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "Not found" });
  });

  http.createServer(app).listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
})();
