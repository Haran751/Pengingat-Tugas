export const NAV_ITEMS = ['Dashboard', 'Kalender', 'Pomodoro', 'Statistik', 'Pengaturan'];

export const PRIORITY_CONFIG = {
  PENTING: {
    label: 'Penting',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    dot: 'bg-red-500',
    pulse: 'priority-penting',
  },
  MENENGAH: {
    label: 'Menengah',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    pulse: '',
  },
  SELESAI: {
    label: 'Selesai',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    pulse: '',
  },
};

export function formatDeadline(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date - now;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMs < 0) return 'Sudah lewat';
  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lagi`;
  if (diffHours < 24) return `${diffHours} jam lagi`;
  return `${diffDays} hari lagi`;
}

export function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateShort(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}
