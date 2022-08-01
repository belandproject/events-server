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
import { calculateStartEndDate } from "../../utils/event";

const eventsRouter = express.Router();

eventsRouter.post(
  "/",
  authenticate,
  eventsCreateValidator,
  asyncMiddleware(createEvent)
);

eventsRouter.put(
  "/:id",
  authenticate,
  asyncMiddleware(eventsUpdateValidator),
  asyncMiddleware(updateEvent)
);

eventsRouter.delete(
  "/:id",
  authenticate,
  asyncMiddleware(eventsDeleteValidator),
  asyncMiddleware(deleteEvent)
);

eventsRouter.get("/", eventsListValidator, asyncMiddleware(listEvents));
eventsRouter.get("/:id", asyncMiddleware(eventGetValidator), getEvent);
eventsRouter.use(eventAttendeesRouter);

export { eventsRouter };

async function createEvent(req: express.Request, res: express.Response) {
  const event = await Event.create({
    ...req.body,
    ...calculateStartEndDate(req.body.schedules),
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

function getEvent(_: express.Request, res: express.Response) {
  res.json(res.locals.event);
}
