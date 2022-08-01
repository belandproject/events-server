import express from "express";
import { authenticate, onlyAdmin } from "../middlewares";
import { adminRouter } from "./admin";
import { categoriesRouter } from "./categories";
import { eventsRouter } from "./events";
import { meRouter } from "./users/me";

const apiRouter = express.Router();

apiRouter.use("/events", eventsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/me", authenticate, meRouter);
apiRouter.use("/admin", authenticate, onlyAdmin, adminRouter);

export { apiRouter };
