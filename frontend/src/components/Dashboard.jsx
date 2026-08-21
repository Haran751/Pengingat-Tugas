import { useState, useMemo } from 'react';
import TaskCard from './TaskCard';

function toLocalDatetimeString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:${min}`;
}

export default function Dashboard({ tasks, onAddTask, onToggleComplete, onDeleteTask, onEditTask, onManualAlarm }) {
  const [newTitle, setNewTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deadlineError, setDeadlineError] = useState('');

  const minDeadline = useMemo(() => toLocalDatetimeString(new Date()), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDeadline) return;
    if (new Date(newDeadline) <= new Date()) {
      setDeadlineError('Deadline harus di waktu yang akan datang!');
      return;
    }
    setDeadlineError('');
    onAddTask(newTitle.trim(), new Date(newDeadline));
    setNewTitle('');
    setNewDeadline('');
    setShowForm(false);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const pendingCount = tasks.filter((t) => !t.isCompleted).length;
  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <div className="flex flex-col h-full min-h-0 overflow-hidden px-4 pb-4 sm:px-0 sm:pb-0 sm:py-5">

        <div className="flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-extrabold text-gray-800">Tugas Saya</h2>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {pendingCount} aktif
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">
              {completedCount} selesai
            </span>
          </div>
        </div>

        <div className="neu-card p-4 flex-shrink-0 mt-4">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 neu-btn text-gray-400 hover:text-primary-500 group transition-colors active:shadow-soft-inset"
            >
              <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
              <span className="text-sm font-semibold">Tambah Tugas</span>
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="neu-input px-4 py-3 text-sm text-gray-700 font-medium"
                placeholder="Apa tugasmu?"
                autoFocus
              />
              <input
                type="datetime-local"
                value={newDeadline}
                onChange={(e) => { setNewDeadline(e.target.value); setDeadlineError(''); }}
                min={minDeadline}
                className="neu-input px-4 py-3 text-sm text-gray-700"
                required
              />
              {deadlineError && (
                <p className="text-xs font-semibold text-red-500 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {deadlineError}
                </p>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setNewTitle(''); setNewDeadline(''); }}
                  className="neu-btn px-5 py-2.5 text-xs font-semibold text-gray-400 hover:text-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary-500 text-white text-xs font-bold rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30"
                >
                  Tambah
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto mt-4">
          <div className="flex flex-col gap-3 pr-1">
            {sortedTasks.length === 0 ? (
              <div className="neu-card p-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-400 font-medium text-sm">Belum ada tugas</p>
                <p className="text-gray-300 text-xs mt-1">Tekan tombol di atas untuk menambahkan</p>
              </div>
            ) : (
              sortedTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                  onManualAlarm={onManualAlarm}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}