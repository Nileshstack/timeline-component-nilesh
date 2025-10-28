"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  TimelineViewProps,
  TimelineRow as RowType,
  TimelineTask,
} from "../../types/timeline.types";
import { useTimeline } from "../../hooks/useTimeline";
import TimelineGrid from "./TimelineGrid";
import TimelineRow from "./TimelineRow";
import TaskDetailSidebar from "./TaskDetailSidebar";
import DependencyLine from "./DependencyLine";
import { calculatePosition } from "../../utils/position.utils";

const LEFT_PANEL_WIDTH = 192;

const sampleRows: RowType[] = [
  { id: "1", label: "Frontend Tasks", tasks: ["t1"] },
  { id: "2", label: "Backend Tasks", tasks: ["t2"] },
  { id: "3", label: "Design Tasks", tasks: ["t3"] },
  { id: "4", label: "Testing Tasks", tasks: ["t4"] },
];

const sampleTasks: Record<string, TimelineTask> = {
  t1: {
    id: "t1",
    rowId: "1",
    title: "Implement UI Components",
    startDate: new Date(2025, 9, 25),
    endDate: new Date(2025, 9, 30),
    progress: 70,
    dependencies: [],
  },
  t2: {
    id: "t2",
    rowId: "2",
    title: "API Development",
    startDate: new Date(2025, 9, 26),
    endDate: new Date(2025, 10, 2),
    progress: 45,
    dependencies: ["t1"],
  },
  t3: {
    id: "t3",
    rowId: "3",
    title: "Design System",
    startDate: new Date(2025, 9, 27),
    endDate: new Date(2025, 10, 1),
    progress: 30,
    dependencies: [],
  },
  t4: {
    id: "t4",
    rowId: "4",
    title: "Unit Testing",
    startDate: new Date(2025, 9, 28),
    endDate: new Date(2025, 10, 3),
    progress: 0,
    dependencies: ["t1", "t2"],
  },
};

export const TimelineView: React.FC<Partial<TimelineViewProps>> = ({
  rows,
  tasks,
  startDate,
  endDate,
  viewMode,
}) => {
  const rowsData = rows ?? sampleRows;
  const initialTasks = tasks ?? sampleTasks;
  const now = new Date();
  const tl = useTimeline(now);
  const viewStart = startDate ?? tl.startDate;
  const viewEnd = endDate ?? tl.endDate;
  const pixelsPerDay = tl.pixelsPerDay;
  const mode = viewMode ?? tl.viewMode;

  const [selectedTask, setSelectedTask] = useState<TimelineTask | null>(null);
  const [tasksMap, setTasksMap] = useState<Record<string, TimelineTask>>(initialTasks);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const x = calculatePosition(new Date(), viewStart, pixelsPerDay) - 240;
    scrollRef.current.scrollLeft = Math.max(0, x);
  }, [viewStart, pixelsPerDay]);

  useEffect(() => {
    setTasksMap(initialTasks);
  }, [initialTasks]);

  const handleTaskUpdate = useCallback((id: string, updates: Partial<TimelineTask>) => {
    setTasksMap((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      const updated: TimelineTask = { ...existing, ...updates };
      return { ...prev, [id]: updated };
    });
    setSelectedTask((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev));
  }, []);

  const todayLeft = calculatePosition(new Date(), viewStart, pixelsPerDay);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-blue-100 shadow-md">
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/30 bg-white/70 backdrop-blur-md sticky top-0 z-20 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => tl.zoomOut()}
            className="px-3 py-1.5 text-sm rounded-md border border-neutral-300 bg-white/60 hover:bg-white/80 active:scale-[0.97] shadow-sm transition"
          >
            −
          </button>
          <button
            onClick={() => tl.zoomIn()}
            className="px-3 py-1.5 text-sm rounded-md border border-neutral-300 bg-white/60 hover:bg-white/80 active:scale-[0.97] shadow-sm transition"
          >
            +
          </button>
          <button
            onClick={() => tl.scrollToToday()}
            className="px-3 py-1.5 text-sm rounded-md border border-neutral-300 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium hover:opacity-90 active:scale-[0.97] shadow transition"
          >
            Today
          </button>
        </div>
        <div className="text-sm text-neutral-700 font-medium">
          View Mode:{" "}
          <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent capitalize">
            {mode}
          </span>
        </div>
      </header>

      <TimelineGrid
        viewStartDate={viewStart}
        viewEndDate={viewEnd}
        viewMode={mode}
        pixelsPerDay={pixelsPerDay}
        leftPanelWidth={LEFT_PANEL_WIDTH}
      />

      <div className="flex relative">
        <div
          style={{ width: LEFT_PANEL_WIDTH }}
          className="bg-white/80 border-r border-neutral-200 backdrop-blur-sm"
        >
          <div className="h-12 border-b border-neutral-100 bg-gradient-to-r from-slate-100 to-white" />
          {rowsData.map((r) => (
            <div
              key={r.id}
              className="h-14 flex items-center px-4 border-b border-neutral-100 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-sky-200 flex items-center justify-center text-xs text-sky-700 font-semibold shadow-sm">
                  {r.label.charAt(0)}
                </div>
                <span className="text-sm font-medium text-neutral-800 truncate">
                  {r.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-auto relative" ref={scrollRef}>
          <div className="min-w-[1200px] relative">
            <div className="absolute inset-0 pointer-events-none z-10">
              {Object.values(tasksMap).flatMap((t) =>
                (t.dependencies || []).map((depId) => {
                  const from = tasksMap[depId];
                  if (!from) return null;
                  const fx =
                    calculatePosition(from.endDate, viewStart, pixelsPerDay) + 10;
                  const fy =
                    rowsData.findIndex((r) => r.id === from.rowId) * 56 + 24;
                  const tx = calculatePosition(
                    t.startDate,
                    viewStart,
                    pixelsPerDay
                  );
                  const ty =
                    rowsData.findIndex((r) => r.id === t.rowId) * 56 + 24;
                  return (
                    <DependencyLine
                      key={`${from.id}-${t.id}`}
                      x1={fx}
                      y1={fy}
                      x2={tx}
                      y2={ty}
                    />
                  );
                })
              )}
            </div>

            <div>
              {rowsData.map((r) => (
                <div key={r.id} className="relative h-14">
                  <TimelineRow
                    row={r}
                    tasksMap={tasksMap}
                    viewStartDate={viewStart}
                    pixelsPerDay={pixelsPerDay}
                    onTaskClick={(t) => setSelectedTask(t)}
                  />
                </div>
              ))}
            </div>

            <div
              style={{ left: `${todayLeft}px` }}
              className="absolute top-12 bottom-0 w-[2px] bg-gradient-to-b from-red-500 to-orange-400 z-30 shadow-md"
            >
              <div className="absolute -top-6 -translate-x-1/2 text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 rounded-full shadow">
                Today
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskDetailSidebar
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onSave={handleTaskUpdate}
      />
    </div>
  );
};

export default TimelineView;
