import { MAX_NAME_LENGTH, MAX_MESSAGE_LENGTH } from '@/config/contact';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function sanitize(val, maxLen = 1000) {
  if (typeof val !== 'string') return '';
  return val.replace(/<[^>]*>/g, '').replace(/\0/g, '').trim().slice(0, maxLen);
}

export function validateContact({ name, email, message }) {
  const errors = {};

  if (!name) errors.name = 'Name is required.';
  else if (name.length < 2) errors.name = 'Name must be at least 2 characters.';

  if (!email) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Invalid email address.';

  if (!message) errors.message = 'Message is required.';
  else if (message.length < 10) errors.message = 'Message must be at least 10 characters.';

  return errors;
}

export { MAX_NAME_LENGTH, MAX_MESSAGE_LENGTH };
