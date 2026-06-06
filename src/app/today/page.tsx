'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import TaskItem from '@/components/TaskItem';
import TaskForm from '@/components/TaskForm';

export default function TodayPage() {
  const { state } = useApp();
  const [showAdd, setShowAdd] = useState(false);

  const todayTasks = state.tasks
    .filter(t => t.isTodayTask && !t.completedAt)
    .sort((a, b) => a.order - b.order);

  const getProject = (projectId: string | null) =>
    state.projects.find(p => p.id === projectId);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Today</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          + タスクを追加
        </button>
      </div>

      {todayTasks.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-3 opacity-40">☀</div>
          <p className="text-sm">今日のタスクがありません</p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            タスクを追加する
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
          {todayTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              project={getProject(task.projectId)}
              showProject={true}
            />
          ))}
        </div>
      )}

      {showAdd && (
        <TaskForm defaultIsTodayTask={true} onClose={() => setShowAdd(false)} />
      )}
    </div>
  );
}
