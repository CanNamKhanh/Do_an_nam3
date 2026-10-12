export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
export const pad = (n: number) => String(n).padStart(2, "0");
export const WEEKDAYS = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
export const hhmm = (iso: string) => {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
export const greeting = (h: number) => (h < 11 ? "Chào buổi sáng" : h < 13 ? "Chào buổi trưa" : h < 18 ? "Chào buổi chiều" : "Chào buổi tối");
export const until = (ms: number) => {
  const m = Math.max(1, Math.round(ms / 60000));
  return m < 60 ? `sau ${m} phút` : `sau ${Math.floor(m / 60)}h${m % 60 ? ` ${pad(m % 60)}p` : ""}`;
};
export const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
export const hourFloat = (d: Date) => d.getHours() + d.getMinutes() / 60;
