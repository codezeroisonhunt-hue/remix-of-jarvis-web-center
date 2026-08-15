// /src/utils/memoryManager.ts
const MEMORY_KEY = 'jarvis_user_memory';

export interface UserMemory {
  [key: string]: any;
}

export function loadMemory(): UserMemory {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load memory', e);
  }
  return {};
}

export function saveMemory(memory: UserMemory): void {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  } catch (e) {
    console.error('Failed to save memory', e);
  }
}

export function updateMemory(key: string, value: any): void {
  const memory = loadMemory();
  memory[key] = value;
  saveMemory(memory);
}

export function getMemoryValue(key: string): any | undefined {
  const memory = loadMemory();
  return memory[key];
}

export function clearMemory(): void {
  localStorage.removeItem(MEMORY_KEY);
}
