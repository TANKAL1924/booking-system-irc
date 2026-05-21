const TTL_MS = 60 * 60 * 1000; // 1 hour

export function getCached<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(`qc:${key}`);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: T; ts: number };
    if (Date.now() - ts > TTL_MS) {
      sessionStorage.removeItem(`qc:${key}`);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function setCached<T>(key: string, data: T): void {
  try {
    sessionStorage.setItem(`qc:${key}`, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // quota exceeded or unavailable – skip silently
  }
}

export function invalidateCache(key: string): void {
  try {
    sessionStorage.removeItem(`qc:${key}`);
  } catch {
    // ignore
  }
}
