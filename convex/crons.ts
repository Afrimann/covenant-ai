import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run every day at 7:00 AM Nigeria time (WAT, UTC+1)
crons.cron(
  "generateDailyDevotion",
  "0 6 * * *", // 6:00 UTC = 7:00 WAT
  internal.pushNotifications.notifyDailyDevotionSubscribers,
  {}
);

export default crons;