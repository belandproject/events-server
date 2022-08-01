import express from "express";
import { categoriesListValidator } from "../../validators";
import { asyncMiddleware, authenticate, onlyAdmin } from "../../middlewares";
import { Category } from "../../models/Category";

const categoriesRouter = express.Router();
categoriesRouter.get(
  "/",
  categoriesListValidator,
  asyncMiddleware(listCategories)
);

categoriesRouter.post(
  "/",
  authenticate,
  onlyAdmin,
  asyncMiddleware(createCategory)
);

categoriesRouter.put(
  "/:id",
  authenticate,
  onlyAdmin,
  asyncMiddleware(updateCategory)
);

categoriesRouter.delete(
  "/:id",
  authenticate,
  onlyAdmin,
  asyncMiddleware(deleteCategory)
);

export { categoriesRouter };

async function listCategories(req: express.Request, res: express.Response) {
  res.json(await Category.listForApi({ ...req.query, isActive: true } as any));
}

async function createCategory(req: express.Request, res: express.Response) {
  res.json(await Category.create(req.body));
}

async function updateCategory(req: express.Request, res: express.Response) {
  res.json(await Category.update(req.body, { where: { id: req.params.id } }));
}

async function deleteCategory(req: express.Request, res: express.Response) {
  res.json(await Category.destroy({ where: { id: req.params.id } }));
}
