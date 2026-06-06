'use client';

import { useApp } from '@/lib/context';
import TaskItem from '@/components/TaskItem';

export default function CompletedPage() {
  const { state } = useApp();

  const completedTasks = state.tasks
    .filter(t => t.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

  const getProject = (projectId: string | null) =>
    state.projects.find(p => p.id === projectId);

  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-slate-800">Completed</h1>
        <span className="text-sm text-slate-400">{completedTasks.length}件</span>
      </div>

      {completedTasks.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-3 opacity-30">✓</div>
          <p className="text-sm">完了済みのタスクがありません</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
          {completedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              project={getProject(task.projectId)}
              showProject={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
