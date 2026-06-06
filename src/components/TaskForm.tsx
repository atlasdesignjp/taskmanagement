'use client';

import { useState } from 'react';
import { useApp, generateId } from '@/lib/context';
import { Task } from '@/lib/types';
import Modal from './Modal';

interface TaskFormProps {
  task?: Task;
  defaultProjectId?: string | null;
  defaultIsTodayTask?: boolean;
  onClose: () => void;
}

export default function TaskForm({ task, defaultProjectId, defaultIsTodayTask, onClose }: TaskFormProps) {
  const { state, dispatch } = useApp();
  const [name, setName] = useState(task?.name ?? '');
  const [projectId, setProjectId] = useState<string>(task !== undefined ? (task.projectId ?? '') : (defaultProjectId ?? ''));
  const [effort, setEffort] = useState<string>(task?.effort != null ? String(task.effort) : '');
  const [dueDate, setDueDate] = useState<string>(task?.dueDate ?? '');
  const [isTodayTask, setIsTodayTask] = useState(task?.isTodayTask ?? defaultIsTodayTask ?? false);

  const sortedProjects = [...state.projects].sort((a, b) => a.order - b.order);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const effortNum = effort !== '' ? parseFloat(effort) : null;
    const projectIdVal = projectId !== '' ? projectId : null;

    if (task) {
      dispatch({
        type: 'UPDATE_TASK',
        task: { ...task, name: name.trim(), projectId: projectIdVal, effort: effortNum, dueDate: dueDate || null, isTodayTask },
      });
    } else {
      const maxOrder = state.tasks
        .filter(t => t.projectId === projectIdVal)
        .reduce((max, t) => Math.max(max, t.order), -1);

      dispatch({
        type: 'ADD_TASK',
        task: {
          id: generateId(),
          name: name.trim(),
          projectId: projectIdVal,
          effort: effortNum,
          dueDate: dueDate || null,
          completedAt: null,
          isTodayTask,
          order: maxOrder + 1,
        },
      });
    }
    onClose();
  };

  return (
    <Modal title={task ? 'タスクを編集' : 'タスクを追加'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">タスク名 *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="タスク名を入力"
            autoFocus
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">プロジェクト</label>
          <select
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">No Project</option>
            {sortedProjects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">工数（h）</label>
            <input
              type="number"
              value={effort}
              onChange={e => setEffort(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: 1.5"
              min="0"
              step="0.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">期日</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isTodayTask}
            onChange={e => setIsTodayTask(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-slate-700">今日のタスク</span>
        </label>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            {task ? '更新' : '追加'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
