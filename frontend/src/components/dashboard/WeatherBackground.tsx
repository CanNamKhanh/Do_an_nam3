import { GRADIENTS, MEDIA, type ThemeKey } from "@/lib/weather";
import { WeatherFx } from "./WeatherFx";

export function WeatherBackground({ theme }: { theme: ThemeKey }) {
  const media = MEDIA[theme];
  return (
    <>
      <div className="fixed inset-0 -z-30 transition-[background] duration-[1600ms]" style={{ background: GRADIENTS[theme] }} aria-hidden>
        {media?.video && <video key={media.video} src={media.video} poster={media.image} autoPlay muted loop playsInline className="h-full w-full object-cover" />}
        {!media?.video && media?.image && <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${media.image})` }} />}
      </div>
      <WeatherFx theme={theme} />
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(120%_90%_at_50%_30%,transparent_45%,rgba(0,0,0,.38)),linear-gradient(180deg,rgba(0,0,0,.1),rgba(0,0,0,.22))]" aria-hidden />
    </>
  );
}
