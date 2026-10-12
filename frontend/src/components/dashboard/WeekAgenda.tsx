import { cn, hhmm, isSameDay, pad, WEEKDAYS } from "@/lib/utils";
import { WEEK_DAYS } from "@/services/events.client";
import type { DisplayEvent } from "@/types/display";

const MAX_PER_DAY = 4;
const byStart = (a: DisplayEvent, b: DisplayEvent) =>
  +new Date(a.startTime) - +new Date(b.startTime);

function dayLabel(index: number, day: Date) {
  return index === 0
    ? "Hôm nay"
    : index === 1
      ? "Ngày mai"
      : WEEKDAYS[day.getDay()];
}

/** Lịch 7 ngày tới, mỗi ngày một hàng, hiện tối đa MAX_PER_DAY sự kiện. */
export function WeekAgenda({
  events,
  now,
}: {
  events: DisplayEvent[] | null;
  now: Date | null;
}) {
  if (!events || !now) return null;

  const active = events.filter((e) => e.isActive);
  const days = Array.from({ length: WEEK_DAYS }, (_, i) => {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="panel mt-4">
      <div className="flex items-center justify-between border-b border-white/20 px-5 py-4">
        <h2 className="lbl">Lịch tuần</h2>
        <span className="text-[13px] text-white/70">{WEEK_DAYS} ngày tới</span>
      </div>
      <ul>
        {days.map((day, i) => {
          const list = active
            .filter((e) => isSameDay(new Date(e.startTime), day))
            .sort(byStart);
          const shown = list.slice(0, MAX_PER_DAY);

          return (
            <li
              key={day.getTime()}
              className={cn(
                "grid grid-cols-[88px_1fr] gap-3 border-b border-white/15 px-5 py-3 last:border-0",
                i === 0 && "bg-white/5",
              )}
            >
              <div>
                <div
                  className={cn(
                    "text-[13px] font-semibold",
                    i === 0 && "text-accent",
                  )}
                >
                  {dayLabel(i, day)}
                </div>
                <div className="text-xs tabular-nums text-white/60">
                  {pad(day.getDate())}/{pad(day.getMonth() + 1)}
                </div>
              </div>

              {shown.length === 0 ? (
                <span className="text-[13px] text-white/40">Không có lịch</span>
              ) : (
                <ul className="space-y-1.5">
                  {shown.map((e) => {
                    const over = new Date(e.endTime ?? e.startTime) < now;
                    return (
                      <li
                        key={e.id}
                        className={cn(
                          "flex gap-2.5 text-[13px] leading-snug",
                          over && "opacity-50",
                        )}
                      >
                        <span className="w-11 shrink-0 font-semibold tabular-nums">
                          {hhmm(e.startTime)}
                        </span>
                        <span className="min-w-0">
                          {e.title}
                          {e.location && (
                            <span className="text-white/60">
                              {" "}
                              · {e.location}
                            </span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                  {list.length > shown.length && (
                    <li className="text-xs text-white/60">
                      +{list.length - shown.length} sự kiện khác
                    </li>
                  )}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
