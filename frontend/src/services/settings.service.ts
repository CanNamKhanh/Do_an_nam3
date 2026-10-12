import { authedClient, backendClient } from "@/lib/http/server";

export const DEFAULT_SETTINGS = {
  agencyName: "NHÓM 3",
  locationName: "Hà Nội",
  latitude: 21.0285,
  longitude: 105.8542,
};
export type Settings = typeof DEFAULT_SETTINGS;

function normalize(raw: unknown): Settings {
  const r = (raw ?? {}) as Record<string, unknown>;
  const str = (...keys: string[]) => {
    for (const k of keys) {
      const v = r[k];
      if (typeof v === "string" && v.trim() !== "") return v;
    }
    return undefined;
  };
  const num = (...keys: string[]) => {
    for (const k of keys) {
      const v = r[k];
      if (
        v !== null &&
        v !== undefined &&
        v !== "" &&
        Number.isFinite(Number(v))
      )
        return Number(v);
    }
    return undefined;
  };

  return {
    agencyName: str("agencyName", "agency_name") ?? DEFAULT_SETTINGS.agencyName,
    locationName:
      str("locationName", "location_name") ?? DEFAULT_SETTINGS.locationName,
    latitude: num("latitude", "lat") ?? DEFAULT_SETTINGS.latitude,
    longitude: num("longitude", "lng", "lon") ?? DEFAULT_SETTINGS.longitude,
  };
}

export async function getSettings(): Promise<Settings> {
  try {
    const res = await backendClient.get<unknown>("/settings");
    // console.log("[getSettings] raw from backend:", res.data);
    return normalize(res.data);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export const saveSettings = async (body: Settings) =>
  normalize((await authedClient().put<unknown>("/settings", body)).data);
