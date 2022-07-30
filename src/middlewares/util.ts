import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export async function areValidationErrors(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      message:
        "Incorrect request parameters: " +
        Object.keys(errors.mapped()).join(", "),
      instance: req.originalUrl,
      data: errors.mapped(),
    });

    return;
  }

  return next();
}
