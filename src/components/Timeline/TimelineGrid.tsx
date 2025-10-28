import React from "react";
import { generateTimeScale } from "../../utils/position.utils";
import { ViewMode } from "../../types/timeline.types";

interface TimelineGridProps {
  viewStartDate: Date;
  viewEndDate: Date;
  viewMode: ViewMode;
  pixelsPerDay: number;
  leftPanelWidth?: number;
}

export const TimelineGrid: React.FC<TimelineGridProps> = ({
  viewStartDate,
  viewEndDate,
  viewMode,
  pixelsPerDay,
  leftPanelWidth = 192,
}) => {
  const scale = generateTimeScale(viewStartDate, viewEndDate, viewMode);
  const colWidth =
    viewMode === "day"
      ? pixelsPerDay
      : viewMode === "week"
      ? pixelsPerDay * 7
      : pixelsPerDay * 30;

  const totalWidth = scale.length * colWidth;

  return (
    <div className="sticky top-0 z-30 border-b border-white/40 bg-gradient-to-r from-white via-sky-50/50 to-blue-50/50 backdrop-blur-md shadow-sm">
      <div className="flex items-center">
        <div
          style={{ width: leftPanelWidth }}
          className="shrink-0 px-4 py-3 bg-gradient-to-br from-slate-50 to-sky-50 border-r border-white/30"
        />
        <div className="flex-1 overflow-x-auto">
          <div className="relative h-12">
            <div
              className="absolute inset-y-0 left-0 flex"
              style={{ width: totalWidth }}
            >
              {scale.map((s) => (
                <div
                  key={s.date.toISOString()}
                  className="flex flex-col items-center justify-center border-r border-white/30 text-xs text-neutral-700 font-medium bg-gradient-to-b from-white to-sky-50/40 hover:from-sky-50/80 hover:to-blue-100/60 transition-colors duration-200"
                  style={{
                    width: colWidth,
                    padding: "0.75rem 0.5rem",
                  }}
                >
                  <div className="whitespace-nowrap">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/30" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineGrid;
