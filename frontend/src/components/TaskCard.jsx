import { useState } from 'react';
import { PRIORITY_CONFIG, formatDeadline, formatTime, formatDateShort } from './constants';

export default function TaskCard({ task, onToggleComplete, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDeadline, setEditDeadline] = useState(
    new Date(task.deadline).toISOString().slice(0, 16)
  );
  const [showActions, setShowActions] = useState(false);

  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MENENGAH;
  const isOverdue = new Date(task.deadline) < new Date() && !task.isCompleted;

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onEdit(task._id, {
      title: editTitle,
      deadline: new Date(editDeadline).toISOString(),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDeadline(new Date(task.deadline).toISOString().slice(0, 16));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="neu-card-sm p-4 border-l-4 border-primary-400">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="neu-input px-4 py-3 text-sm text-gray-700 font-medium"
            placeholder="Judul tugas..."
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <input
            type="datetime-local"
            value={editDeadline}
            onChange={(e) => setEditDeadline(e.target.value)}
            className="neu-input px-4 py-3 text-sm text-gray-700"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="neu-btn px-4 py-2.5 text-xs font-semibold text-primary-600"
            >
              Simpan
            </button>
            <button
              onClick={handleCancel}
              className="neu-btn px-4 py-2.5 text-xs font-semibold text-gray-400"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`neu-card-sm p-4 transition-all duration-300 ${
        task.isCompleted ? 'task-completed opacity-75' : ''
      } ${isOverdue ? 'border-l-4 border-red-300' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox - bigger tap target for mobile */}
        <button
          onClick={() => onToggleComplete(task._id)}
          className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all active:scale-90 ${
            task.isCompleted
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-gray-300 active:border-primary-400'
          }`}
        >
          {task.isCompleted && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="task-title text-sm font-semibold text-gray-800 leading-snug">
              {task.title}
            </h3>
            {/* More button */}
            <button
              onClick={() => setShowActions(!showActions)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-surface transition-all flex-shrink-0 -mr-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
              {formatDeadline(task.deadline)}
            </span>
            <span className="text-xs text-gray-300">&middot;</span>
            <span className="text-xs text-gray-400">
              {formatDateShort(task.deadline)}, {formatTime(task.deadline)}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${priority.bg} ${priority.text} ${priority.border} ${priority.pulse}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>
          </div>

          {/* Expandable actions */}
          {showActions && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => { setIsEditing(true); setShowActions(false); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl neu-btn text-xs font-semibold text-primary-600 active:shadow-soft-inset"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl neu-btn text-xs font-semibold text-red-500 active:shadow-soft-inset"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Hapus
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl neu-btn text-xs font-semibold text-amber-500 active:shadow-soft-inset"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Alarm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
