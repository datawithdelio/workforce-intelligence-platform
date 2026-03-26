import { getServerSession } from "next-auth";

import { AppShell } from "../../../../components/app-shell";
import { ProfileEditForm } from "../../../../components/profile-edit-form";
import { authOptions } from "../../../../lib/auth";
import { getEmployee } from "../../../../lib/api";

export default async function EmployeeEditPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const employee = (await getEmployee(params.id, session?.user?.token)) as Record<string, unknown>;

  return (
    <AppShell
      title="Request a profile update"
      description="Keep the employee record current without losing trust: every change goes through a clear manager review flow first."
    >
      <ProfileEditForm employee={employee} token={session?.user?.token} />
    </AppShell>
  );
}
