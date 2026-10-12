const CLOUD = "M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 8.5 4.75 4.75 0 0 1 17 18z";
const PATHS: Record<string, string[]> = {
  sun: ["M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M12 2.5v2.3M12 19.2v2.3M2.5 12h2.3M19.2 12h2.3M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"],
  moon: ["M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"],
  "cloud-sun": ["M12 3v1.5M4.2 6.2l1 1M20 12h1.5M17.8 6.2l-1 1", "M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z", CLOUD],
  cloud: [CLOUD],
  fog: ["M4 9h16M3 13h18M6 17h12"],
  rain: [CLOUD, "M8 20.5l-1 2M12 20.5l-1 2M16 20.5l-1 2"],
  snow: [CLOUD, "M8 21h.01M12 21h.01M16 21h.01M10 23h.01M14 23h.01"],
  bolt: [CLOUD, "M12 13l-2 4h3l-2 4"],
};

export function WeatherIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {(PATHS[name] ?? PATHS.cloud).map((d) => <path key={d} d={d} />)}
    </svg>
  );
}
