import express from "express";
import { asyncMiddleware } from "../../middlewares";
import { calculateStartEndDate } from "../../utils/event";
import {
  adminEventsListValidator,
  adminEventsUpdateValidator,
} from "../../validators";
import { Event } from "../../models/Event";

const adminEventsRouter = express.Router();
adminEventsRouter.get(
  "/events",
  adminEventsListValidator,
  asyncMiddleware(listEvents)
);

adminEventsRouter.post(
  "/events",
  adminEventsUpdateValidator,
  asyncMiddleware(updateEvent)
);

export { adminEventsRouter };

async function listEvents(req: express.Request, res: express.Response) {
  res.json(
    await Event.listForApi({
      ...req.query,
    } as any)
  );
}

async function updateEvent(req: express.Request, res: express.Response) {
  const event: Event = res.locals.event;
  await event.update({
    ...req.body,
    ...calculateStartEndDate(req.body.schedules),
  });
  res.json(event);
}
