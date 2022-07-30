import { NextFunction, Request, Response } from "express";
import { body, param, query } from "express-validator";
import { Attendee } from "../../models/Attendee";
import { Event } from "../../models/Event";
import { paginationValidator, setDefaultPagination } from "../pagination";
import { setDefaultSort } from "../sort";
import { areValidationErrors } from "../util";

const commonVideosValidator = [
  body("name").isString().notEmpty(),
  body("image").isString(),
  body("description").isString().notEmpty(),
  body("schedules.*.start").isDate(),
  body("schedules.*.end").isDate(),
  body("contact").isString(),
  body("details").isString(),
  body("categories.*").isString(),
  body("x").isInt({ min: -150, max: 150 }),
  body("y").isInt({ min: -150, max: 150 }),
  areValidationErrors,
];

export async function doesEventExist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const event = await Event.findByPk(req.params.id);
  if (!event) {
    res.status(404).send({ message: `Event not found` });
    return;
  }
  res.locals.event = event;
  return next();
}

export async function doesAttendeeExist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const attendee = await Attendee.findByPk(req.params.attendeeId);
  if (!attendee) {
    res.status(404).send({ message: `Attendee not found` });
    return;
  }
  res.locals.attendee = attendee;
  return next();
}

export const eventsCreateValidator = [...commonVideosValidator];

export const eventsUpdateValidator = [
  param("id").isString().notEmpty(),
  ...commonVideosValidator,
  doesEventExist,

  async (_: Request, res: Response, next: NextFunction) => {
    const event: Event = res.locals.event;
    if (event.creator != res.locals.auth.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    return next();
  },
];

export const eventsDeleteValidator = [
  param("id").isString().notEmpty(),
  doesEventExist,
  areValidationErrors,
  async (_: Request, res: Response, next: NextFunction) => {
    const event: Event = res.locals.event;
    if (event.creator != res.locals.auth.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    return next();
  },
];

export const eventAttendeeAddValidator = [
  param("id").isString().notEmpty(),
  doesEventExist,
];

export const eventAttendeeDeleteValidator = [
  param("attendeeId").isString().notEmpty(),
  doesAttendeeExist,
  areValidationErrors,
  async (_: Request, res: Response, next: NextFunction) => {
    const attendee: Attendee = res.locals.event;
    if (attendee.user != res.locals.auth.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    return next();
  },
];

export const eventsListValidator = [
  ...paginationValidator,
  query("creator").isString().optional(),
  query("owner").isString().optional(),
  query("sort").isIn(["id:asc", "id:desc"]).default("id:desc").optional(),
  areValidationErrors,
  setDefaultSort,
  setDefaultPagination,
];

export const eventAttendeesListValidator = [
  ...paginationValidator,
  param("id").isString().optional(),
  query("sort").isIn(["id:asc", "id:desc"]).default("id:desc").optional(),
  areValidationErrors,
  setDefaultSort,
  setDefaultPagination,
];
