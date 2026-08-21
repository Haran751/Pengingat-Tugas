let audioCtx = null;
let isRinging = false;
let ringInterval = null;
let activeAlarmTask = null;
let activeNotification = null;
const listeners = new Set();

const ALARM_BEFORE_MS = 60 * 1000;

function requestNotifPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playBeep() {
  const ctx = getAudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
  osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

function playAlarmPattern() {
  playBeep();
  setTimeout(() => playBeep(), 500);
  setTimeout(() => playBeep(), 1000);
}

function showNotification(task) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return null;
  const deadline = new Date(task.deadline);
  const timeStr = deadline.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const diff = deadline - new Date();
  const label = diff > 0 ? `${Math.ceil(diff / 60000)} menit lagi` : 'Sudah waktunya!';
  const notif = new Notification(`⏰ ${task.title}`, {
    body: `Deadline jam ${timeStr} — ${label}`,
    icon: '/vite.svg',
    requireInteraction: true,
    tag: task._id,
  });
  notif.onclick = () => {
    window.focus();
    stopRinging();
    notif.close();
  };
  activeNotification = notif;
  return notif;
}

function startRinging(task) {
  if (isRinging) return;
  isRinging = true;
  activeAlarmTask = task;
  playAlarmPattern();
  ringInterval = setInterval(() => {
    if (!isRinging) return;
    playAlarmPattern();
  }, 3000);
  showNotification(task);
  notifyListeners({ type: 'RING', task });
}

function stopRinging() {
  isRinging = false;
  if (ringInterval) {
    clearInterval(ringInterval);
    ringInterval = null;
  }
  if (activeNotification) {
    activeNotification.close();
    activeNotification = null;
  }
  const dismissed = activeAlarmTask;
  activeAlarmTask = null;
  notifyListeners({ type: 'DISMISS', task: dismissed });
}

function checkAlarms(tasks) {
  if (isRinging) return;
  const now = new Date();
  let closest = null;
  let closestDiff = Infinity;
  for (const task of tasks) {
    if (task.isCompleted) continue;
    const deadline = new Date(task.deadline);
    const diff = deadline - now;
    if (diff >= -5000 && diff <= ALARM_BEFORE_MS) {
      if (diff < closestDiff) {
        closestDiff = diff;
        closest = task;
      }
    }
  }
  if (closest) {
    startRinging(closest);
  }
}

function getActiveAlarm() {
  return activeAlarmTask;
}

function isCurrentlyRinging() {
  return isRinging;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners(event) {
  listeners.forEach((fn) => {
    try { fn(event); } catch (e) { console.error(e); }
  });
}

export { startRinging, stopRinging, checkAlarms, getActiveAlarm, isCurrentlyRinging, subscribe, requestNotifPermission };