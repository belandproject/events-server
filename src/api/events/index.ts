import express from "express";
import { asyncMiddleware } from "../../middlewares/async";
import { authenticate } from "../../middlewares/auth";
import {
  eventGetValidator,
  eventsCreateValidator,
  eventsDeleteValidator,
  eventsListValidator,
  eventsUpdateValidator,
} from "../../validators";
import { Event } from "../../models/Event";
import { eventAttendeesRouter } from "./attendee";

const eventsRouter = express.Router();

eventsRouter.post(
  "/",
  authenticate,
  asyncMiddleware(eventsCreateValidator),
  createEvent
);

eventsRouter.put(
  "/:id",
  authenticate,
  asyncMiddleware(eventsUpdateValidator),
  updateEvent
);

eventsRouter.delete(
  "/:id",
  authenticate,
  asyncMiddleware(eventsDeleteValidator),
  deleteEvent
);

eventsRouter.get("/", eventsListValidator, listEvents);
eventsRouter.get("/:id", eventGetValidator, getEvent);
eventsRouter.use(eventAttendeesRouter);

export { eventsRouter };

async function createEvent(req: express.Request, res: express.Response) {
  const schedules = req.body.schedules.sort(function (
    a: { end: Date },
    b: { end: Date }
  ) {
    return a.end.getTime() - b.end.getTime();
  });

  const event = await Event.create({
    ...req.body,
    schedules,
    startDate: schedules[0].start,
    endDate: schedules[0].end,
    finishDate: schedules[schedules.length - 1].end,
    creator: res.locals.auth.user,
  });
  res.json(event);
}

async function updateEvent(req: express.Request, res: express.Response) {
  const event: Event = res.locals.event;
  await event.update(req.body);
  res.json(event);
}

async function deleteEvent(_: express.Request, res: express.Response) {
  const event: Event = res.locals.event;
  await event.destroy();
  res.json(event);
}

async function listEvents(req: express.Request, res: express.Response) {
  res.json(
    await Event.listForApi({
      ...req.query,
      approved: true,
      isActive: true,
      rejected: false,
    } as any)
  );
}

async function getEvent(_: express.Request, res: express.Response) {
  res.json(res.locals.event);
}
