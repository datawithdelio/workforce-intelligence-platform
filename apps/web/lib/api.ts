import { demoActivity, demoChangeRequests, demoDashboard, demoEmployees, demoNotifications, demoScoreSummary, demoScores, demoUsers } from "./demo-data";

const apiBaseUrl =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

function getApiBaseCandidates() {
  const candidates = [apiBaseUrl];

  if (apiBaseUrl.includes("localhost")) {
    candidates.push(apiBaseUrl.replace("localhost", "127.0.0.1"));
  }

  return [...new Set(candidates)];
}

async function fetchApi<T>(path: string, token?: string): Promise<T | null> {
  if (!token) {
    return null;
  }

  for (const baseUrl of getApiBaseCandidates()) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: "no-store"
      });

      if (!response.ok) {
        continue;
      }

      return (await response.json()) as T;
    } catch (_error) {
      continue;
    }
  }

  return null;
}

export async function getDashboardKpis(token?: string) {
  if (!token) {
    return demoDashboard;
  }

  return (await fetchApi("/dashboard/kpis", token)) ?? null;
}

export async function getDashboardActivity(token?: string) {
  if (!token) {
    return demoActivity;
  }

  return (await fetchApi("/dashboard/activity", token)) ?? [];
}

export async function getEmployees(token?: string) {
  const response = await fetchApi<{ items: typeof demoEmployees }>("/employees", token);
  return token ? response?.items ?? [] : response?.items ?? demoEmployees;
}

export async function getEmployee(id: string, token?: string) {
  if (!token) {
    return (await fetchApi(`/employees/${id}`, token)) ?? demoEmployees.find((employee) => employee.id === Number(id)) ?? demoEmployees[0];
  }

  return (await fetchApi(`/employees/${id}`, token)) ?? null;
}

export async function getEmployeeHistory(id: string, token?: string) {
  if (!token) {
    return (await fetchApi(`/employees/${id}/history`, token)) ?? demoActivity.filter((entry) => entry.entityId === Number(id));
  }

  return (await fetchApi(`/employees/${id}/history`, token)) ?? [];
}

export async function getChangeRequests(token?: string) {
  if (!token) {
    return demoChangeRequests;
  }

  return (await fetchApi("/change-requests", token)) ?? [];
}

export async function getChangeRequest(id: string, token?: string) {
  if (!token) {
    return (await fetchApi(`/change-requests/${id}`, token)) ?? demoChangeRequests.find((request) => request.id === Number(id)) ?? demoChangeRequests[0];
  }

  return (await fetchApi(`/change-requests/${id}`, token)) ?? null;
}

export async function getNotifications(token?: string) {
  if (!token) {
    return demoNotifications;
  }

  return (await fetchApi("/notifications", token)) ?? [];
}

export async function getAdminUsers(token?: string) {
  if (!token) {
    return demoUsers;
  }

  return (await fetchApi("/admin/users", token)) ?? [];
}

export async function getScoreSummary(token?: string) {
  if (!token) {
    return demoScoreSummary;
  }

  return (await fetchApi("/scores/summary", token)) ?? null;
}

export async function getScoreForEmployee(id: string, token?: string) {
  if (!token) {
    return demoScores;
  }

  return (await fetchApi(`/scores/${id}`, token)) ?? null;
}
