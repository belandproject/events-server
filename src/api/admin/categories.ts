import express from "express";
import { asyncMiddleware } from "../../middlewares";
import { Category } from "../../models/Category";

const adminCategoriesRouter = express.Router();
adminCategoriesRouter.get("/events", asyncMiddleware(listCategories));

export { adminCategoriesRouter };

async function listCategories(req: express.Request, res: express.Response) {
  res.json(
    await Category.listForApi({
      ...req.query,
    } as any)
  );
}
