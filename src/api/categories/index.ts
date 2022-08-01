import express from "express";
import { categoriesListValidator } from "src/validators";
import { asyncMiddleware } from "../../middlewares";
import { Category } from "../../models/Category";

const categoriesRouter = express.Router();
categoriesRouter.get(
  "/",
  categoriesListValidator,
  asyncMiddleware(listCategories)
);

export { categoriesRouter };

async function listCategories(req: express.Request, res: express.Response) {
  res.json(await Category.listForApi(req.query as any));
}
