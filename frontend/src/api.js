import axios from 'axios';

const API_BASE = '/api';

export const taskAPI = {
  getAll: (userId) => axios.get(`${API_BASE}/tasks?userId=${userId}`),
  getById: (id) => axios.get(`${API_BASE}/tasks/${id}`),
  create: (data) => axios.post(`${API_BASE}/tasks`, data),
  update: (id, data) => axios.put(`${API_BASE}/tasks/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/tasks/${id}`),
};

export const userAPI = {
  getStats: (userId) => axios.get(`${API_BASE}/user/stats?userId=${userId}`),
  getNextAlarm: (userId) => axios.get(`${API_BASE}/user/next-alarm?userId=${userId}`),
};

export const MOCK_USER = {
  _id: 'demo_user_001',
  name: 'Andi',
  avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Andi&backgroundColor=b6e3f4',
  level: 10,
  xp: 1500,
  streak: 7,
};

const STORAGE_KEY = 'tugasku_tasks';
const USER_KEY = 'tugasku_user';

function loadStoredTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return null;
}

function saveTasksToStorage(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {}
}

function saveUserToStorage(user) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {}
}

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

const now = new Date();
const DEFAULT_TASKS = [
  {
    _id: 'task_1',
    title: 'Laporan Kimia',
    priority: 'PENTING',
    deadline: new Date(now.getTime() + 45 * 60 * 1000).toISOString(),
    isCompleted: false,
    user: 'demo_user_001',
  },
  {
    _id: 'task_2',
    title: 'Latihan Soal Matematika',
    priority: 'PENTING',
    deadline: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
    isCompleted: false,
    user: 'demo_user_001',
  },
  {
    _id: 'task_3',
    title: 'Bikin Skrip Drama Anekdot',
    priority: 'MENENGAH',
    deadline: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: false,
    user: 'demo_user_001',
  },
  {
    _id: 'task_4',
    title: 'Belanja Mingguan',
    priority: 'SELESAI',
    deadline: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: true,
    user: 'demo_user_001',
  },
];

export const MOCK_TASKS = loadStoredTasks() || DEFAULT_TASKS;

export async function checkBackendAlive() {
  try {
    const res = await axios.get(`${API_BASE}/health`, { timeout: 3000 });
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

export { saveTasksToStorage, saveUserToStorage, loadStoredUser };