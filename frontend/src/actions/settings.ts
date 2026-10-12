"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { errorMessage } from "@/lib/http/errors";
import { saveSettings } from "@/services/settings.service";
import type { ActionState } from "@/types/action";

const schema = z.object({
  agencyName: z.string().trim().min(1, "Nhập tên cơ quan"),
  locationName: z.string().trim().min(1, "Nhập địa điểm"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export async function updateSettingsAction(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = schema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: "Thông tin chưa hợp lệ, kiểm tra lại vĩ độ và kinh độ." };
  try {
    await saveSettings(parsed.data);
  } catch (e) {
    return { error: errorMessage(e) };
  }
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}
