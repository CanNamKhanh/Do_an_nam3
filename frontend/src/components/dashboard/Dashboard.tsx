"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Maximize2, Pin } from "./icons";
import { useClock } from "@/hooks/useClock";
import { useDisplay } from "@/hooks/useDisplay";
import { describe, isNight, themeOf } from "@/lib/weather";
import type { DisplayResponse } from "@/types/display";
import { Clock } from "./Clock";
import { DayTimeline } from "./DayTimeline";
import { EventList } from "./EventList";
import { StreetScene } from "./StreetScene";
import { WeatherBackground } from "./WeatherBackground";
import { WeatherCard } from "./WeatherCard";
import { useWeekEvents } from "@/hooks/useWeekEvents";
import { WeekAgenda } from "./WeekAgenda";

interface Props {
  initial: DisplayResponse | null;
  agencyName: string;
  previewCode?: number;
}

export function Dashboard({ initial, agencyName, previewCode }: Props) {
  const { data, error } = useDisplay(initial);
  const now = useClock();

  const weather = useMemo(() => {
    if (!data) return null;
    if (previewCode === undefined) return data.weather;
    const d = describe(previewCode);
    return {
      ...data.weather,
      current: {
        ...data.weather.current,
        weather_code: previewCode,
        weather_text: d.text,
        weather_icon: d.icon,
      },
    };
  }, [data, previewCode]);

  const night = isNight(now?.getHours() ?? 12);
  const theme = themeOf(weather?.current.weather_code ?? 0, night);
  const { events, failed: eventsFailed } = useWeekEvents();

  return (
    <>
      <WeatherBackground theme={theme} />
      <StreetScene theme={theme} />
      <div className="mx-auto flex min-h-screen max-w-[1240px] flex-col px-4 pb-36 pt-7 sm:px-7">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/avt.png"
              className="grid h-9 w-9 place-items-center rounded border border-white/35 bg-white/10 text-[15px] font-bold object-cover"
            />
            <div>
              <div className="text-[15px] font-semibold tracking-wide">
                {agencyName}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-white/70">
                <Pin />
                {weather?.location ?? "—"}
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Toàn màn hình"
            title="Toàn màn hình"
            className="btn grid cursor-pointer place-items-center !p-2.5"
            onClick={() =>
              (document.fullscreenElement
                ? document.exitFullscreen()
                : document.documentElement.requestFullscreen()
              ).catch(() => {})
            }
          >
            <Maximize2 />
          </button>
        </header>

        <main className="mt-9 grid flex-1 items-start gap-5 lg:grid-cols-[1.25fr_1fr]">
          <section>
            <Clock now={now} />
            <WeatherCard weather={weather} night={night} />
            <DayTimeline events={events ?? []} now={now} />{" "}
          </section>
          <aside>
            <EventList events={events} failed={eventsFailed} now={now} />
            <WeekAgenda events={events} now={now} />
          </aside>
        </main>

        <footer className="mt-7 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
          <Link href="/admin" className="btn cursor-pointer !py-1.5 text-xs">
            Đăng nhập quản trị
          </Link>
          <span>
            <i
              className={`mr-1.5 inline-block h-[7px] w-[7px] rounded-full ${error || weather?.stale ? "bg-amber-400" : "bg-emerald-400"}`}
            />
            {error ??
              (weather
                ? `Thời tiết cập nhật ${weather.age_minutes < 1 ? "vừa xong" : `${Math.round(weather.age_minutes)} phút trước`}`
                : "Đang đồng bộ…")}
          </span>
        </footer>
      </div>
    </>
  );
}
