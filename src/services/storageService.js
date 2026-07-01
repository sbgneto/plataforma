const memoryFallback = new Map();

function isStorageAvailable() {
  try {
    const testKey = '__edugames_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const storageOk = typeof window !== 'undefined' && isStorageAvailable();

export function getItem(key, fallback = null) {
  try {
    const raw = storageOk ? window.localStorage.getItem(key) : memoryFallback.get(key);
    if (raw === null || raw === undefined) return fallback;
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return fallback;
  }
}

export function setItem(key, value) {
  try {
    const serialized = JSON.stringify(value);
    if (storageOk) {
      window.localStorage.setItem(key, serialized);
    } else {
      memoryFallback.set(key, serialized);
    }
  } catch {
    memoryFallback.set(key, JSON.stringify(value));
  }
}

export function removeItem(key) {
  try {
    if (storageOk) {
      window.localStorage.removeItem(key);
    } else {
      memoryFallback.delete(key);
    }
  } catch {
    memoryFallback.delete(key);
  }
}
