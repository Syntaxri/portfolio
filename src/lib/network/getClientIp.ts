/**
 * Best-effort client IP extraction from proxy headers.
 * Relies on the platform (Vercel) sanitizing these headers; behind a raw
 * reverse proxy, x-forwarded-for can be forged by clients.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  return '127.0.0.1'
}
