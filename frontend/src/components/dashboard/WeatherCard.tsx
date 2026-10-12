import { WeatherIcon } from "./WeatherIcon";
import type { Weather } from "@/types/display";

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-white/20 sm:[&:not(:first-child)]:pl-3.5">
    <b className="mb-0.5 block text-xl font-medium">{value}</b>
    <span className="text-[10.5px] uppercase tracking-[.08em] text-white/70">
      {label}
    </span>
  </div>
);

export function WeatherCard({
  weather,
  night,
}: {
  weather: Weather | null;
  night: boolean;
}) {
  if (!weather) {
    return (
      <div className="panel mt-9 p-6 text-white/70">
        Chưa có dữ liệu thời tiết. Đang chờ máy chủ phản hồi…
      </div>
    );
  }
  const { current: c, daily: d } = weather;
  const icon = c.weather_code === 0 && night ? "moon" : c.weather_icon;
  return (
    <div className="panel mt-9 grid gap-5 p-10 sm:grid-cols-[auto_1fr] sm:items-center">
      <WeatherIcon name={icon} className="h-[88px] w-[88px]" />
      <div>
        <div className="text-[68px] font-light leading-none tracking-[-2px]">
          {Math.round(c.temperature_2m)}
          <sup className="align-top text-[.4em] font-normal">°C</sup>
        </div>
        <div className="mt-1.5 text-lg font-medium">{c.weather_text}</div>
        <div className="text-[13px] text-white/70">
          Cao nhất {Math.round(d.temperature_2m_max)}° · Thấp nhất{" "}
          {Math.round(d.temperature_2m_min)}°
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-white/20 pt-4 sm:col-span-2 sm:grid-cols-4">
        <Stat
          value={`${Math.round(c.apparent_temperature)}°`}
          label="Cảm giác như"
        />
        <Stat value={`${c.relative_humidity_2m}%`} label="Độ ẩm" />
        <Stat value={`${c.wind_speed_10m} m/s`} label="Gió" />
        <Stat
          value={`${d.precipitation_probability_max}%`}
          label="Khả năng mưa"
        />
      </div>
    </div>
  );
}
