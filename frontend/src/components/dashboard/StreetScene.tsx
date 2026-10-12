import type { CSSProperties, ReactNode } from "react";
import type { ThemeKey } from "@/lib/weather";

/* Sprite: SVG một màu (currentColor). Màu đổi theo data-theme trong globals.css. */
const Tree = ({ left, width }: { left: number; width: number }) => (
  <svg className="abs" style={{ left: `${left}%`, bottom: 2, width }} viewBox="0 0 40 70">
    <g className="sway"><rect x="18" y="38" width="4" height="32" /><circle cx="20" cy="26" r="15" /><circle cx="11" cy="37" r="9" /><circle cx="29" cy="37" r="9" /></g>
  </svg>
);
const Person = () => (
  <svg width="16" height="38" viewBox="0 0 16 38">
    <g className="bob"><circle cx="8" cy="5" r="3.6" /><rect x="3.5" y="9" width="9" height="15" rx="3.5" /><rect className="lg" x="4" y="23" width="3.2" height="14" rx="1.5" /><rect className="lg b" x="8.8" y="23" width="3.2" height="14" rx="1.5" /></g>
    <path className="umb" d="M-4 7Q8-7 20 7Z" /><rect className="umb" x="7.6" y="7" width="1" height="8" />
  </svg>
);
const Dog = () => (
  <svg width="28" height="18" viewBox="0 0 28 18"><ellipse cx="13" cy="8" rx="9" ry="4.5" /><circle cx="24" cy="5" r="3.5" /><path d="M4 6Q0 3 1 1 5 3 7 6Z" /><rect className="lg" x="7" y="10" width="2.4" height="8" rx="1" /><rect className="lg b" x="17" y="10" width="2.4" height="8" rx="1" /></svg>
);
const Bike = () => (
  <svg width="46" height="30" viewBox="0 0 46 30">
    <g fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="9" cy="23" r="5.5" /><circle cx="37" cy="23" r="5.5" /></g>
    <path d="M11 21Q15 13 23 14H31L36 21Z" /><circle cx="21" cy="5" r="3.2" /><rect x="17" y="9" width="8" height="10" rx="3" /><rect x="26" y="9" width="8" height="2" rx="1" /><circle className="hl" cx="43" cy="15" r="2.6" />
  </svg>
);
const Car = () => (
  <svg width="70" height="26" viewBox="0 0 70 26"><path d="M4 19V14Q4 11 8 10.5L18 8Q22 2 31 2H44Q50 2 54 8L63 10Q67 11 67 15V19Z" /><circle cx="16" cy="20" r="5" /><circle cx="54" cy="20" r="5" /><circle className="hl" cx="66" cy="13" r="2.8" /></svg>
);
const Bird = () => (
  <svg width="20" height="8" viewBox="0 0 20 8"><path className="wing" d="M0 6Q5 0 10 5Q15 0 20 6Q15 3 10 7Q5 3 0 6Z" /></svg>
);

interface MoverProps { children: ReactNode; duration: number; delay: number; reverse?: boolean; bottom?: number; top?: string; className?: string }
const Mover = ({ children, duration, delay, reverse, bottom, top, className }: MoverProps) => {
  const style: CSSProperties = { animationDuration: `${duration}s`, animationDelay: `${delay}s`, ...(top ? { top } : { bottom }) };
  return (
    <div className={`mover ${reverse ? "mover-r" : ""} ${className ?? ""}`} style={style}>
      <div style={{ transform: reverse ? "scaleX(-1)" : undefined }}>{children}</div>
    </div>
  );
};

/** Đường chân trời tạo một lần, cố định (không random mỗi lần render, tránh lệch hydration). */
const SKYLINE = (() => {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const out: { x: number; y: number; w: number; h: number }[] = [];
  for (let x = 0; x < 1700; ) {
    const w = 24 + rnd() * 50, h = 30 + rnd() * 80;
    out.push({ x: Math.round(x), y: Math.round(120 - h), w: Math.round(w), h: Math.round(h) });
    x += w + 2 + rnd() * 6;
  }
  return out;
})();

export function StreetScene({ theme }: { theme: ThemeKey }) {
  return (
    <div className="scene" data-theme={theme} aria-hidden>
      <svg className="abs bottom-0 left-0 h-[120px] w-full opacity-30" viewBox="0 0 1700 120" preserveAspectRatio="xMidYMax slice">
        {SKYLINE.map((b) => <rect key={b.x} x={b.x} y={b.y} width={b.w} height={b.h} />)}
      </svg>
      <div className="abs inset-x-0 bottom-0 h-0.5 bg-current opacity-50" />
      {[[4, 38], [15, 30], [31, 42], [55, 32], [72, 40], [90, 34]].map(([l, w]) => <Tree key={l} left={l} width={w} />)}

      <Mover duration={58} delay={-8} bottom={14}><Person /></Mover>
      <Mover duration={58} delay={-5.5} bottom={14}><Dog /></Mover>
      <Mover duration={70} delay={-34} bottom={14} reverse><Person /></Mover>
      <Mover duration={50} delay={-20} bottom={14}><Person /></Mover>

      <Mover duration={15} delay={-3} bottom={3}><Bike /></Mover>
      <Mover duration={19} delay={-11} bottom={3} reverse><Bike /></Mover>
      <Mover duration={13} delay={-8} bottom={3}><Bike /></Mover>
      <Mover duration={25} delay={-9} bottom={3}><Car /></Mover>
      <Mover duration={30} delay={-20} bottom={3} reverse><Car /></Mover>

      <Mover duration={46} delay={-10} top="14%" className="bird"><Bird /></Mover>
      <Mover duration={58} delay={-30} top="21%" className="bird" reverse><Bird /></Mover>
      <Mover duration={52} delay={-40} top="28%" className="bird"><Bird /></Mover>
    </div>
  );
}
