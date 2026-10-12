"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { errorMessage } from "@/lib/http/errors";
import * as eventService from "@/services/events.service";
import type { ActionState } from "@/types/action";

const schema = z
  .object({
    title: z.string().trim().min(1, "Nhập tiêu đề"),
    location: z.string().trim().optional(),
    description: z.string().trim().optional(),
    startTime: z.string().min(1, "Chọn ngày và giờ bắt đầu"),
    endTime: z.string().optional(),
  })
  .refine((v) => !v.endTime || v.endTime >= v.startTime, {
    message: "Giờ kết thúc phải sau giờ bắt đầu",
    path: ["endTime"],
  });

/** Ghép ô ngày (YYYY-MM-DD) và ô giờ (HH:mm) thành "YYYY-MM-DDTHH:mm". */
const joinDateTime = (date?: FormDataEntryValue, clock?: FormDataEntryValue) =>
  date && clock ? `${date}T${clock}` : "";

const refresh = () => {
  revalidatePath("/admin");
  revalidatePath("/");
};

export async function createEventAction(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const raw = Object.fromEntries(fd);
  if (Boolean(raw.endDate) !== Boolean(raw.endClock)) {
    return { error: "Nhập đủ cả ngày và giờ kết thúc" };
  }

  const parsed = schema.safeParse({
    ...raw,
    startTime: joinDateTime(raw.startDate, raw.startClock),
    endTime: joinDateTime(raw.endDate, raw.endClock),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const v = parsed.data;
  try {
    await eventService.createEvent({
      title: v.title,
      location: v.location || null,
      description: v.description || null,
      startTime: new Date(v.startTime).toISOString(),
      endTime: v.endTime ? new Date(v.endTime).toISOString() : null,
    });
  } catch (e) {
    return { error: errorMessage(e) };
  }

  refresh();
  return { ok: true };
}

export async function toggleEventAction(id: number, isActive: boolean) {
  await requireAdmin();
  await eventService.setEventActive(id, isActive);
  refresh();
}

export async function deleteEventAction(id: number) {
  await requireAdmin();
  await eventService.deleteEvent(id);
  refresh();
}
