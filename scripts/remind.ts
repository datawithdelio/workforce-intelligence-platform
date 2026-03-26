import { eq, lt } from "drizzle-orm";

import { db, employeeProfiles, notifications, users } from "@workforce/db";
import { notificationTypes } from "@workforce/shared";

export const cronSchedule = "0 9 * * 1";

async function main() {
  const rows = await db
    .select({
      userId: users.id,
      firstName: employeeProfiles.firstName,
      completionScore: employeeProfiles.completionScore
    })
    .from(employeeProfiles)
    .innerJoin(users, eq(employeeProfiles.userId, users.id))
    .where(lt(employeeProfiles.completionScore, 80));

  if (rows.length === 0) {
    console.log("No reminders needed this week.");
    return;
  }

  await db.insert(notifications).values(
    rows.map((row) => ({
      userId: row.userId,
      message: `${row.firstName}, your profile is ${Math.round(row.completionScore)}% complete. Please finish the missing details.`,
      type: notificationTypes.incompleteProfileReminder
    }))
  );

  console.log(`Created ${rows.length} completion reminder notifications.`);
}

main().catch((error) => {
  console.error("Reminder job failed", error);
  process.exit(1);
});
