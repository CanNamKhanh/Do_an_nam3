import { displayClient } from "@/lib/http/server";
import type { DisplayResponse } from "@/types/display";

export async function fetchDisplayFromBackend(): Promise<DisplayResponse> {
  const { data } = await displayClient.get<DisplayResponse>("/display");
  return data;
}

export async function safeFetchDisplay(): Promise<DisplayResponse | null> {
  try {
    return await fetchDisplayFromBackend();
  } catch {
    return null;
  }
}
