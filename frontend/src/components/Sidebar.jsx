import { NAV_ITEMS } from './constants';

const navIcons = {
  Dashboard: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
    </svg>
  ),
  Kalender: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Pomodoro: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Statistik: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Pengaturan: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export default function Sidebar({ user, activeNav, onNavChange }) {
  if (!user) return null;

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-2">
        <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">
          TUGAS<span className="text-primary-500">KU</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="glass-card p-3 flex flex-col gap-1.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            onClick={() => onNavChange(item)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${
                activeNav === item
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'text-gray-500 hover:bg-surface hover:text-gray-700'
              }`}
          >
            {navIcons[item]}
            {item}
          </button>
        ))}
      </nav>

      {/* Gamification Card */}
      <div className="neu-card p-5 mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full bg-primary-50 border-2 border-white shadow-soft-sm"
          />
          <div>
            <p className="font-bold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-400 font-medium">Level {user.level} Pelajar</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-gray-500">XP</span>
            <span className="text-primary-600 font-bold">{user.xp} / 2000</span>
          </div>
          <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((user.xp / 2000) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-2 1-3 .5 1.5 1 2 1 3a3 3 0 01-.38 1.62z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Streak</p>
              <p className="text-sm font-bold text-gray-700">{user.streak} Hari</p>
            </div>
          </div>
          <div className="flex -space-x-1">
            {[...Array(Math.min(user.streak, 7))].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-orange-400 border-2 border-white" style={{ opacity: 1 - i * 0.1 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}