export interface TimelineTask {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number; 
  assignee?: string;
  rowId: string;
  dependencies?: string[];
  color?: string;
  isMilestone?: boolean;
}

export interface TimelineRow {
  id: string;
  label: string;
  avatar?: string;
  tasks: string[]; 
}

export type ViewMode = 'day' | 'week' | 'month';

export interface TimelineViewProps {
  rows: TimelineRow[];
  tasks: Record<string, TimelineTask>;
  startDate: Date;
  endDate: Date;
  viewMode: ViewMode;
  onTaskUpdate?: (taskId: string, updates: Partial<TimelineTask>) => void;
  onTaskMove?: (taskId: string, newRowId: string, newStartDate: Date) => void;
}
