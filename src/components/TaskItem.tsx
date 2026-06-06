'use client';

import { useState } from 'react';
import { Task, Project } from '@/lib/types';
import { useApp } from '@/lib/context';
import TaskForm from './TaskForm';

interface TaskItemProps {
  task: Task;
  project?: Project;
  showProject?: boolean;
}

function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return `${Math.abs(diff)}日超過`;
  if (diff === 0) return '今日';
  if (diff === 1) return '明日';
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function dueDateClass(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return 'bg-red-100 text-red-600';
  if (diff === 0) return 'bg-orange-100 text-orange-600';
  return 'bg-slate-100 text-slate-500';
}

export default function TaskItem({ task, project, showProject = true }: TaskItemProps) {
  const { dispatch } = useApp();
  const [showEdit, setShowEdit] = useState(false);

  const toggleComplete = () => {
    dispatch({
      type: 'UPDATE_TASK',
      task: { ...task, completedAt: task.completedAt ? null : new Date().toISOString() },
    });
  };

  const toggleToday = () => {
    dispatch({ type: 'UPDATE_TASK', task: { ...task, isTodayTask: !task.isTodayTask } });
  };

  const handleDelete = () => {
    if (confirm(`「${task.name}」を削除しますか？`)) {
      dispatch({ type: 'DELETE_TASK', id: task.id });
    }
  };

  const hasBadges = (showProject && project) || task.effort != null || task.dueDate;

  return (
    <>
      <div className="flex items-start gap-3 px-4 py-3">
        <button
          onClick={toggleComplete}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.completedAt
              ? 'bg-blue-500 border-blue-500'
              : 'border-slate-300'
          }`}
        >
          {task.completedAt && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm leading-snug ${task.completedAt ? 'line-through text-slate-400' : 'text-slate-700'}`}>
            {task.name}
          </p>
          {hasBadges && (
            <div className="flex flex-wrap gap-1 mt-1">
              {showProject && project && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full text-white font-medium"
                  style={{ backgroundColor: project.color }}
                >
                  {project.name}
                </span>
              )}
              {task.effort != null && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                  {task.effort}h
                </span>
              )}
              {task.dueDate && (
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${dueDateClass(task.dueDate)}`}>
                  {formatDueDate(task.dueDate)}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={toggleToday}
            title={task.isTodayTask ? '今日のタスクから外す' : '今日のタスクにする'}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              task.isTodayTask ? 'text-yellow-400' : 'text-slate-300'
            }`}
          >
            ☀
          </button>
          <button
            onClick={() => setShowEdit(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 transition-colors"
          >
            ✎
          </button>
          <button
            onClick={handleDelete}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {showEdit && <TaskForm task={task} onClose={() => setShowEdit(false)} />}
    </>
  );
}
