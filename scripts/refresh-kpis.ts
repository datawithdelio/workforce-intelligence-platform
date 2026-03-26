import { avg, count, desc, eq } from "drizzle-orm";

import {
  db,
  employeeProfiles,
  kpiSnapshots,
  profileChangeRequests,
  vApprovalMetrics,
  vHeadcountByDept
} from "@workforce/db";

export const cronSchedule = "0 6 * * *";

async function main() {
  const totalRows = await db.select({ total: count() }).from(employeeProfiles);
  const activeRows = await db
    .select({ total: count() })
    .from(employeeProfiles)
    .where(eq(employeeProfiles.isActive, true));
  const completionRows = await db.select({ average: avg(employeeProfiles.completionScore) }).from(employeeProfiles);
  const pendingRows = await db
    .select({ total: count() })
    .from(profileChangeRequests)
    .where(eq(profileChangeRequests.status, "pending"));
  const approvalRows = await db.select().from(vApprovalMetrics);
  const headcountRows = await db.select().from(vHeadcountByDept);

  const averageApprovalDays =
    approvalRows.length > 0
      ? approvalRows.reduce((sum, row) => sum + Number(row.avgApprovalDays ?? 0), 0) / approvalRows.length
      : 0;

  const departmentHeadcount = Object.fromEntries(
    headcountRows.map((row) => [row.department ?? "Unknown", row.headcount ?? 0])
  );

  const [inserted] = await db
    .insert(kpiSnapshots)
    .values({
      snapshotDate: new Date().toISOString().slice(0, 10),
      totalEmployees: totalRows[0]?.total ?? 0,
      activeEmployees: activeRows[0]?.total ?? 0,
      avgCompletionScore: Number(completionRows[0]?.average ?? 0),
      pendingApprovals: pendingRows[0]?.total ?? 0,
      avgApprovalDays: Number(averageApprovalDays.toFixed(2)),
      departmentHeadcount
    })
    .returning();

  console.log("KPI snapshot refreshed:", inserted);
}

main().catch((error) => {
  console.error("KPI refresh failed", error);
  process.exit(1);
});
