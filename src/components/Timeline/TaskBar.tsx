import React from 'react';
import { TimelineTask } from '../../types/timeline.types';
import { formatDateShort } from '../../utils/date.utils';
import clsx from 'clsx';
interface TaskBarProps {
  task: TimelineTask;
  left: number;
  width: number;
  onClick?: (task: TimelineTask) => void;
}

export const TaskBar: React.FC<TaskBarProps> = ({
  task,
  left,
  width,
  onClick,
}) => {
  const height = task.isMilestone ? 24 : 36;
  const bg = task.color || '#0ea5e9'; 

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${task.title}. From ${formatDateShort(task.startDate)} to ${formatDateShort(
        task.endDate
      )}. Progress: ${task.progress}%. Press Enter to open details.`}
      onClick={() => onClick?.(task)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.(task);
      }}
      className={clsx(
        'absolute rounded-xl select-none cursor-pointer overflow-hidden',
        'shadow-sm hover:shadow-md focus:outline-none',
        'transition-all duration-150 will-change-transform',
        'ring-offset-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-white'
      )}
      style={{
        left: `${left}px`,
        width: `${Math.max(36, width)}px`,
        top: '8px',
        height,
        background: `linear-gradient(180deg, ${bg}, ${shadeColor(bg, -15)})`,
        color: '#fff',
      }}
    >
      {/* Content */}
      <div className="flex items-center justify-between h-full px-3">
        <span
          className="text-sm font-medium truncate"
          title={task.title}
        >
          {task.title}
        </span>

        {!task.isMilestone && (
          <span className="text-xs font-semibold opacity-90">
            {task.progress}%
          </span>
        )}
      </div>
      {!task.isMilestone && (
        <div
          className="absolute bottom-0 left-0 h-1.5 bg-white/40 rounded-b-sm transition-all"
          style={{ width: `${task.progress}%` }}
        />
      )}

      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/40 opacity-0 hover:opacity-100 transition-opacity"
        aria-hidden
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/40 opacity-0 hover:opacity-100 transition-opacity"
        aria-hidden
      />
    </div>
  );
};

export default TaskBar;

function shadeColor(hex: string, percent: number): string {
  try {
    const c = hex.replace('#', '');
    const num = parseInt(c, 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return hex;
  }
}
