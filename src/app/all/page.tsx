'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { Project } from '@/lib/types';
import TaskItem from '@/components/TaskItem';
import TaskForm from '@/components/TaskForm';
import ProjectForm from '@/components/ProjectForm';

export default function AllPage() {
  const { state, dispatch } = useApp();
  const [addingForProject, setAddingForProject] = useState<string | null | 'no-project'>(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const sortedProjects = [...state.projects].sort((a, b) => a.order - b.order);
  const incompleteTasks = state.tasks.filter(t => !t.completedAt);

  const getTasksForProject = (projectId: string | null) =>
    incompleteTasks
      .filter(t => t.projectId === projectId)
      .sort((a, b) => a.order - b.order);

  const handleDeleteProject = (project: Project) => {
    if (confirm(`「${project.name}」を削除しますか？\nタスクはNo Projectに移動されます。`)) {
      dispatch({ type: 'DELETE_PROJECT', id: project.id });
    }
  };

  const sections = [
    { id: null as string | null, label: 'No Project', color: undefined, project: undefined as Project | undefined },
    ...sortedProjects.map(p => ({ id: p.id, label: p.name, color: p.color, project: p })),
  ];

  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-800">All</h1>
          <span className="text-sm text-slate-400">{incompleteTasks.length}件</span>
        </div>
        <button
          onClick={() => setShowAddProject(true)}
          className="px-3 py-1.5 text-sm border border-slate-300 text-slate-600 rounded-lg"
        >
          + プロジェクト
        </button>
      </div>

      <div className="space-y-3">
        {sections.map(section => {
          const tasks = getTasksForProject(section.id);
          return (
            <div
              key={section.id ?? 'no-project'}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  {section.color && (
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: section.color }} />
                  )}
                  <span className="text-sm font-semibold text-slate-600">{section.label}</span>
                  <span className="text-xs text-slate-400">{tasks.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  {section.project && (
                    <>
                      <button
                        onClick={() => setEditingProject(section.project!)}
                        className="text-slate-400 text-sm"
                        title="編集"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDeleteProject(section.project!)}
                        className="text-slate-400 text-sm"
                        title="削除"
                      >
                        ✕
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setAddingForProject(section.id ?? 'no-project')}
                    className="text-slate-400 text-xl leading-none"
                    title="タスクを追加"
                  >
                    +
                  </button>
                </div>
              </div>

              {tasks.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {tasks.map(task => (
                    <TaskItem key={task.id} task={task} showProject={false} />
                  ))}
                </div>
              ) : (
                <div className="px-4 py-5 text-center text-slate-400 text-sm">
                  タスクがありません
                </div>
              )}
            </div>
          );
        })}
      </div>

      {addingForProject !== null && (
        <TaskForm
          defaultProjectId={addingForProject === 'no-project' ? null : addingForProject}
          onClose={() => setAddingForProject(null)}
        />
      )}
      {showAddProject && <ProjectForm onClose={() => setShowAddProject(false)} />}
      {editingProject && <ProjectForm project={editingProject} onClose={() => setEditingProject(null)} />}
    </div>
  );
}
