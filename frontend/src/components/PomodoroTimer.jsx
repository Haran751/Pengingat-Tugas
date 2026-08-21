import { useState, useEffect, useRef, useCallback } from 'react';

const WORK_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60;  // 5 minutes

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef(null);

  const totalSeconds = isBreak ? BREAK_TIME : WORK_TIME;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  // Circle SVG params
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearTimer();
      setIsRunning(false);
    }
    return clearTimer;
  }, [isRunning, timeLeft, clearTimer]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => { setIsRunning(false); clearTimer(); };

  const handleBreak = () => {
    clearTimer();
    setIsRunning(false);
    setIsBreak(true);
    setTimeLeft(BREAK_TIME);
  };

  const handleReset = () => {
    clearTimer();
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(WORK_TIME);
  };

  return (
    <div className="neu-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-gray-700">Timer</h3>
        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-md ${isBreak ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
          {isBreak ? 'Istirahat' : 'Fokus'}
        </span>
      </div>

      {/* Circular Timer */}
      <div className="flex justify-center py-3">
        <div className="relative w-44 h-44">
          <svg className="w-full h-full" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80" cy="80" r={radius}
              fill="none"
              stroke="#e8ecf3"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="80" cy="80" r={radius}
              fill="none"
              stroke={isBreak ? '#10b981' : timeLeft === 0 ? '#ef4444' : '#0c98e6'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="timer-circle"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          {/* Time text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-gray-800 tracking-tight">
              {minutes}<span className="text-gray-300">:</span>{seconds}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">
              {timeLeft === 0 ? 'Waktu habis!' : isRunning ? 'Fokus...' : 'Siap'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mt-2">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex-1 py-2.5 bg-primary-500 text-white text-xs font-bold rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30"
          >
            Mulai
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex-1 py-2.5 neu-btn text-gray-600 text-xs font-bold"
          >
            Jeda
          </button>
        )}
        <button
          onClick={handleBreak}
          className="flex-1 py-2.5 neu-btn text-emerald-600 text-xs font-bold"
        >
          Istirahat
        </button>
        <button
          onClick={handleReset}
          className="w-10 py-2.5 neu-btn text-gray-400 hover:text-gray-600 text-xs flex items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
}