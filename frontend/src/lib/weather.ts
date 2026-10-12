export type WeatherKind = "clear" | "cloud" | "fog" | "rain" | "storm" | "snow";
export type ThemeKey = "clear-day" | "clear-night" | "cloud-day" | "cloud-night" | "fog" | "rain" | "storm" | "snow";

const TABLE: { codes: number[]; text: string; icon: string; kind: WeatherKind }[] = [
  { codes: [0], text: "Trời quang", icon: "sun", kind: "clear" },
  { codes: [1, 2], text: "Ít mây", icon: "cloud-sun", kind: "cloud" },
  { codes: [3], text: "Nhiều mây", icon: "cloud", kind: "cloud" },
  { codes: [45, 48], text: "Sương mù", icon: "fog", kind: "fog" },
  { codes: [51, 53, 55, 56, 57], text: "Mưa phùn", icon: "rain", kind: "rain" },
  { codes: [61, 63, 65, 66, 67, 80, 81, 82], text: "Mưa", icon: "rain", kind: "rain" },
  { codes: [71, 73, 75, 77, 85, 86], text: "Tuyết", icon: "snow", kind: "snow" },
  { codes: [95, 96, 99], text: "Dông bão", icon: "bolt", kind: "storm" },
];

export const describe = (code: number) => TABLE.find((r) => r.codes.includes(code)) ?? TABLE[2];
export const isNight = (hour: number) => hour >= 18 || hour < 6;

export function themeOf(code: number, night: boolean): ThemeKey {
  const { kind } = describe(code);
  if (kind === "clear") return night ? "clear-night" : "clear-day";
  if (kind === "cloud") return night ? "cloud-night" : "cloud-day";
  return kind;
}

export const GRADIENTS: Record<ThemeKey, string> = {
  "clear-day": "linear-gradient(180deg,#2f7fd1 0%,#6bb4ea 55%,#f2c883 100%)",
  "clear-night": "linear-gradient(180deg,#050a1c 0%,#101c3f 60%,#2a3560 100%)",
  "cloud-day": "linear-gradient(180deg,#5d7186 0%,#8a9bab 60%,#b7c0c8 100%)",
  "cloud-night": "linear-gradient(180deg,#141a26 0%,#262f40 100%)",
  rain: "linear-gradient(180deg,#1e2a38 0%,#3a4b5c 100%)",
  storm: "linear-gradient(180deg,#0e1119 0%,#262a3b 60%,#3d3550 100%)",
  fog: "linear-gradient(180deg,#7b8790 0%,#aab3b8 100%)",
  snow: "linear-gradient(180deg,#6f8196 0%,#c9d5e0 100%)",
};

/** Điền đường dẫn trong /public/media để dùng video/ảnh thật. Ví dụ: fog: { video: "/media/fog.mp4", image: "/media/fog.jpg" } */
export const MEDIA: Partial<Record<ThemeKey, { video?: string; image?: string }>> = {};
