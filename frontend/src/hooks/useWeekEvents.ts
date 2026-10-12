"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { getWeekEvents } from "@/services/events.client";
import type { DisplayEvent } from "@/types/display";

const REFRESH_MS = 30_000;

export function useWeekEvents() {
  const [events, setEvents] = useState<DisplayEvent[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const ctrl = new AbortController();

    const run = async () => {
      try {
        const next = await getWeekEvents(ctrl.signal);
        if (!alive) return;
        setEvents(next);
        setFailed(false);
      } catch (e) {
        if (axios.isCancel(e) || !alive) return;
        setFailed(true);
      }
      if (alive) timer = setTimeout(run, REFRESH_MS);
    };
    run();

    return () => {
      alive = false;
      ctrl.abort();
      clearTimeout(timer);
    };
  }, []);

  return { events, failed };
}
