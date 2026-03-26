import { demoActivity, demoChangeRequests, demoDashboard, demoEmployees, demoNotifications, demoScoreSummary, demoScores, demoUsers } from "./demo-data";

const apiBaseUrl =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

async function fetchApi<T>(path: string, token?: string): Promise<T | null> {
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch (_error) {
    return null;
  }
}

export async function getDashboardKpis(token?: string) {
  return (await fetchApi("/dashboard/kpis", token)) ?? demoDashboard;
}

export async function getDashboardActivity(token?: string) {
  return (await fetchApi("/dashboard/activity", token)) ?? demoActivity;
}

export async function getEmployees(token?: string) {
  const response = await fetchApi<{ items: typeof demoEmployees }>("/employees", token);
  return response?.items ?? demoEmployees;
}

export async function getEmployee(id: string, token?: string) {
  return (await fetchApi(`/employees/${id}`, token)) ?? demoEmployees.find((employee) => employee.id === Number(id)) ?? demoEmployees[0];
}

export async function getEmployeeHistory(id: string, token?: string) {
  return (await fetchApi(`/employees/${id}/history`, token)) ?? demoActivity.filter((entry) => entry.entityId === Number(id));
}

export async function getChangeRequests(token?: string) {
  return (await fetchApi("/change-requests", token)) ?? demoChangeRequests;
}

export async function getChangeRequest(id: string, token?: string) {
  return (await fetchApi(`/change-requests/${id}`, token)) ?? demoChangeRequests.find((request) => request.id === Number(id)) ?? demoChangeRequests[0];
}

export async function getNotifications(token?: string) {
  return (await fetchApi("/notifications", token)) ?? demoNotifications;
}

export async function getAdminUsers(token?: string) {
  return (await fetchApi("/admin/users", token)) ?? demoUsers;
}

export async function getScoreSummary(token?: string) {
  return (await fetchApi("/scores/summary", token)) ?? demoScoreSummary;
}

export async function getScoreForEmployee(id: string, token?: string) {
  return (await fetchApi(`/scores/${id}`, token)) ?? demoScores;
}
