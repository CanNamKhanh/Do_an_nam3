import { deleteEventAction, toggleEventAction } from "@/actions/events";

import type { DisplayEvent } from "@/types/display";

export function EventTable({ events }: { events: DisplayEvent[] }) {
  if (!events.length) return <p className="text-sm text-white/60">Chưa có sự kiện nào.</p>;
  return (
    <ul className="divide-y divide-white/15">
      {events.map((e) => (
        <li key={e.id} className="flex items-center justify-between gap-3 py-3 text-sm">
          <div>
            <div className={e.isActive ? "" : "text-white/50 line-through"}>{e.title}</div>
            <div className="text-xs text-white/60">{new Date(e.startTime).toLocaleString("vi-VN", { timeZone: "Asia/Bangkok" })}</div>
          </div>
          <div className="flex gap-2">
            <form action={toggleEventAction.bind(null, e.id, !e.isActive)}>
              <button className="btn cursor-pointer" type="submit">{e.isActive ? "Ẩn" : "Hiện"}</button>
            </form>
            <form action={deleteEventAction.bind(null, e.id)}>
              <button className="btn cursor-pointer text-red-300" type="submit">Xóa</button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
