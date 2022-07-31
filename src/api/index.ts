import express from "express";
import { categoriesRouter } from "./categories";
import { eventsRouter } from "./events";
import { meRouter } from "./users/me";

const apiRouter = express.Router();

apiRouter.use("/events", eventsRouter);
apiRouter.use("/categories", categoriesRouter)
apiRouter.use("/me", meRouter)

export { apiRouter };
