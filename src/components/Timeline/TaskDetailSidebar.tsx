import React, { useState, useEffect } from "react";
import { TimelineTask } from "../../types/timeline.types";

interface SidebarProps {
  task?: TimelineTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (id: string, updates: Partial<TimelineTask>) => void;
}

export const TaskDetailSidebar: React.FC<SidebarProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(task?.title ?? "");
  const [progress, setProgress] = useState(task?.progress ?? 0);
  const [notes, setNotes] = useState("");
  const [assignee, setAssignee] = useState<string | undefined>(
    task?.assignee ?? undefined
  );
  const [startStr, setStartStr] = useState(task ? toDateInput(task.startDate) : "");
  const [endStr, setEndStr] = useState(task ? toDateInput(task.endDate) : "");

  useEffect(() => {
    setTitle(task?.title ?? "");
    setProgress(task?.progress ?? 0);
    setNotes("");
    setAssignee(task?.assignee ?? undefined);
    setStartStr(task ? toDateInput(task.startDate) : "");
    setEndStr(task ? toDateInput(task.endDate) : "");
  }, [task?.id]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    const updates: Partial<TimelineTask> = { title, progress, assignee };
    if (startStr) updates.startDate = new Date(startStr);
    if (endStr) updates.endDate = new Date(endStr);
    onSave?.(task.id, updates);
    onClose();
  };

  return (
    <aside
      className={`fixed right-0 top-0 h-full w-full md:w-96 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-50 bg-gradient-to-b from-white/90 via-blue-50/80 to-sky-100/80 backdrop-blur-xl border-l border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.1)]`}
    >
      <div className="flex items-start justify-between gap-3 p-6 border-b border-white/40 bg-gradient-to-r from-sky-50/90 to-white/70 backdrop-blur-md">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">{task.title}</h3>
          <p className="text-xs text-neutral-500 mt-1">
            Assignee:{" "}
            <span className="font-medium text-neutral-800">
              {task.assignee ?? "Unassigned"}
            </span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-sm text-neutral-500 hover:text-neutral-800 rounded-md px-2 py-1 transition"
        >
          ✕
        </button>
      </div>

      <div className="p-6 space-y-5 text-sm text-neutral-700 overflow-y-auto h-[calc(100%-72px)]">
        <label className="block">
          <span className="text-xs text-neutral-600">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white/60 backdrop-blur-sm"
          />
        </label>

        <label className="block">
          <span className="text-xs text-neutral-600">Assignee</span>
          <input
            value={assignee ?? ""}
            onChange={(e) => setAssignee(e.target.value || undefined)}
            placeholder="Unassigned"
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white/60 backdrop-blur-sm"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs text-neutral-600">Start Date</span>
            <input
              type="date"
              value={startStr}
              onChange={(e) => setStartStr(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white/60 backdrop-blur-sm"
            />
          </label>

          <label className="block">
            <span className="text-xs text-neutral-600">End Date</span>
            <input
              type="date"
              value={endStr}
              onChange={(e) => setEndStr(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white/60 backdrop-blur-sm"
            />
          </label>
        </div>

        <label className="block">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-neutral-600">Progress</span>
            <span className="text-sm font-medium text-neutral-800">{progress}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </label>

        <label className="block">
          <span className="text-xs text-neutral-600">Notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            placeholder="Add any notes about this task..."
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none bg-white/60 backdrop-blur-sm"
          />
        </label>

        <div className="flex items-center justify-between pt-3">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white px-4 py-2 rounded-lg shadow-md transition active:scale-[0.98]"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 rounded-lg hover:bg-white/40 transition backdrop-blur-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </aside>
  );
};

export default TaskDetailSidebar;

function toDateInput(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
