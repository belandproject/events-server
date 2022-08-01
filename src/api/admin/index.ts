import express from "express";
import { adminCategoriesRouter } from "./categories";
import { adminEventsRouter } from "./events";

const adminRouter = express.Router();
adminRouter.use(adminEventsRouter);
adminRouter.use(adminCategoriesRouter);

export { adminRouter };
