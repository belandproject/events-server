export function calculateStartEndDate(
  schedules: Array<{ start: Date; end: Date }>
) {
  const now = Date.now();
  const sortedSchedules = schedules.sort(function (
    a: { end: Date },
    b: { end: Date }
  ) {
    return a.end.getTime() - b.end.getTime();
  });

  for (const schedule of sortedSchedules) {
    if (schedule.start.getTime() > now) {
      return {
        startDate: schedule.start,
        endDate: schedule.end,
        finishDate: sortedSchedules[schedules.length - 1]?.end,
      };
    }
  }
  return {};
}
