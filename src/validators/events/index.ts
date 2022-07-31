import { NextFunction, Request, Response } from "express";
import { body, param, query } from "express-validator";
import AttendeeNotFoundExeption from "../../exceptions/AttendeeNotFoundExeption";
import EventNotFoundExeption from "../../exceptions/EventNotFoundExeption";
import UnauthorizedExeption from "../../exceptions/UnauthorizedExeption";
import { Attendee } from "../../models/Attendee";
import { Event } from "../../models/Event";
import {
  setDefaultSort,
  paginationValidator,
  setDefaultPagination,
} from "../../middlewares";
import { areValidationErrors } from "../../middlewares/util";

const commonEventsValidator = [
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
    return next(new EventNotFoundExeption(req.params.id as string));
  }
  res.locals.event = event;
  return next();
}

export async function doesAttendeeExist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const attendeeId: number = req.params.attendeeId as unknown as number;
  const attendee = await Attendee.findByPk(attendeeId);
  if (!attendee) {
    return next(new AttendeeNotFoundExeption(attendeeId));
  }
  res.locals.attendee = attendee;
  return next();
}

export const eventsCreateValidator = [...commonEventsValidator];

export const eventsUpdateValidator = [
  param("id").isString().notEmpty(),
  ...commonEventsValidator,
  doesEventExist,

  async (_: Request, res: Response, next: NextFunction) => {
    const event: Event = res.locals.event;
    if (event.creator != res.locals.auth.user) {
      return next(new UnauthorizedExeption());
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
      return next(new UnauthorizedExeption());
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
      return next(new UnauthorizedExeption());
    }
    return next();
  },
];

export const eventsListValidator = [
  ...paginationValidator,
  query("creator").isString().optional(),
  query("owner").isString().optional(),
  query("sort").isIn(["id", "-id"]).optional(),
  query("id").isString().optional(),
  query("category").isString().optional(),
  query("trending").isBoolean().optional(),
  query("highlighted").isBoolean().optional(),
  areValidationErrors,
  setDefaultSort,
  setDefaultPagination,
];

export const eventAttendeesListValidator = [
  ...paginationValidator,
  param("id").isString().optional(),
  query("user").isString().optional(),
  query("sort").isIn(["id", "-id"]).optional(),
  areValidationErrors,
  setDefaultSort,
  setDefaultPagination,
];

export const eventGetValidator = [
  param("id").isUUID().notEmpty(),
  areValidationErrors,
  doesEventExist
]
