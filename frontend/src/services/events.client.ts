import { apiClient } from "@/lib/http/client";
import type { DisplayEvent } from "@/types/display";

const DAY_MS = 24 * 60 * 60 * 1000;
export const WEEK_DAYS = 7;

export async function getWeekEvents(
  signal?: AbortSignal,
  days = WEEK_DAYS,
): Promise<DisplayEvent[]> {
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  const to = new Date(from.getTime() + days * DAY_MS - 1);
  const { data } = await apiClient.get<DisplayEvent[]>("/events", {
    params: { from: from.toISOString(), to: to.toISOString() },
    signal,
  });
  return data;
}
