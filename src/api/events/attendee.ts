import express, { Request, Response } from "express";
import { sequelize } from "../../sequelize";
import {
  eventAttendeeAddValidator,
  eventAttendeeDeleteValidator,
  eventAttendeesListValidator,
} from "../../validators";
import { Attendee } from "../../models/Attendee";
import { Event } from "../../models/Event";
import { authenticate, asyncMiddleware } from "../../middlewares";

const eventAttendeesRouter = express.Router();
eventAttendeesRouter.get(
  "/:id/attendees",
  eventAttendeesListValidator,
  listEventAttendees
);
eventAttendeesRouter.post(
  "/:id/attendees",
  authenticate,
  eventAttendeeAddValidator,
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
  await sequelize.transaction(async (transaction) => {
    await Promise.all([
      Event.update(
        { field: sequelize.literal("attendeesCount + 1") },
        { where: { id: req.params.id }, transaction }
      ),
      Attendee.create(
        {
          eventId: req.params.id,
          user: res.locals.auth.user,
        },
        { transaction }
      ),
    ]);
  });

  res.json({});
}

export async function deleteAttendee(_: Request, res: Response) {
  const attendee: Attendee = res.locals.attendee;
  await sequelize.transaction(async (transaction) => {
    await Promise.all([
      Event.update(
        { field: sequelize.literal("attendeesCount - 1") },
        { where: { id: attendee.eventId }, transaction }
      ),
      attendee.destroy({ transaction }),
    ]);
  });

  res.json(attendee);
}
