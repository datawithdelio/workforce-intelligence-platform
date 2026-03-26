import { desc, gte } from "drizzle-orm";

import { db, kpiSnapshots } from "@workforce/db";

async function main() {
  const dateThreshold = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const rows = await db
    .select()
    .from(kpiSnapshots)
    .where(gte(kpiSnapshots.snapshotDate, dateThreshold))
    .orderBy(desc(kpiSnapshots.snapshotDate));

  if (rows.length === 0) {
    console.log("No KPI snapshots found for the last 7 days.");
    return;
  }

  const latest = rows[0];
  console.log("Weekly Workforce Summary");
  console.log("========================");
  console.log(`Snapshots covered: ${rows.length}`);
  console.log(`Latest snapshot date: ${latest.snapshotDate}`);
  console.log(`Total employees: ${latest.totalEmployees}`);
  console.log(`Active employees: ${latest.activeEmployees}`);
  console.log(`Average completion score: ${latest.avgCompletionScore.toFixed(2)}%`);
  console.log(`Pending approvals: ${latest.pendingApprovals}`);
  console.log(`Average approval days: ${latest.avgApprovalDays.toFixed(2)}`);
}

main().catch((error) => {
  console.error("Weekly summary failed", error);
  process.exit(1);
});
