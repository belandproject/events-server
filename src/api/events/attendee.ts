import express, { Request, Response } from "express";
import { sequelize } from "../../sequelize";
import {
  eventAttendeeAddValidator,
  eventAttendeesListValidator,
} from "../../validators";
import { Attendee } from "../../models/Attendee";
import { Event } from "../../models/Event";
import { authenticate, asyncMiddleware } from "../../middlewares";

const eventAttendeesRouter = express.Router();
eventAttendeesRouter.get(
  "/:id/attendees",
  eventAttendeesListValidator,
  asyncMiddleware(listEventAttendees)
);
eventAttendeesRouter.post(
  "/:id/attendees",
  authenticate,
  asyncMiddleware(eventAttendeeAddValidator),
  asyncMiddleware(addOrRemoveAttendee)
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

export async function addOrRemoveAttendee(req: Request, res: Response) {
  await sequelize.transaction(async (transaction) => {
    const where = {
      eventId: req.params.id,
      user: res.locals.auth.user,
    };
    const attendeeCount = await Attendee.count({ where, transaction });
    if (attendeeCount == 0) {
      await Promise.all([
        Event.increment("attendeesCount", {
          where: { id: req.params.id },
          transaction,
        }),
        Attendee.create(where, { transaction }),
      ]);
    } else {
      await Promise.all([
        Event.decrement("attendeesCount", {
          where: { id: req.params.id },
          transaction,
        }),
        Attendee.destroy({ transaction, where }),
      ]);
    }
  });

  res.json({});
}
