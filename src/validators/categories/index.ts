import { query } from "express-validator";
import {
  paginationValidator,
  setDefaultPagination,
  setDefaultSort,
} from "../../middlewares";
import { areValidationErrors } from "../../middlewares/util";

export const categoriesListValidator = [
  ...paginationValidator,
  query("sort").isIn(["-id", "id"]).optional(),
  query("id").isString().optional(),
  areValidationErrors,
  setDefaultSort,
  setDefaultPagination,
];
