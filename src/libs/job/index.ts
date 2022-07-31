import { CronJob } from "cron";
import { updateStartDate } from "./event";

export function initCronJob() {
  new CronJob("* 1 * * * *", updateStartDate);
}
