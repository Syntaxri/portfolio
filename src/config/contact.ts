/**
 * Contact-form limits. Server-side enforcement lives in
 * src/lib/validation/contact.ts; the same rules are mirrored client-side
 * in src/components/forms/ContactForm.tsx.
 */
export const RATE_LIMIT_MAX = 5
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
export const MAX_NAME_LENGTH = 100
export const MAX_MESSAGE_LENGTH = 1000
export const MAX_EMAIL_LENGTH = 254
