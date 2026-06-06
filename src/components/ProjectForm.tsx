'use client';

import { useState } from 'react';
import { useApp, generateId } from '@/lib/context';
import { Project } from '@/lib/types';
import Modal from './Modal';

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#6366f1', '#a855f7', '#ec4899',
];

interface ProjectFormProps {
  project?: Project;
  onClose: () => void;
}

export default function ProjectForm({ project, onClose }: ProjectFormProps) {
  const { state, dispatch } = useApp();
  const [name, setName] = useState(project?.name ?? '');
  const [color, setColor] = useState(project?.color ?? PRESET_COLORS[4]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (project) {
      dispatch({ type: 'UPDATE_PROJECT', project: { ...project, name: name.trim(), color } });
    } else {
      const maxOrder = state.projects.reduce((max, p) => Math.max(max, p.order), -1);
      dispatch({
        type: 'ADD_PROJECT',
        project: { id: generateId(), name: name.trim(), color, order: maxOrder + 1 },
      });
    }
    onClose();
  };

  return (
    <Modal title={project ? 'プロジェクトを編集' : 'プロジェクトを追加'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">プロジェクト名 *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="プロジェクト名を入力"
            autoFocus
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">カラー</label>
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-all ${
                  color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

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
            {project ? '更新' : '追加'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
