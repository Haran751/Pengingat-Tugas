import { useState, useEffect, useCallback, useRef } from 'react';
import { stopRinging, subscribe } from '../alarmManager';
import { formatTime } from './constants';

export default function AlarmOverlay() {
  const [ringing, setRinging] = useState(false);
  const [task, setTask] = useState(null);
  const [pulse, setPulse] = useState(false);
  const [countdown, setCountdown] = useState('');
  const deadlineRef = useRef(null);

  useEffect(() => {
    const unsub = subscribe((event) => {
      if (event.type === 'RING') {
        setRinging(true);
        setTask(event.task);
        deadlineRef.current = new Date(event.task.deadline);
      } else if (event.type === 'DISMISS') {
        setRinging(false);
        setTask(null);
        deadlineRef.current = null;
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!ringing) return;
    const pulseIv = setInterval(() => setPulse((p) => !p), 1000);
    const cdIv = setInterval(() => {
      if (!deadlineRef.current) return;
      const diff = deadlineRef.current - new Date();
      if (diff <= 0) {
        setCountdown('Sudah waktunya!');
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCountdown(m > 0 ? `${m}m ${s}s lagi` : `${s} detik lagi`);
      }
    }, 500);
    return () => { clearInterval(pulseIv); clearInterval(cdIv); };
  }, [ringing]);

  const handleDismiss = useCallback(() => {
    stopRinging();
    setRinging(false);
    setTask(null);
  }, []);

  useEffect(() => {
    if (!ringing) return;
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ringing, handleDismiss]);

  if (!ringing || !task) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-sm animate-bounce-slow">
        <div
          className="neu-card p-8 text-center relative overflow-hidden"
          style={{
            boxShadow: pulse
              ? '0 0 0 8px rgba(239,68,68,0.2), 0 20px 60px rgba(239,68,68,0.3)'
              : '0 0 0 4px rgba(239,68,68,0.1), 0 10px 40px rgba(239,68,68,0.15)',
            transition: 'box-shadow 0.5s ease',
          }}
        >
          <div
            className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5"
            style={{
              transform: pulse ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
          >
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>

          <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">
            Alarm Tugas
          </p>
          <h2 className="text-xl font-extrabold text-gray-800 mb-2">
            {task.title}
          </h2>
          <p className="text-sm text-gray-500 font-medium mb-1">
            Deadline: {formatTime(task.deadline)}
          </p>
          <p className="text-2xl font-extrabold text-red-500 mt-2 mb-1 tabular-nums">
            {countdown}
          </p>
          <p
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-2 ${
              task.priority === 'PENTING'
                ? 'bg-red-50 text-red-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                task.priority === 'PENTING' ? 'bg-red-500' : 'bg-amber-500'
              }`}
            />
            {task.priority === 'PENTING' ? 'Penting' : 'Menengah'}
          </p>

          <button
            onClick={handleDismiss}
            className="mt-8 w-full py-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-red-500/40 transition-all active:scale-95"
          >
            MATIKAN ALARM
          </button>
          <p className="text-xs text-gray-400 mt-3">Tekan tombol, notif, Escape, atau spasi</p>
        </div>
      </div>
    </div>
  );
}