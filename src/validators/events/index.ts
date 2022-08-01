import { NextFunction, Request, Response } from "express";
import { body, param, query } from "express-validator";
import EventNotFoundExeption from "../../exceptions/EventNotFoundExeption";
import UnauthorizedExeption from "../../exceptions/UnauthorizedExeption";
import { Event, EventStatus, Schedule } from "../../models/Event";
import {
  setDefaultSort,
  paginationValidator,
  setDefaultPagination,
} from "../../middlewares";
import { areValidationErrors } from "../../middlewares/util";
import { Category } from "../../models/Category";
import { Op } from "sequelize";

function checkCategories(categories: string[]) {
  return Category.count({ where: { id: { [Op.in]: categories } } }).then(
    (count) => {
      if (count != categories.length) {
        return Promise.reject("categories are invalid");
      }
      return true;
    }
  );
}

function checkSchedules(schedules: Schedule[]) {
  const now = Date.now();
  for (let i = 0; i < schedules.length; i++) {
    const schedule = schedules[i];
    if (schedule) {
      const start = schedule.start.getTime();
      const end = schedule.end.getTime();
      if (start <= now || end <= start) {
        throw new Error(`schedules[${i}] is invalid`);
      }
    }
  }
  return true;
}

const commonEventsValidator = [
  body("name").isString().notEmpty(),
  body("image").isString().optional(),
  body("description").isString().notEmpty(),
  body("schedules.*.start").isISO8601().toDate(),
  body("schedules.*.end").isISO8601().toDate(),
  body("schedules").isArray({ min: 1, max: 30 }).custom(checkSchedules),
  body("contact").isString().optional(),
  body("details").isString().optional(),
  body("categories").isArray({ min: 1, max: 3 }).custom(checkCategories),
  body("schedules.*.content").isString().isLength({ max: 10000 }).optional(),
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

export const eventsCreateValidator = [...commonEventsValidator];

export const eventsUpdateValidator = [
  param("id").isString().notEmpty(),
  ...commonEventsValidator,
  doesEventExist,
  canUpdateOrEditEvent,
];

export const adminEventsUpdateValidator = [
  body("status").isIn(Object.keys(EventStatus)).optional(),
  body("trending").isBoolean().optional(),
  body("highlighted").isBoolean().optional(),
  ...eventsUpdateValidator,
];

async function canUpdateOrEditEvent(
  _: Request,
  res: Response,
  next: NextFunction
) {
  const event: Event = res.locals.event;
  if (![event.creator, process.env.ADMIN].includes(res.locals.auth.user)) {
    return next(new UnauthorizedExeption());
  }
  return next();
}

export const eventsDeleteValidator = [
  param("id").isString().notEmpty(),
  doesEventExist,
  areValidationErrors,
  canUpdateOrEditEvent,
];

export const eventAttendeeAddValidator = [
  param("id").isString().notEmpty(),
  doesEventExist,
];

export const eventsListValidator = [
  query("creator").isString().optional(),
  query("owner").isString().optional(),
  query("sort").isIn(["id", "-id"]).optional(),
  query("id").isString().optional(),
  query("category").isString().optional(),
  query("trending").isBoolean().optional(),
  query("highlighted").isBoolean().optional(),
  ...paginationValidator,
  setDefaultSort,
  setDefaultPagination,
];

export const adminEventsListValidator = [
  query("status").isIn(Object.values(EventStatus)).optional(),
  query("isActive").isBoolean().optional(),
  ...eventsListValidator,
];

export const myEventsListValidator = [...adminEventsListValidator];

export const eventAttendeesListValidator = [
  param("id").isString().optional(),
  query("user").isString().optional(),
  query("sort").isIn(["id", "-id"]).optional(),
  ...paginationValidator,
  setDefaultSort,
  setDefaultPagination,
];

export const eventGetValidator = [
  param("id").isUUID().notEmpty(),
  areValidationErrors,
  doesEventExist,
];
