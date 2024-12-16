import { API_BASE_URL } from "@/lib/constants";
import type { ShareProcess } from "@/lib/types";

export async function startShare(cookies: string, postLink: string, shareCount: number) {
  const response = await fetch(`${API_BASE_URL}/start_share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cookies,
      post_link: postLink,
      share_count: shareCount,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
}

export async function stopShare(processId: string | null = null, postLink: string | null = null, password: string) {
  const response = await fetch(`${API_BASE_URL}/stop_share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      process_id: processId,
      post_link: postLink,
      password,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
}

export async function deleteShare(processId: string | null = null, postLink: string | null = null, password: string) {
  const response = await fetch(`${API_BASE_URL}/delete_share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      process_id: processId,
      post_link: postLink,
      password,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
}

export async function clearLogs() {
  const response = await fetch(`${API_BASE_URL}/clear_logs`, { method: "POST" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
}

export async function fetchData(): Promise<{ logs: string[], processes: Record<string, ShareProcess> }> {
  const [logsResponse, processesResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/get_logs`),
    fetch(`${API_BASE_URL}/active_processes`)
  ]);
  
  const logs = await logsResponse.json();
  const processes = await processesResponse.json();
  
  return { logs, processes };
}