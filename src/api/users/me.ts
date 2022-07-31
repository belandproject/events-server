import express from "express";
import { authenticate } from "../../middlewares";
import { myEventsRouter } from "./my-events";

const meRouter = express.Router();
meRouter.use(authenticate, myEventsRouter)
export { meRouter };
