import express from "express";
import { myEventsRouter } from "./my-events";

const meRouter = express.Router();
meRouter.use(myEventsRouter)
export { meRouter };
