import express from "express";
import { asyncMiddleware } from "../../middlewares";
import { myEventsListValidator } from "../../validators";
import { Event } from "../../models/Event";

const myEventsRouter = express.Router();
myEventsRouter.get(
  "/events",
  myEventsListValidator,
  asyncMiddleware(listEvents)
);

export { myEventsRouter };

async function listEvents(req: express.Request, res: express.Response) {
  res.json(
    await Event.listForApi({
      ...req.query,
      creator: res.locals.auth.user,
    } as any)
  );
}
