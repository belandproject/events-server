import { query } from "express-validator";
import { areValidationErrors } from "./util";
import express from "express";

export const paginationValidator = [
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Should have a number offset"),

  query("limit")
    .optional()
    .isInt({ min: 0, max: 1000 })
    .withMessage(`Should have a number count (max: 1000)`),

  areValidationErrors,
];

export function setDefaultPagination(
  req: express.Request,
  _: express.Response,
  next: express.NextFunction
) {
  const query = req.query as any;

  if (!query.offset) query.offset = 0;
  else query.offset = parseInt(query.offset, 10);

  if (!query.limit) query.limit = 30;
  else query.limit = parseInt(query, 10);

  return next();
}
