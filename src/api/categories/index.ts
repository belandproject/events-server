import express from "express";
import { Category } from "../../models/Category";

const categoriesRouter = express.Router();
categoriesRouter.get("/", listCategories);

export { categoriesRouter };

async function listCategories(req: express.Request, res: express.Response) {
  res.json(await Category.listForApi(req.query as any));
}
