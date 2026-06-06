export interface Project {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Task {
  id: string;
  name: string;
  projectId: string | null;
  effort: number | null;
  dueDate: string | null;
  completedAt: string | null;
  isTodayTask: boolean;
  order: number;
}
