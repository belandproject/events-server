import express from 'express'

function setDefaultSortFactory(sort: string) {
  return (
    req: express.Request,
    _: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.query.sort) req.query.sort = sort;

    return next();
  };
}

export const setDefaultSort = setDefaultSortFactory('-createdAt')
