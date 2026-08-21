import { useState } from 'react';

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function MiniCalendar({ tasks }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(today);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // First day of the month (0 = Sunday)
  const firstDay = new Date(year, month, 1).getDay();
  // Days in this month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get dates that have tasks
  const taskDates = new Set(
    tasks.map((t) => {
      const d = new Date(t.deadline);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const hasTask = (day) => {
    return taskDates.has(`${year}-${month}-${day}`);
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => setViewDate(new Date());

  // Build calendar grid cells
  const cells = [];
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} />);
  }
  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(
      <button
        key={day}
        onClick={goToday}
        className={`relative w-full aspect-square rounded-xl text-xs font-medium flex flex-col items-center justify-center transition-all
          ${
            isToday(day)
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
              : hasTask(day)
              ? 'neu-btn text-gray-700'
              : 'text-gray-400 hover:text-gray-600 hover:bg-surface'
          }`}
      >
        {day}
        {hasTask(day) && !isToday(day) && (
          <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary-400" />
        )}
      </button>
    );
  }

  return (
    <div className="neu-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-gray-700">Kalender</h3>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="w-7 h-7 rounded-lg neu-btn flex items-center justify-center text-gray-400 hover:text-gray-600">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button onClick={goToday} className="text-sm font-bold text-gray-700 hover:text-primary-500 transition-colors">
          {MONTHS[month]} {year}
        </button>
        <button onClick={nextMonth} className="w-7 h-7 rounded-lg neu-btn flex items-center justify-center text-gray-400 hover:text-gray-600">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-300 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary-500" />
          <span className="text-xs text-gray-400">Hari ini</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary-400" />
          <span className="text-xs text-gray-400">Ada tugas</span>
        </div>
      </div>
    </div>
  );
}