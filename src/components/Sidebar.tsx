'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/lib/context';
import { Project } from '@/lib/types';
import ProjectForm from './ProjectForm';

const navItems = [
  { href: '/today', label: 'Today', icon: '☀' },
  { href: '/all', label: 'All', icon: '▤' },
  { href: '/completed', label: 'Completed', icon: '✓' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { state, dispatch } = useApp();
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const sortedProjects = [...state.projects].sort((a, b) => a.order - b.order);

  const handleDeleteProject = (project: Project) => {
    if (confirm(`「${project.name}」を削除しますか？\nこのプロジェクトのタスクはNo Projectに移動されます。`)) {
      dispatch({ type: 'DELETE_PROJECT', id: project.id });
    }
  };

  return (
    <aside className="w-56 flex-shrink-0 bg-slate-900 text-slate-300 flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-sm font-bold text-white tracking-widest uppercase">Tasks</h1>
      </div>

      <nav className="px-2 space-y-0.5">
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === href ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-5 px-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Projects</span>
          <button
            onClick={() => setShowAddProject(true)}
            className="text-slate-500 hover:text-slate-300 transition-colors text-xl leading-none"
            title="プロジェクトを追加"
          >
            +
          </button>
        </div>

        <div className="space-y-0.5">
          {sortedProjects.map(project => (
            <div
              key={project.id}
              className="group flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800"
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />
              <span className="text-sm flex-1 truncate">{project.name}</span>
              <div className="hidden group-hover:flex items-center gap-1">
                <button
                  onClick={() => setEditingProject(project)}
                  className="text-slate-500 hover:text-slate-300 transition-colors text-xs p-0.5"
                  title="編集"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDeleteProject(project)}
                  className="text-slate-500 hover:text-red-400 transition-colors text-xs p-0.5"
                  title="削除"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddProject && <ProjectForm onClose={() => setShowAddProject(false)} />}
      {editingProject && <ProjectForm project={editingProject} onClose={() => setEditingProject(null)} />}
    </aside>
  );
}
