import { useState, useEffect, useRef, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import RightPanel from './components/RightPanel';
import NextAlarmWidget from './components/NextAlarmWidget';
import PomodoroTimer from './components/PomodoroTimer';
import MiniCalendar from './components/MiniCalendar';
import AlarmOverlay from './components/AlarmOverlay';
import { MOCK_USER, MOCK_TASKS, userAPI, taskAPI, checkBackendAlive, saveTasksToStorage, saveUserToStorage, loadStoredUser } from './api';
import { checkAlarms, startRinging, subscribe, requestNotifPermission } from './alarmManager';

const MOBILE_TABS = [
  { id: 'tugas', label: 'Tugas', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: 'kalender', label: 'Kalender', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'pomodoro', label: 'Timer', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(true);
  const [alarmDismissed, setAlarmDismissed] = useState(new Set());
  const [mobileTab, setMobileTab] = useState('tugas');
  const tasksRef = useRef(tasks);
  const dismissedRef = useRef(alarmDismissed);
  const userIdRef = useRef('demo_user_001');

  tasksRef.current = tasks;
  dismissedRef.current = alarmDismissed;

  useEffect(() => {
    requestNotifPermission();
  }, []);

  useEffect(() => {
    const init = async () => {
      const alive = await checkBackendAlive();
      if (alive) {
        setUseMock(false);
        try {
          const [userRes, tasksRes] = await Promise.all([
            userAPI.getStats('demo_user_001'),
            taskAPI.getAll('demo_user_001'),
          ]);
          setUser(userRes.data);
          userIdRef.current = userRes.data._id;
          setTasks(tasksRes.data);
        } catch (err) {
          console.error('Backend alive but fetch failed, falling back to mock:', err);
          setUseMock(true);
          setUser(loadStoredUser() || MOCK_USER);
          setTasks(MOCK_TASKS);
        }
      } else {
        setUseMock(true);
        setUser(loadStoredUser() || MOCK_USER);
        setTasks(MOCK_TASKS);
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleAlarmDismiss = useCallback((event) => {
    if (event.task) {
      setAlarmDismissed((prev) => new Set([...prev, event.task._id]));
    }
  }, []);

  useEffect(() => {
    const unsub = subscribe(handleAlarmDismiss);
    return unsub;
  }, [handleAlarmDismiss]);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      const active = tasksRef.current.filter(
        (t) => !t.isCompleted && !dismissedRef.current.has(t._id)
      );
      checkAlarms(active);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleAddTask = async (title, deadline) => {
    if (useMock) {
      const newTask = {
        _id: `task_${Date.now()}`, title, priority: 'MENENGAH',
        deadline: deadline.toISOString(), isCompleted: false, user: userIdRef.current,
      };
      setTasks((prev) => {
        const updated = [...prev, newTask].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        saveTasksToStorage(updated);
        return updated;
      });
      return;
    }
    try {
      const res = await taskAPI.create({ title, deadline, user: userIdRef.current });
      setTasks((prev) => [...prev, res.data].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)));
    } catch (err) { console.error(err); }
  };

  const handleToggleComplete = async (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;
    const newStatus = !task.isCompleted;
    const newPriority = newStatus ? 'SELESAI' : 'MENENGAH';
    if (useMock) {
      setTasks((prev) => {
        const updated = prev.map((t) => (t._id === taskId ? { ...t, isCompleted: newStatus, priority: newPriority } : t));
        saveTasksToStorage(updated);
        return updated;
      });
      return;
    }
    try {
      await taskAPI.update(taskId, { isCompleted: newStatus, priority: newPriority });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, isCompleted: newStatus, priority: newPriority } : t)));
    } catch (err) { console.error(err); }
  };

  const handleDeleteTask = async (taskId) => {
    if (useMock) {
      setTasks((prev) => {
        const updated = prev.filter((t) => t._id !== taskId);
        saveTasksToStorage(updated);
        return updated;
      });
      return;
    }
    try { await taskAPI.delete(taskId); setTasks((prev) => prev.filter((t) => t._id !== taskId)); } catch (err) { console.error(err); }
  };

  const handleEditTask = async (taskId, updates) => {
    if (useMock) {
      setTasks((prev) => {
        const updated = prev.map((t) => (t._id === taskId ? { ...t, ...updates } : t));
        saveTasksToStorage(updated);
        return updated;
      });
      return;
    }
    try { await taskAPI.update(taskId, updates); setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, ...updates } : t))); } catch (err) { console.error(err); }
  };

  const handleManualAlarm = useCallback((task) => {
    startRinging(task);
  }, []);

  const dashboardProps = {
    tasks, onAddTask: handleAddTask, onToggleComplete: handleToggleComplete,
    onDeleteTask: handleDeleteTask, onEditTask: handleEditTask, onManualAlarm: handleManualAlarm,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <div className="neu-card px-8 py-6 flex items-center gap-3">
          <div className="w-5 h-5 border-[3px] border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 font-medium">Memuat TUGASKU...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-surface">
      <AlarmOverlay />

      <div className="flex-shrink-0 bg-surface/90 backdrop-blur-xl border-b border-gray-100 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-base font-extrabold text-gray-800">
            TUGAS<span className="text-primary-500">KU</span>
          </h1>
          <span className="sm:hidden ml-auto text-xs font-semibold text-gray-400">
            {MOBILE_TABS.find((t) => t.id === mobileTab).label}
          </span>
        </div>
      </div>

      {/* DESKTOP: two-column layout */}
      <div className="flex-1 min-h-0 hidden sm:flex max-w-6xl w-full mx-auto px-6 gap-6 overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden">
          <Dashboard {...dashboardProps} />
        </div>
        <div className="w-80 flex-shrink-0 overflow-y-auto min-h-0 py-5">
          <RightPanel tasks={tasks} />
        </div>
      </div>

      {/* MOBILE: tab-based layout with bottom nav */}
      <div className="flex-1 min-h-0 flex flex-col sm:hidden">
        <div className={`flex-1 min-h-0 flex flex-col ${mobileTab === 'tugas' ? '' : 'hidden'}`}>
          <div className="flex-shrink-0 px-4 pt-4 pb-3">
            <NextAlarmWidget tasks={tasks} />
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <Dashboard {...dashboardProps} />
          </div>
        </div>
        <div className={`flex-1 min-h-0 overflow-y-auto px-4 py-5 ${mobileTab === 'kalender' ? '' : 'hidden'}`}>
          <MiniCalendar tasks={tasks} />
        </div>
        <div className={`flex-1 min-h-0 flex items-start justify-center overflow-y-auto px-4 py-5 ${mobileTab === 'pomodoro' ? '' : 'hidden'}`}>
          <div className="w-full max-w-sm">
            <PomodoroTimer />
          </div>
        </div>

        {/* Bottom navbar */}
        <div className="flex-shrink-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-2 pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-around py-2">
            {MOBILE_TABS.map((tab) => {
              const active = mobileTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMobileTab(tab.id)}
                  className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-2xl transition-all active:scale-90 ${
                    active ? 'text-primary-500' : 'text-gray-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-primary-50 shadow-sm' : ''}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                    </svg>
                  </div>
                  <span className={`text-xs font-semibold transition-all ${active ? 'text-primary-600' : ''}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}