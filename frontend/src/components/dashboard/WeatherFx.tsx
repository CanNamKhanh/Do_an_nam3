"use client";

import { useEffect, useRef } from "react";
import type { ThemeKey } from "@/lib/weather";

type Mode = "rain" | "snow" | "fog" | "cloud" | "stars" | "sun" | "none";

interface Particle {
  x: number;
  y: number;
  v: number;
  r: number;
  a: number;
}
interface Puff {
  dx: number;
  dy: number;
  r: number;
}
interface Cloud {
  x: number;
  y: number;
  v: number;
  a: number;
  half: number;
  puffs: Puff[];
}

const WIND = -2; // px/frame ở 60fps, âm = gió thổi sang trái

const modeOf = (t: ThemeKey): Mode => {
  if (t === "rain" || t === "storm") return "rain";
  if (t === "snow") return "snow";
  if (t === "fog") return "fog";
  if (t.startsWith("cloud")) return "cloud";
  if (t === "clear-night") return "stars";
  if (t.startsWith("clear")) return "sun";
  return "none";
};

const rnd = (min: number, max: number): number =>
  min + Math.random() * (max - min);

/** Đám mây = cụm nhiều "bông" chồng nhau, đáy phẳng, giữa phồng. */
const makeCloud = (W: number, H: number, fog: boolean): Cloud => {
  const size = fog ? rnd(0.18, 0.3) * W : rnd(0.07, 0.14) * W;
  const n = fog ? 7 : Math.floor(rnd(5, 8));
  const puffs: Puff[] = Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const bulge = Math.sin(t * Math.PI);
    return {
      dx: (t - 0.5) * size * (fog ? 2.6 : 2.2),
      dy: fog
        ? rnd(-0.05, 0.05) * size
        : -bulge * size * 0.35 + rnd(-0.06, 0.06) * size,
      r: size * (fog ? rnd(0.5, 0.8) : (0.35 + bulge * 0.45) * rnd(0.85, 1.1)),
    };
  });
  return {
    x: rnd(-0.1, 1.1) * W,
    y: fog ? H * rnd(0.4, 0.95) : H * rnd(0.05, 0.5),
    v: fog ? rnd(0.15, 0.35) : rnd(0.12, 0.3),
    a: rnd(0.6, 1),
    half: size * 1.8,
    puffs,
  };
};

/** Canvas hiệu ứng: mưa, tuyết, sao, sương, mây, nắng. Giảm chuyển động → vẽ 1 khung tĩnh. */
export function WeatherFx({ theme }: { theme: ThemeKey }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const cx = cv?.getContext("2d");
    if (!cv || !cx) return;

    const mode = modeOf(theme);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0,
      H = 0,
      flash = 0,
      raf = 0,
      last = 0;
    let ps: Particle[] = [];
    let clouds: Cloud[] = [];

    const seed = (): void => {
      W = innerWidth;
      H = innerHeight;
      cv.width = Math.floor(W * dpr);
      cv.height = Math.floor(H * dpr);
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx.clearRect(0, 0, W, H);

      if (mode === "cloud" || mode === "fog") {
        clouds = Array.from({ length: mode === "fog" ? 8 : 7 }, () =>
          makeCloud(W, H, mode === "fog"),
        );
        ps = [];
      } else {
        const n =
          mode === "rain"
            ? Math.min(theme === "storm" ? 380 : 240, Math.floor(W / 4))
            : mode === "snow"
              ? 120
              : mode === "stars"
                ? 140
                : 0;
        ps = Array.from({ length: n }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          v: mode === "rain" ? rnd(14, 26) : rnd(0.6, 1.8),
          r: mode === "snow" ? rnd(0.8, 2.8) : rnd(0.5, 1.8),
          a: Math.random(),
        }));
        clouds = [];
      }
    };

    const drawRain = (dt: number): void => {
      const stormy = theme === "storm";
      // 2 lớp: xa (mảnh, mờ) và gần (dày, sáng) để có chiều sâu
      for (const near of [false, true]) {
        cx.lineWidth = near ? 1.6 : 1;
        cx.strokeStyle = near
          ? "rgba(210,228,255,.6)"
          : "rgba(190,210,245,.28)";
        cx.beginPath();
        for (const d of ps) {
          if (d.a > 0.5 !== near) continue;
          const len = (near ? 22 : 12) + d.r * 6;
          const k = len / d.v;
          cx.moveTo(d.x - WIND * k, d.y - d.v * k); // đuôi
          cx.lineTo(d.x, d.y); // đầu, cùng hướng với vector rơi
        }
        cx.stroke();
      }
      for (const d of ps) {
        const s = d.a > 0.5 ? 1 : 0.7;
        d.y += d.v * s * dt;
        d.x += WIND * s * dt;
        if (d.y > H + 30 || d.x < -30) {
          d.y = -30;
          d.x = Math.random() * (W + 60);
        }
      }
      if (stormy) {
        if (Math.random() < 0.006 * dt) flash = 1;
        if (flash > 0) {
          cx.fillStyle = `rgba(225,235,255,${flash * 0.4})`;
          cx.fillRect(0, 0, W, H);
          flash -= 0.07 * dt;
        }
      }
    };

    const drawSnow = (dt: number): void => {
      cx.fillStyle = "rgba(255,255,255,.9)";
      cx.beginPath();
      for (const d of ps) {
        cx.moveTo(d.x + d.r, d.y);
        cx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        d.y += d.v * (0.5 + d.r / 3) * dt;
        d.x += Math.sin(d.y / 40 + d.a * 6) * 0.6 * dt;
        if (d.y > H + 5) {
          d.y = -5;
          d.x = Math.random() * W;
        }
      }
      cx.fill();
    };

    const drawStars = (): void => {
      const t = Date.now() / 1000;
      for (const d of ps) {
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.7 + d.a * 9));
        const y = d.y * 0.85;
        cx.fillStyle = `rgba(255,255,255,${tw})`;
        cx.beginPath();
        cx.arc(d.x, y, d.r * 0.8, 0, Math.PI * 2);
        cx.fill();
        if (d.r > 1.4) {
          // sao to có quầng sáng
          const g = cx.createRadialGradient(d.x, y, 0, d.x, y, d.r * 5);
          g.addColorStop(0, `rgba(200,220,255,${tw * 0.35})`);
          g.addColorStop(1, "rgba(200,220,255,0)");
          cx.fillStyle = g;
          cx.fillRect(d.x - d.r * 5, y - d.r * 5, d.r * 10, d.r * 10);
        }
      }
    };

    const drawClouds = (dt: number): void => {
      const fog = mode === "fog";
      const night = theme === "cloud-night";
      const col = fog ? "232,238,242" : night ? "95,108,135" : "250,252,255";
      const al = fog ? 0.3 : night ? 0.5 : 0.6;
      for (const c of clouds) {
        for (const p of c.puffs) {
          const px = c.x + p.dx,
            py = c.y + p.dy;
          const g = cx.createRadialGradient(px, py, 0, px, py, p.r);
          g.addColorStop(0, `rgba(${col},${al * c.a})`);
          g.addColorStop(0.6, `rgba(${col},${al * c.a * 0.55})`);
          g.addColorStop(1, `rgba(${col},0)`);
          cx.fillStyle = g;
          cx.fillRect(px - p.r, py - p.r, p.r * 2, p.r * 2);
        }
        c.x += c.v * dt;
        if (c.x - c.half > W) c.x = -c.half;
      }
    };

    const drawSun = (): void => {
      const t = Date.now() / 1000;
      const sx = W * 0.82,
        sy = H * 0.14;
      const pulse = 1 + Math.sin(t * 0.8) * 0.04;
      const glow = cx.createRadialGradient(
        sx,
        sy,
        0,
        sx,
        sy,
        Math.max(W, H) * 0.5 * pulse,
      );
      glow.addColorStop(0, "rgba(255,236,170,.55)");
      glow.addColorStop(0.25, "rgba(255,220,140,.22)");
      glow.addColorStop(1, "rgba(255,220,140,0)");
      cx.fillStyle = glow;
      cx.fillRect(0, 0, W, H);
      // tia nắng quay chậm
      cx.save();
      cx.translate(sx, sy);
      cx.rotate(t * 0.03);
      cx.fillStyle = "rgba(255,240,190,.07)";
      const R = Math.hypot(W, H);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        cx.beginPath();
        cx.moveTo(0, 0);
        cx.lineTo(Math.cos(a - 0.05) * R, Math.sin(a - 0.05) * R);
        cx.lineTo(Math.cos(a + 0.05) * R, Math.sin(a + 0.05) * R);
        cx.closePath();
        cx.fill();
      }
      cx.restore();
    };

    const render = (dt: number): void => {
      cx.clearRect(0, 0, W, H);
      if (mode === "rain") drawRain(dt);
      else if (mode === "snow") drawSnow(dt);
      else if (mode === "stars") drawStars();
      else if (mode === "sun") drawSun();
      else drawClouds(dt);
    };

    const loop = (now: number): void => {
      const dt = last ? Math.min((now - last) / 16.667, 3) : 1; // chuẩn hoá theo 60fps
      last = now;
      render(dt);
      raf = requestAnimationFrame(loop);
    };

    seed();
    if (mode !== "none") {
      if (reduced) render(0);
      else raf = requestAnimationFrame(loop);
    }

    const onResize = (): void => {
      seed();
      if (reduced && mode !== "none") render(0);
    };
    addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", onResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      aria-hidden
    />
  );
}
