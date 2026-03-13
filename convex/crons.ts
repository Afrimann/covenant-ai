import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "generateDailyDevotion",
  { hourUTC: 5, minuteUTC: 0 },
  internal.devotions.ensureDailyDevotion,
  {},
);

export default crons;
