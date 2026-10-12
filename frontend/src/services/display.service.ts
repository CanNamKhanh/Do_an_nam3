import { apiClient } from "@/lib/http/client";
import type { DisplayResponse } from "@/types/display";

/** Client-side: lấy dữ liệu bảng thông tin qua proxy /api/display. */
export async function getDisplay(signal?: AbortSignal): Promise<DisplayResponse> {
  const { data } = await apiClient.get<DisplayResponse>("/display", { signal });
  return data;
}
