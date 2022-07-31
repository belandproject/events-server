import { Op } from "sequelize";
import { calculateStartEndDate } from "../../utils/event";
import { Event } from "../../models/Event";

export async function updateStartDate() {
  const now = new Date();
  const events = await Event.findAll({
    where: {
      finishDate: { [Op.gte]: now },
      endDate: { [Op.gt]: now },
    },
  });

  for (const event of events) {
    event.setAttributes(calculateStartEndDate(event.schedules as any));
    await event.save();
  }
}
