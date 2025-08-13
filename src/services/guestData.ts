import type { SymptomRecord } from '../types';

const STORAGE_KEY = 'gc.guest.symptoms';

function readAll(): SymptomRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as SymptomRecord[];
  } catch {
    return [];
  }
}

function writeAll(list: SymptomRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

export const guestData = {
  symptoms: {
    async create(symptom: Omit<SymptomRecord, 'id' | 'created_at'>) {
      const list = readAll();
      const now = new Date().toISOString();
      const record: SymptomRecord = {
        ...symptom,
        id: `guest-${Date.now()}`,
        created_at: now,
      };
      list.push(record);
      writeAll(list);
      return record;
    },

    async getByUser(_userId: string, limit = 30): Promise<SymptomRecord[]> {
      const list = readAll()
        .sort((a, b) => (b.recorded_at > a.recorded_at ? 1 : -1))
        .slice(0, limit);
      return list;
    },

    async getTodaySymptom(_userId: string): Promise<SymptomRecord | null> {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const list = readAll()
        .filter((r) => new Date(r.recorded_at).getTime() >= today.getTime())
        .sort((a, b) => (b.recorded_at > a.recorded_at ? 1 : -1));
      return list[0] ?? null;
    },
  },
};


