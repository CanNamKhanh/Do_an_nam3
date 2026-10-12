import { authedClient } from "@/lib/http/server";
import type { DisplayEvent } from "@/types/display";

export interface EventPayload {
  title: string;
  description: string | null;
  location: string | null;
  startTime: string; // ISO
  endTime: string | null;
}

/** GET /events */
export const listEvents = async () => (await authedClient().get<DisplayEvent[]>("/events")).data;
/** POST /events */
export const createEvent = async (body: EventPayload) => (await authedClient().post<DisplayEvent>("/events", body)).data;
/** PATCH /events/{id} */
export const setEventActive = async (id: number, isActive: boolean) => (await authedClient().patch<DisplayEvent>(`/events/${id}`, { isActive })).data;
/** DELETE /events/{id} */
export const deleteEvent = async (id: number) => { await authedClient().delete(`/events/${id}`); };
