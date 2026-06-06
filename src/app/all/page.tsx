'use client';

import { useState, useRef } from 'react';
import { useApp } from '@/lib/context';
import TaskItem from '@/components/TaskItem';
import TaskForm from '@/components/TaskForm';
import ProjectForm from '@/components/ProjectForm';

export default function AllPage() {
  const { state, dispatch } = useApp();
  const [addingForProject, setAddingForProject] = useState<string | null | 'no-project'>(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const draggedId = useRef<string | null>(null);

  const sortedProjects = [...state.projects].sort((a, b) => a.order - b.order);
  const incompleteTasks = state.tasks.filter(t => !t.completedAt);

  const getTasksForProject = (projectId: string | null) =>
    incompleteTasks
      .filter(t => t.projectId === projectId)
      .sort((a, b) => a.order - b.order);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    draggedId.current = taskId;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverId(taskId);
  };

  const handleDrop = (e: React.DragEvent, targetId: string, projectId: string | null) => {
    e.preventDefault();
    const fromId = draggedId.current;
    if (!fromId || fromId === targetId) {
      draggedId.current = null;
      setDragOverId(null);
      return;
    }

    const sectionTasks = getTasksForProject(projectId);
    const fromIdx = sectionTasks.findIndex(t => t.id === fromId);
    const toIdx = sectionTasks.findIndex(t => t.id === targetId);

    if (fromIdx === -1 || toIdx === -1) {
      draggedId.current = null;
      setDragOverId(null);
      return;
    }

    const reordered = [...sectionTasks];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    const updatedTasks = state.tasks.map(t => {
      const idx = reordered.findIndex(r => r.id === t.id);
      return idx !== -1 ? { ...t, order: idx } : t;
    });

    dispatch({ type: 'SET_TASKS', tasks: updatedTasks });
    draggedId.current = null;
    setDragOverId(null);
  };

  const sections = [
    { id: null as string | null, label: 'No Project', color: undefined },
    ...sortedProjects.map(p => ({ id: p.id, label: p.name, color: p.color })),
  ];

  const totalCount = incompleteTasks.length;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-800">All</h1>
          <span className="text-sm text-slate-400">{totalCount}件</span>
        </div>
        <button
          onClick={() => setShowAddProject(true)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          + プロジェクトを追加
        </button>
      </div>

      <div className="space-y-4">
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
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: section.color }} />
                  )}
                  <span className="text-sm font-semibold text-slate-600">{section.label}</span>
                  <span className="text-xs text-slate-400">{tasks.length}</span>
                </div>
                <button
                  onClick={() => setAddingForProject(section.id ?? 'no-project')}
                  className="text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none"
                  title="タスクを追加"
                >
                  +
                </button>
              </div>

              {tasks.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {tasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      showProject={false}
                      showDragHandle={true}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={(e, taskId) => handleDrop(e, taskId, section.id)}
                      isDragOver={dragOverId === task.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-slate-400 text-sm">
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
    </div>
  );
}
