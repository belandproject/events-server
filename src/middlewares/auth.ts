import express from "express";
import { verify } from "../libs/auth/crypto";

export async function authenticate(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.locals.auth = await verify(req);
  res.locals.authenticated = true;
  return next();
}

export function optionalAuthenticate(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.header("authorization")) return authenticate(req, res, next);

  res.locals.authenticated = false;

  return next();
}
