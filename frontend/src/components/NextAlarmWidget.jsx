import { formatDeadline, formatTime, PRIORITY_CONFIG } from './constants';

export default function NextAlarmWidget({ tasks }) {
  const now = new Date();
  const upcomingTask = tasks
    .filter((t) => !t.isCompleted && new Date(t.deadline) >= now)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];

  if (!upcomingTask) {
    return (
      <div className="neu-card px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-400">Alarm Berikutnya</p>
          <p className="text-sm text-gray-300">Tidak ada tugas mendatang</p>
        </div>
      </div>
    );
  }

  const priority = PRIORITY_CONFIG[upcomingTask.priority];
  const deadline = new Date(upcomingTask.deadline);
  const hours = deadline.getHours().toString().padStart(2, '0');
  const minutes = deadline.getMinutes().toString().padStart(2, '0');

  return (
    <div className="neu-card px-4 py-4 flex items-center gap-4">
      {/* Time display */}
      <div className="text-center flex-shrink-0">
        <p className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight leading-none">
          {hours}<span className="text-primary-400">:</span>{minutes}
        </p>
        <p className={`text-xs font-semibold mt-0.5 ${priority.text}`}>
          {formatDeadline(upcomingTask.deadline)}
        </p>
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-gray-200 flex-shrink-0" />

      {/* Task info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-400 mb-0.5">Alarm Berikutnya</p>
        <p className="text-sm font-bold text-gray-700 truncate">{upcomingTask.title}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className={`w-2 h-2 rounded-full ${priority.dot}`} />
          <span className={`text-xs font-semibold ${priority.text}`}>{priority.label}</span>
        </div>
      </div>
    </div>
  );
}
