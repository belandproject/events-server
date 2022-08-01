import express from "express";
import UnauthorizedExeption from "../exceptions/UnauthorizedExeption";
import { verify } from "../libs/auth/crypto";

export async function authenticate(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    res.locals.auth = await verify(req);
    res.locals.authenticated = true;
    return next();
  } catch (e) {
    return next(e);
  }
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

export function onlyAdmin(
  _: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (res.locals.auth.user != process.env.ADMIN) {
    return next(new UnauthorizedExeption());
  }
  return next();
}
