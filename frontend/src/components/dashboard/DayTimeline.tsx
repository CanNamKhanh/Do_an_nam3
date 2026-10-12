import { hhmm, hourFloat, isSameDay } from "@/lib/utils";
import type { DisplayEvent } from "@/types/display";

const START = 6,
  END = 22;
const pos = (h: number) =>
  Math.max(0, Math.min(100, ((h - START) / (END - START)) * 100));

export function DayTimeline({
  events,
  now,
}: {
  events: DisplayEvent[];
  now: Date | null;
}) {
  if (!now) return null;
  const today = events.filter(
    (e) => e.isActive && isSameDay(new Date(e.startTime), now),
  );
  const left = today.filter(
    (e) => new Date(e.endTime ?? e.startTime) > now,
  ).length;
  const p = pos(hourFloat(now));
  return (
    <div className="panel mt-4 px-5 pb-3.5 pt-4">
      <div className="mb-2.5 flex justify-between text-[13px] font-medium">
        <span className="lbl">Tiến độ trong ngày</span>
        <span>{left ? `Còn ${left} sự kiện` : "Đã hết lịch hôm nay"}</span>
      </div>
      <div className="relative h-[22px]">
        <i className="absolute inset-x-0 top-2.5 h-0.5 bg-white/20" />
        <i
          className="absolute left-0 top-2.5 h-0.5 bg-white transition-[width] duration-1000"
          style={{ width: `${p}%` }}
        />
        {today.map((e) => (
          <i
            key={e.id}
            title={`${hhmm(e.startTime)} ${e.title}`}
            className="absolute top-1 h-3.5 w-1.5 -translate-x-1/2 rounded-sm bg-accent"
            style={{ left: `${pos(hourFloat(new Date(e.startTime)))}%` }}
          />
        ))}
        <i
          className="absolute top-[5px] h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,.22)] transition-[left] duration-1000"
          style={{ left: `${p}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-white/70">
        {[6, 10, 14, 18, 22].map((h) => (
          <span key={h}>{h}h</span>
        ))}
      </div>
    </div>
  );
}
