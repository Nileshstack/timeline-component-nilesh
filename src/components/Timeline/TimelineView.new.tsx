
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  TimelineViewProps,
  TimelineRow as RowType,
  TimelineTask,
} from '../../types/timeline.types';
import { useTimeline } from '../../hooks/useTimeline';
import TimelineGrid from './TimelineGrid';
import TimelineRow from './TimelineRow';
import TaskDetailSidebar from './TaskDetailSidebar';
import DependencyLine from './DependencyLine';
import { calculatePosition } from '../../utils/position.utils';

const LEFT_PANEL_WIDTH = 192;
const SAMPLE_ROWS: RowType[] = [
  { id: 'row-1', label: 'Frontend Team', tasks: ['task-1', 'task-2'] },
  { id: 'row-2', label: 'Backend Team', tasks: ['task-3'] },
  { id: 'row-3', label: 'Design Team', tasks: ['task-4'] },
];

const SAMPLE_TASKS: Record<string, TimelineTask> = {
  'task-1': {
    id: 'task-1',
    title: 'UI Component Development',
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 0, 15),
    progress: 60,
    assignee: 'Frontend Team',
    rowId: 'row-1',
    dependencies: [],
    color: '#3b82f6',
    isMilestone: false,
  },
  'task-2': {
    id: 'task-2',
    title: 'Integration Testing',
    startDate: new Date(2024, 0, 16),
    endDate: new Date(2024, 0, 25),
    progress: 0,
    assignee: 'Frontend Team',
    rowId: 'row-1',
    dependencies: ['task-1', 'task-3'],
    color: '#3b82f6',
    isMilestone: false,
  },
  'task-3': {
    id: 'task-3',
    title: 'API Development',
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 0, 14),
    progress: 80,
    assignee: 'Backend Team',
    rowId: 'row-2',
    dependencies: [],
    color: '#10b981',
    isMilestone: false,
  },
  'task-4': {
    id: 'task-4',
    title: 'Design System Update',
    startDate: new Date(2024, 0, 5),
    endDate: new Date(2024, 0, 12),
    progress: 100,
    assignee: 'Design Team',
    rowId: 'row-3',
    dependencies: [],
    color: '#f59e0b',
    isMilestone: false,
  },
};

interface DependencyLineData {
  fromTask: TimelineTask;
  toTask: TimelineTask;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export const TimelineView: React.FC<Partial<TimelineViewProps>> = ({
  rows,
  tasks,
  startDate,
  endDate,
  viewMode,
}) => {
  const rowsData = rows ?? SAMPLE_ROWS;
  const tasksData = tasks ?? SAMPLE_TASKS;

  const now = new Date();
  const tl = useTimeline(now);

  const viewStart = startDate ?? tl.startDate;
  const viewEnd = endDate ?? tl.endDate;
  const pixelsPerDay = tl.pixelsPerDay;
  const mode = viewMode ?? tl.viewMode;

  const [selectedTask, setSelectedTask] = useState<TimelineTask | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const x = calculatePosition(new Date(), viewStart, pixelsPerDay) - 200;
    scrollRef.current.scrollLeft = Math.max(0, x);
  }, [viewStart, pixelsPerDay]);

  const dependencyLines = useMemo(() => {
    const lines: DependencyLineData[] = [];

    Object.values(tasksData).forEach((task) => {
      task.dependencies?.forEach((depId) => {
        const fromTask = tasksData[depId];
        if (!fromTask) return;

        const fromX = calculatePosition(fromTask.endDate, viewStart, pixelsPerDay);
        const fromY =
          rowsData.findIndex((r) => r.id === fromTask.rowId) * 56 + 24;
        const toX = calculatePosition(task.startDate, viewStart, pixelsPerDay);
        const toY = rowsData.findIndex((r) => r.id === task.rowId) * 56 + 24;

        lines.push({ fromTask, toTask: task, fromX, fromY, toX, toY });
      });
    });

    return lines;
  }, [tasksData, rowsData, viewStart, pixelsPerDay]);

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-50 via-sky-50 to-blue-100 rounded-b-xl shadow-inner">
 
      <div className="flex items-center justify-between px-5 py-3 bg-white/60 backdrop-blur-md border-b border-white/30 sticky top-0 z-20 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-700">
          Timeline Overview
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={tl.zoomOut}
            className="px-2 py-1 text-sm rounded-md border border-neutral-300 hover:bg-neutral-100"
          >
            –
          </button>
          <button
            onClick={tl.zoomIn}
            className="px-2 py-1 text-sm rounded-md border border-neutral-300 hover:bg-neutral-100"
          >
            +
          </button>
          <button
            onClick={tl.scrollToToday}
            className="px-3 py-1 text-sm rounded-md bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-sm hover:opacity-90 transition"
          >
            Today
          </button>
        </div>
      </div>
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
          className="bg-white/70 backdrop-blur-sm border-r border-neutral-200"
        >
          <div className="h-12 border-b border-neutral-100 bg-white/60" />
          {rowsData.map((row) => (
            <div
              key={row.id}
              className="h-14 flex items-center px-4 border-b border-neutral-100 hover:bg-blue-50/60 transition"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-xs text-neutral-600 shadow-sm">
                  {row.label.charAt(0)}
                </div>
                <span className="text-sm font-medium text-neutral-800 truncate">
                  {row.label}
                </span>
              </div>
            </div>
          ))}
        </div>


        <div className="flex-1 overflow-auto relative" ref={scrollRef}>
          <div className="min-w-[1200px] relative">

            <div className="absolute inset-0 pointer-events-none z-10">
              {dependencyLines.map((line) => (
                <DependencyLine
                  key={`${line.fromTask.id}-${line.toTask.id}`}
                  x1={line.fromX}
                  y1={line.fromY}
                  x2={line.toX}
                  y2={line.toY}
                />
              ))}
            </div>


            <div>
              {rowsData.map((row) => (
                <TimelineRow
                  key={row.id}
                  row={row}
                  tasksMap={tasksData}
                  viewStartDate={viewStart}
                  pixelsPerDay={pixelsPerDay}
                  onTaskClick={setSelectedTask}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <TaskDetailSidebar
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
};

export default TimelineView;
