'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Project, Task } from './types';
import { loadProjects, saveProjects, loadTasks, saveTasks } from './storage';

interface State {
  projects: Project[];
  tasks: Task[];
  loaded: boolean;
}

type Action =
  | { type: 'INIT'; projects: Project[]; tasks: Task[] }
  | { type: 'ADD_PROJECT'; project: Project }
  | { type: 'UPDATE_PROJECT'; project: Project }
  | { type: 'DELETE_PROJECT'; id: string }
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'UPDATE_TASK'; task: Task }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'SET_TASKS'; tasks: Task[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INIT':
      return { projects: action.projects, tasks: action.tasks, loaded: true };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.project] };
    case 'UPDATE_PROJECT':
      return { ...state, projects: state.projects.map(p => p.id === action.project.id ? action.project : p) };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.id),
        tasks: state.tasks.map(t => t.projectId === action.id ? { ...t, projectId: null } : t),
      };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.task] };
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.task.id ? action.task : t) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.id) };
    case 'SET_TASKS':
      return { ...state, tasks: action.tasks };
    default:
      return state;
  }
}

interface ContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<ContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { projects: [], tasks: [], loaded: false });

  useEffect(() => {
    dispatch({ type: 'INIT', projects: loadProjects(), tasks: loadTasks() });
  }, []);

  useEffect(() => {
    if (state.loaded) {
      saveProjects(state.projects);
      saveTasks(state.tasks);
    }
  }, [state.projects, state.tasks, state.loaded]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
