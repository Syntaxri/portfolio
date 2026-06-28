const REQUIRED_VARS = ['RESEND_API_KEY', 'CONTACT_EMAIL'];

let validated = false;
let validationResult = null;

export function validateEnv() {
  if (validated) return validationResult;
  validated = true;

  const missing = REQUIRED_VARS.filter(k => !process.env[k]);

  if (missing.length > 0) {
    const msg = `Missing required environment variables: ${missing.join(', ')}`;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(msg);
    }
    validationResult = { ok: false, missing };
    return validationResult;
  }

  validationResult = { ok: true, missing: [] };
  return validationResult;
}

export function isResendConfigured() {
  return !!process.env.RESEND_API_KEY;
}

export function getResendApiKey() {
  return process.env.RESEND_API_KEY || '';
}

export function getContactEmail() {
  return process.env.CONTACT_EMAIL || '';
}
