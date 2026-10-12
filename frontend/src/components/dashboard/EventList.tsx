import { cn, hhmm, isSameDay, until } from "@/lib/utils";
import type { DisplayEvent } from "@/types/display";

export function EventList({
  events,
  failed = false,
  now,
}: {
  events: DisplayEvent[] | null;
  failed?: boolean;
  now: Date | null;
}) {
  const today =
    now && events
      ? events
          .filter((e) => e.isActive && isSameDay(new Date(e.startTime), now))
          .sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime))
      : [];
  const nextId = now
    ? today.find((e) => new Date(e.startTime) > now)?.id
    : undefined;
  return (
    <div className="panel">
      <div className="flex items-center justify-between border-b border-white/20 px-5 py-4">
        <h2 className="lbl">Lịch hôm nay</h2>
        <span className="text-[13px] text-white/70">
          {today.length ? `${today.length} sự kiện` : ""}
        </span>
      </div>
      {events === null ? (
        <p className="px-5 py-8 text-sm leading-relaxed text-white/70">
          {failed ? "Không tải được lịch, đang thử lại…" : "Đang tải lịch…"}
        </p>
      ) : today.length === 0 ? (
        <p className="px-5 py-8 text-sm leading-relaxed text-white/70">
          Hôm nay chưa có sự kiện nào. Quản trị viên có thể thêm lịch trong mục
          Quản trị.
        </p>
      ) : (
        today.map((e) => {
          const start = new Date(e.startTime),
            end = e.endTime ? new Date(e.endTime) : null;
          const state =
            now && end && now > end
              ? "past"
              : now && now >= start && (!end || now <= end)
                ? "now"
                : e.id === nextId
                  ? "next"
                  : "";
          const meta = [e.location, e.description].filter(Boolean).join(" — ");
          return (
            <div
              key={e.id}
              className={cn(
                "grid grid-cols-[76px_1fr] gap-3.5 border-b border-white/20 px-5 py-[18px] last:border-0",
                state === "next" &&
                  "shadow-[inset_3px_0_0_rgba(255,255,255,.55)]",
                state === "now" &&
                  "bg-accent/10 shadow-[inset_3px_0_0_#ffd36b]",
                state === "past" && "opacity-50",
              )}
            >
              <div className="text-[15px] font-semibold tabular-nums">
                {hhmm(e.startTime)}
                <i className="block text-xs font-normal not-italic text-white/70">
                  {e.endTime ? `đến ${hhmm(e.endTime)}` : ""}
                </i>
              </div>
              <div>
                {state === "now" && (
                  <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.06em] text-accent">
                    <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                    Đang diễn ra
                  </span>
                )}
                {state === "next" && now && (
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[.06em] text-white/70">
                    Sắp tới · {until(start.getTime() - now.getTime())}
                  </span>
                )}
                <h3 className="text-[15px] font-semibold">{e.title}</h3>
                {meta && (
                  <p className="mt-1 text-[13px] leading-normal text-white/70">
                    {meta}
                  </p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
