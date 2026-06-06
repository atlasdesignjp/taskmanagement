import { Project, Task } from './types';

const PROJECTS_KEY = 'tm:projects';
const TASKS_KEY = 'tm:tasks';

export function loadProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }
}

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }
}
