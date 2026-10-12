import { greeting, pad, WEEKDAYS } from "@/lib/utils";

export function Clock({ now }: { now: Date | null }) {
  const h = now?.getHours() ?? 0;
  return (
    <div className="[text-shadow:0_1px_24px_rgba(0,0,0,.25)]">
      <div className="lbl mb-2.5">{now ? greeting(h) : "\u00a0"}</div>
      <div className="text-[clamp(72px,13vw,160px)] font-light leading-[.95] tracking-[-4px] tabular-nums">
        {now ? `${pad(h % 12 || 12)}:${pad(now.getMinutes())}` : "--:--"}
        <small className="ml-2.5 text-[.28em] font-normal tracking-normal text-white/70">{now ? `${h < 12 ? "SA" : "CH"} ${pad(now.getSeconds())}` : ""}</small>
      </div>
      <div className="mt-3.5 text-[clamp(18px,2.4vw,26px)] font-medium">
        {now ? `${WEEKDAYS[now.getDay()]}, ${pad(now.getDate())} tháng ${now.getMonth() + 1}, ${now.getFullYear()}` : "\u00a0"}
      </div>
    </div>
  );
}
