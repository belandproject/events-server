import express from "express";
import { eventsRouter } from "./events";

const apiRouter = express.Router();

apiRouter.use("/events", eventsRouter);

export { apiRouter };
