import { eachSeries } from "async";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ValidationChain } from "express-validator";
import { ParsedQs } from "qs";

export type ExpressPromiseHandler = (
  req: Request<any>,
  res: Response,
  next: NextFunction
) => Promise<any>;

export type RequestPromiseHandler = ValidationChain | ExpressPromiseHandler;

export function asyncMiddleware(
  fun: RequestPromiseHandler | RequestPromiseHandler[]
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (Array.isArray(fun) === true) {
      return eachSeries(
        fun as RequestHandler[],
        (
          f: (
            arg0: Request<
              ParamsDictionary,
              any,
              any,
              ParsedQs,
              Record<string, any>
            >,
            arg1: Response<any, Record<string, any>>,
            arg2: (err: any) => any
          ) => any,
          cb: (arg0: any) => any
        ) => {
          Promise.resolve(f(req, res, (err: any) => cb(err))).catch((err) =>
            next(err)
          );
        },
        next
      );
    }

    return Promise.resolve((fun as RequestHandler)(req, res, next)).catch(
      (err) => next(err)
    );
  };
}
