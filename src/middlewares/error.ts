import express from "express";
import HttpException from "../exceptions/HttpException";

export function errorMiddleware(
  err: HttpException,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).send({
    message,
    status,
  });
}
