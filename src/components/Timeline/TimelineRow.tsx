import React from "react";
import { TimelineRow as RowType, TimelineTask } from "../../types/timeline.types";
import TaskBar from "./TaskBar";
import { calculatePosition, calculateDuration } from "../../utils/position.utils";

interface TimelineRowProps {
  row: RowType;
  tasksMap: Record<string, TimelineTask>;
  viewStartDate: Date;
  pixelsPerDay: number;
  rowHeight?: number;
  onTaskClick?: (task: TimelineTask) => void;
}

export const TimelineRow: React.FC<TimelineRowProps> = ({
  row,
  tasksMap,
  viewStartDate,
  pixelsPerDay,
  rowHeight = 56,
  onTaskClick,
}) => {
  return (
    <div
      className="flex border-b border-white/40 bg-gradient-to-r from-white via-sky-50/30 to-blue-50/40 transition-all hover:from-sky-50/60 hover:to-blue-100/60 duration-200 backdrop-blur-sm"
      style={{ minHeight: rowHeight }}
      role="region"
      aria-label={`${row.label} timeline. ${row.tasks.length} tasks.`}
    >
      <div className="w-48 shrink-0 px-3 py-3 border-r border-white/40 flex items-center bg-gradient-to-br from-slate-50 to-sky-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-sky-200 flex items-center justify-center text-xs text-sky-700 font-semibold shadow-sm">
            {row.label.charAt(0)}
          </div>
          <div className="text-sm font-medium text-neutral-800 truncate">
            {row.label}
          </div>
        </div>
      </div>

      <div className="relative flex-1 px-3 py-2">
        <div style={{ minHeight: rowHeight - 8 }}>
          {row.tasks.map((taskId) => {
            const t = tasksMap[taskId];
            if (!t) return null;
            const left = calculatePosition(t.startDate, viewStartDate, pixelsPerDay);
            const width = calculateDuration(t.startDate, t.endDate, pixelsPerDay);
            return (
              <TaskBar
                key={t.id}
                task={t}
                left={left}
                width={width}
                onClick={onTaskClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimelineRow;
