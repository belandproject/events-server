import express, { Request, Response } from "express";
import {
  asyncMiddleware,
  authenticate,
  eventAttendeeAddValidator,
  eventAttendeeDeleteValidator,
  eventAttendeesListValidator,
} from "../../middlewares";
import { Attendee } from "../../models/Attendee";

const eventAttendeesRouter = express.Router();
eventAttendeesRouter.get(
  "/:id/attendees",
  eventAttendeesListValidator,
  listEventAttendees
);
eventAttendeesRouter.post("/:id/attendees", authenticate, addAttendee);
eventAttendeesRouter.delete(
  "/:id/attendees/:attendeeId",
  authenticate,
  asyncMiddleware(eventAttendeeAddValidator),
  addAttendee
);
eventAttendeesRouter.delete(
  "/:id/attendees/:attendeeId",
  authenticate,
  asyncMiddleware(eventAttendeeDeleteValidator),
  deleteAttendee
);

export { eventAttendeesRouter };

export async function listEventAttendees(req: Request, res: Response) {
  res.json(
    await Attendee.listForApi({
      ...req.query,
      eventId: req.params.id,
    } as any)
  );
}

export async function addAttendee(req: Request, res: Response) {
  await Attendee.create({
    eventId: req.params.id,
    user: res.locals.auth.user,
  });

  res.json({});
}

export async function deleteAttendee(_: Request, res: Response) {
  await res.locals.attendee.destroy();
  res.json(res.locals.attendee);
}
