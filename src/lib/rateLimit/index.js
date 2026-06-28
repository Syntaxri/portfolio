import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from '@/config/contact';

// Pluggable storage adapter
// TODO: Replace with Redis / Upstash KV adapter in production
// The adapter must implement:
//   async get(key) -> { count: number, resetAt: number } | undefined
//   async set(key, value) -> void
const memoryStore = new Map();

export function checkRateLimit(ip) {
  const now = Date.now();
  const record = memoryStore.get(ip);

  if (!record || now > record.resetAt) {
    memoryStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

export function getRateHeaders(result) {
  return {
    'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
    'X-RateLimit-Remaining': String(result.remaining ?? 0),
  };
}
