"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { getDisplay } from "@/services/display.service";
import type { DisplayResponse } from "@/types/display";

/** Polling theo poll_hint_seconds của API; lỗi thì giữ dữ liệu cũ và thử lại sau 15s. */
export function useDisplay(initial: DisplayResponse | null) {
  const [data, setData] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const ctrl = new AbortController();

    const run = async () => {
      try {
        const next = await getDisplay(ctrl.signal);
        if (!alive) return;
        setData(next);
        setError(null);
        timer = setTimeout(run, Math.max(10, next.poll_hint_seconds ?? 30) * 1000);
      } catch (e) {
        if (!alive || axios.isCancel(e)) return;
        setError("Mất kết nối máy chủ, đang thử lại");
        timer = setTimeout(run, 15_000);
      }
    };
    run();
    return () => {
      alive = false;
      ctrl.abort();
      clearTimeout(timer);
    };
  }, []);

  return { data, error };
}
