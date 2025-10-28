import { useCallback, useMemo, useState } from "react";
import { ViewMode } from "@/types/timeline.types";

interface TimelineState {
  viewMode: ViewMode;
  startDate: Date;
  endDate: Date;
  pixelsPerDay: number;
}

export const useTimeline = (initialDate: Date = new Date()) => {
  const [state, setState] = useState<TimelineState>({
    viewMode: "week",
    startDate: new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
    endDate: new Date(initialDate.getFullYear(), initialDate.getMonth() + 3, 0),
    pixelsPerDay: 40,
  });

  const zoomIn = useCallback(() => {
    setState((prev) => {
      switch (prev.viewMode) {
        case "month":

          return { ...prev, viewMode: "week", pixelsPerDay: 40 };
        case "week":

          return { ...prev, viewMode: "day", pixelsPerDay: 120 };
        default:
          return prev;
      }
    });
  }, []);

  const zoomOut = useCallback(() => {
    setState((prev) => {
      switch (prev.viewMode) {
        case "day":
          return { ...prev, viewMode: "week", pixelsPerDay: 40 };
        case "week":
          return { ...prev, viewMode: "month", pixelsPerDay: 12 };
        default:
          return prev;
      }
    });
  }, []);

  const scrollToToday = useCallback(() => {
    const today = new Date();
    setState((prev) => ({
      ...prev,
      startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      endDate: new Date(today.getFullYear(), today.getMonth() + 2, 0),
    }));
  }, []);

  return useMemo(
    () => ({
      ...state,
      zoomIn,
      zoomOut,
      scrollToToday,
    }),
    [state, zoomIn, zoomOut, scrollToToday]
  );
};
