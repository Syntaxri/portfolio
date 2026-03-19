/**
 * contact.js — Production-ready contact page
 * ─────────────────────────────────────────────────────────────────────────────
 * Architecture decisions:
 *  • Fully controlled form — single state object, generic handleChange
 *  • Validation runs on blur (per-field) AND on submit (all fields)
 *  • Debounced email validation — only fires 600ms after user stops typing
 *  • Toast notification system — 4 concurrent toasts max, auto-dismiss
 *  • Submission is idempotent — double-click protected via isSubmitting ref
 *  • No external dependencies — pure React + fetch
 *  • useMode() — adapts accent color and aesthetic to active portfolio mode
 */
"use client";
import Head from 'next/head';
import { useState, useCallback, useRef, useEffect, useReducer } from 'react';
import { useMode } from '../../context/ModeContext';

// ─── Validation ─────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields) {
  const errors = {};
  if (!fields.name.trim())             errors.name    = 'Name is required.';
  else if (fields.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
  if (!fields.email.trim())            errors.email   = 'Email is required.';
  else if (!EMAIL_RE.test(fields.email.trim())) errors.email = 'Enter a valid email address.';
  if (!fields.message.trim())          errors.message = 'Message is required.';
  else if (fields.message.trim().length < 10)  errors.message = 'Message must be at least 10 characters.';
  return errors;
}

function validateField(name, value) {
  switch (name) {
    case 'name':
      if (!value.trim()) return 'Name is required.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    case 'email':
      if (!value.trim()) return 'Email is required.';
      if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address.';
      return '';
    case 'message':
      if (!value.trim()) return 'Message is required.';
      if (value.trim().length < 10) return 'Message must be at least 10 characters.';
      return '';
    default:
      return '';
  }
}

// ─── Toast system ────────────────────────────────────────────────────────────
const MAX_TOASTS = 4;
let toastIdCounter = 0;

function toastReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [
        ...state.slice(-(MAX_TOASTS - 1)),
        { id: ++toastIdCounter, ...action.payload },
      ];
    case 'REMOVE':
      return state.filter(t => t.id !== action.id);
    default:
      return state;
  }
}

function useToasts() {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const timers = useRef({});

  const addToast = useCallback((message, type = 'info', duration = 4500) => {
    const id = ++toastIdCounter;
    dispatch({ type: 'ADD', payload: { id, message, type } });
    timers.current[id] = setTimeout(() => {
      dispatch({ type: 'REMOVE', id });
      delete timers.current[id];
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    dispatch({ type: 'REMOVE', id });
  }, []);

  useEffect(() => {
    return () => Object.values(timers.current).forEach(clearTimeout);
  }, []);

  return { toasts, addToast, removeToast };
}

// ─── Toast component ─────────────────────────────────────────────────────────
function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  const colors = {
    success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.4)', icon: '✓', iconColor: '#10b981' },
    error:   { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.4)',  icon: '✕', iconColor: '#ef4444' },
    info:    { bg: 'rgba(255,255,255,0.06)',border: 'rgba(255,255,255,0.15)',icon: 'ℹ', iconColor: 'var(--accent)' },
  };
  const c = colors[toast.type] || colors.info;

  return (
    <div
      role="alert"
      aria-live="polite"
      onClick={() => onRemove(toast.id)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        padding: '14px 16px',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '10px',
        backdropFilter: 'blur(12px)',
        cursor: 'pointer',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(20px) scale(0.96)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        maxWidth: '340px',
        width: '100%',
      }}
    >
      <span style={{
        width: '20px', height: '20px', borderRadius: '50%',
        background: c.iconColor, color: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.65rem', fontWeight: 700, flexShrink: 0, marginTop: '1px',
      }}>
        {c.icon}
      </span>
      <p style={{
        fontFamily: 'DM Mono, monospace', fontSize: '0.78rem',
        letterSpacing: '0.02em', color: 'var(--text)', lineHeight: 1.5,
        margin: 0, flex: 1,
      }}>
        {toast.message}
      </p>
    </div>
  );
}

function ToastContainer({ toasts, onRemove }) {
  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem',
      zIndex: 900,
      display: 'flex', flexDirection: 'column', gap: '10px',
      alignItems: 'flex-end',
    }}>
      {toasts.map(t => <ToastItem key={t.id} toast={t} onRemove={onRemove} />)}
    </div>
  );
}

// ─── Form field component ────────────────────────────────────────────────────
function Field({ label, name, type = 'text', value, error, touched, onChange, onBlur, placeholder, rows, disabled, charCount, maxChars }) {
  const isTextarea = type === 'textarea';
  const hasError = touched && error;
  const isValid  = touched && !error && value.trim().length > 0;

  const sharedStyle = {
    width: '100%',
    padding: isTextarea ? '14px 16px' : '14px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${
      hasError ? 'rgba(239,68,68,0.6)'
      : isValid ? 'rgba(16,185,129,0.4)'
      : 'rgba(255,255,255,0.1)'
    }`,
    borderRadius: '8px',
    outline: 'none',
    fontFamily: 'DM Mono, monospace',
    fontSize: '0.88rem',
    color: 'var(--text)',
    letterSpacing: '0.02em',
    lineHeight: 1.6,
    resize: isTextarea ? 'vertical' : undefined,
    minHeight: isTextarea ? '140px' : undefined,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
    boxSizing: 'border-box',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {/* Label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label
          htmlFor={name}
          style={{
            fontFamily: 'DM Mono, monospace', fontSize: '0.68rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: hasError ? 'rgba(239,68,68,0.9)' : isValid ? 'rgba(16,185,129,0.8)' : 'var(--muted)',
            transition: 'color 0.2s ease',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          {label}
          {isValid  && <span style={{ color: '#10b981', fontSize: '0.7rem' }}>✓</span>}
          {hasError && <span style={{ color: '#ef4444', fontSize: '0.7rem' }}>✕</span>}
        </label>
        {/* Character counter for textarea */}
        {isTextarea && maxChars && (
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: '0.62rem',
            color: charCount > maxChars * 0.9 ? '#ef4444' : 'var(--muted)',
            letterSpacing: '0.04em',
          }}>
            {charCount}/{maxChars}
          </span>
        )}
      </div>

      {/* Input or Textarea */}
      {isTextarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${name}-error` : undefined}
          style={sharedStyle}
          onFocus={e => {
            e.target.style.borderColor = hasError ? 'rgba(239,68,68,0.8)' : 'rgba(var(--accent-rgb), 0.6)';
            e.target.style.boxShadow   = `0 0 0 3px ${hasError ? 'rgba(239,68,68,0.08)' : 'rgba(var(--accent-rgb),0.06)'}`;
            e.target.style.background  = 'rgba(255,255,255,0.06)';
          }}
          onBlurCapture={e => {
            e.target.style.boxShadow  = 'none';
            e.target.style.background = 'rgba(255,255,255,0.04)';
          }}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={name === 'email' ? 'email' : name === 'name' ? 'name' : 'off'}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${name}-error` : undefined}
          style={sharedStyle}
          onFocus={e => {
            e.target.style.borderColor = hasError ? 'rgba(239,68,68,0.8)' : 'rgba(var(--accent-rgb), 0.6)';
            e.target.style.boxShadow   = `0 0 0 3px ${hasError ? 'rgba(239,68,68,0.08)' : 'rgba(var(--accent-rgb),0.06)'}`;
            e.target.style.background  = 'rgba(255,255,255,0.06)';
          }}
          onBlurCapture={e => {
            e.target.style.boxShadow  = 'none';
            e.target.style.background = 'rgba(255,255,255,0.04)';
          }}
        />
      )}

      {/* Inline error */}
      {hasError && (
        <p
          id={`${name}-error`}
          role="alert"
          style={{
            fontFamily: 'DM Mono, monospace', fontSize: '0.65rem',
            letterSpacing: '0.04em', color: '#ef4444',
            margin: 0, display: 'flex', alignItems: 'center', gap: '5px',
            animation: 'errorSlideIn 0.25s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// ─── Submit button ────────────────────────────────────────────────────────────
function SubmitButton({ status, disabled }) {
  const [hovered, setHovered] = useState(false);

  const states = {
    idle:      { label: 'Send Message',    icon: '→' },
    loading:   { label: 'Sending…',        icon: null },
    success:   { label: 'Message Sent!',   icon: '✓' },
    error:     { label: 'Try Again',       icon: '↺' },
  };
  const s = states[status] || states.idle;

  return (
    <button
      type="submit"
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={s.label}
      aria-busy={status === 'loading'}
      style={{
        width: '100%',
        padding: '15px 32px',
        background: status === 'success'
          ? 'rgba(16,185,129,0.15)'
          : status === 'error'
          ? 'rgba(239,68,68,0.15)'
          : disabled
          ? 'rgba(255,255,255,0.04)'
          : hovered
          ? 'var(--accent)'
          : 'var(--accent)',
        border: `1px solid ${
          status === 'success' ? 'rgba(16,185,129,0.5)'
          : status === 'error'  ? 'rgba(239,68,68,0.5)'
          : disabled ? 'rgba(255,255,255,0.08)'
          : 'var(--accent)'
        }`,
        borderRadius: '8px',
        color: status === 'success'
          ? '#10b981'
          : status === 'error'
          ? '#ef4444'
          : disabled
          ? 'var(--muted)'
          : 'var(--bg)',
        fontFamily: 'DM Mono, monospace',
        fontSize: '0.8rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered && !disabled ? 'translateY(-2px)' : 'none',
        boxShadow: hovered && !disabled && status === 'idle'
          ? '0 8px 24px rgba(var(--accent-rgb),0.35)'
          : 'none',
        fontWeight: 500,
      }}
    >
      {/* Spinner for loading */}
      {status === 'loading' && (
        <span style={{
          width: '14px', height: '14px',
          border: '2px solid rgba(255,255,255,0.3)',
          borderTopColor: 'rgba(255,255,255,0.9)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
          flexShrink: 0,
        }} aria-hidden="true" />
      )}
      {s.label}
      {s.icon && status !== 'loading' && (
        <span style={{
          display: 'inline-block',
          transform: hovered && !disabled && status === 'idle' ? 'translateX(3px)' : 'none',
          transition: 'transform 0.2s ease',
        }} aria-hidden="true">
          {s.icon}
        </span>
      )}
    </button>
  );
}

// ─── Main contact page ────────────────────────────────────────────────────────
const INITIAL_FORM   = { name: '', email: '', message: '' };
const INITIAL_ERRORS = { name: '', email: '', message: '' };
const INITIAL_TOUCHED = { name: false, email: false, message: false };
const MAX_MESSAGE    = 1000;

export default function ContactPage() {
  const { content, mode }           = useMode();

  const [form,         setForm]         = useState(INITIAL_FORM);
  const [errors,       setErrors]       = useState(INITIAL_ERRORS);
  const [touched,      setTouched]      = useState(INITIAL_TOUCHED);
  const [status,       setStatus]       = useState('idle'); // idle | loading | success | error
  const [mounted,      setMounted]      = useState(false);

  const { toasts, addToast, removeToast } = useToasts();

  // Double-submit protection
  const isSubmitting = useRef(false);
  // Debounce timer for email
  const emailDebounce = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  // ── Generic change handler ─────────────────────────────────────────────
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    // Enforce max length on message
    if (name === 'message' && value.length > MAX_MESSAGE) return;

    setForm(prev => ({ ...prev, [name]: value }));

    // Clear error immediately on typing if field was touched
    if (touched[name]) {
      if (name === 'email') {
        // Debounce email validation — don't show error while user is still typing
        clearTimeout(emailDebounce.current);
        emailDebounce.current = setTimeout(() => {
          setErrors(prev => ({ ...prev, email: validateField('email', value) }));
        }, 600);
        setErrors(prev => ({ ...prev, email: '' })); // clear immediately while typing
      } else {
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
      }
    }
  }, [touched]);

  // ── Blur handler — validate field on leave ─────────────────────────────
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    clearTimeout(emailDebounce.current);
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  }, []);

  // ── Submit handler ─────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Double-submit guard
    if (isSubmitting.current) return;

    // Validate all fields
    const allErrors = validate(form);
    const allTouched = { name: true, email: true, message: true };
    setTouched(allTouched);
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      addToast('Please fix the errors before submitting.', 'error');
      // Focus first invalid field
      const firstError = Object.keys(allErrors)[0];
      document.getElementById(firstError)?.focus();
      return;
    }

    isSubmitting.current = true;
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    form.name.trim(),
          email:   form.email.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Server error (${res.status})`);
      }

      // Success
      setStatus('success');
      addToast('Message sent! I\'ll get back to you soon.', 'success', 6000);

      // Reset form after 2s so user sees success state first
      setTimeout(() => {
        setForm(INITIAL_FORM);
        setErrors(INITIAL_ERRORS);
        setTouched(INITIAL_TOUCHED);
        setStatus('idle');
      }, 2500);

    } catch (err) {
      setStatus('error');
      const msg = err.message || 'Something went wrong. Please try again.';
      addToast(msg, 'error', 6000);
    } finally {
      isSubmitting.current = false;
    }
  }, [form, addToast]);

  // Is form complete enough to submit?
  const isFormDirty = form.name || form.email || form.message;
  const hasErrors   = Object.values(errors).some(Boolean);
  const isDisabled  = status === 'loading' || status === 'success';

  if (!mounted) return null;

  const accentColor = content?.theme?.accent || '#ff6b35';

  return (
    <>
      <Head>
        <title>Contact — Akram Rihani</title>
        <meta name="description" content="Get in touch with Akram Rihani — open to projects, collaborations, and conversations." />
      </Head>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes errorSlideIn {
          from { opacity:0; transform:translateY(-4px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pageIn {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes successPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
          50%     { box-shadow: 0 0 0 8px rgba(16,185,129,0.08); }
        }
        /* Placeholder styling */
        input::placeholder, textarea::placeholder {
          color: rgba(255,255,255,0.18);
          font-family: 'DM Mono', monospace;
        }
        /* Textarea scrollbar */
        textarea::-webkit-scrollbar { width: 4px; }
        textarea::-webkit-scrollbar-track { background: transparent; }
        textarea::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius:2px; }
        /* Autofill fix */
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 30px rgba(10,10,8,0.9) inset !important;
          -webkit-text-fill-color: var(--text) !important;
        }
      `}</style>

      <main style={{
        paddingTop: '120px',
        paddingBottom: '6rem',
        minHeight: '100vh',
        animation: 'pageIn 0.6s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '5rem',
          alignItems: 'start',
        }}>

          {/* ── Left: Info panel ── */}
          <div style={{ paddingTop: '0.5rem' }}>
            <span style={{
              fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--accent)', display: 'block', marginBottom: '1rem',
            }}>
              Get in touch
            </span>

            <h1 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 'clamp(2.2rem,5vw,3.8rem)', letterSpacing: '-0.04em',
              lineHeight: 1.05, color: 'var(--white)', marginBottom: '1.5rem',
            }}>
              Let's build<br />
              <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)', color: 'transparent' }}>
                something
              </span><br />
              great.
            </h1>

            <p style={{
              fontFamily: 'DM Mono, monospace', fontSize: '0.88rem',
              lineHeight: 1.9, color: 'var(--muted)', marginBottom: '2.5rem',
            }}>
              Open to full-time roles, freelance projects, and interesting collaborations. Response time is usually within 24 hours.
            </p>

            {/* Contact details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: '✉', label: 'Email',    value: 'akramrihanie@gmail.com', href: 'mailto:hello@akramrihani.dev' },
                { icon: '⌨', label: 'GitHub',   value: 'github.com/Syntaxri',    href: 'https://github.com/Syntaxri' },
                { icon: '◈', label: 'LinkedIn', value: 'linkedin.com/in/riihaniakram', href: 'https://linkedin.com/in/riihaniakram' },
              ].map(({ icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    textDecoration: 'none', padding: '12px 16px',
                    border: '1px solid var(--border)', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                    transition: 'all 0.2s ease',
                    group: true,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb),0.4)';
                    e.currentTarget.style.background  = 'rgba(var(--accent-rgb),0.04)';
                    e.currentTarget.style.transform   = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background  = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.transform   = 'none';
                  }}
                >
                  <span style={{
                    width: '32px', height: '32px', borderRadius: '6px',
                    background: 'rgba(var(--accent-rgb),0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', color: 'var(--accent)', flexShrink: 0,
                  }}>
                    {icon}
                  </span>
                  <div>
                    <p style={{ fontFamily:'DM Mono, monospace', fontSize:'0.62rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'2px' }}>{label}</p>
                    <p style={{ fontFamily:'DM Mono, monospace', fontSize:'0.78rem', color:'var(--text)', letterSpacing:'0.02em' }}>{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Availability badge */}
            <div style={{
              marginTop: '2rem', display: 'inline-flex',
              alignItems: 'center', gap: '8px',
              padding: '8px 14px', borderRadius: '20px',
              border: '1px solid rgba(16,185,129,0.3)',
              background: 'rgba(16,185,129,0.06)',
            }}>
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#10b981',
                animation: 'successPulse 2s ease-in-out infinite',
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: '0.68rem',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#10b981',
              }}>
                Available for work
              </span>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden',
            animation: status === 'success' ? 'successPulse 1.5s ease' : 'none',
          }}>
            {/* Top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px',
              background: `linear-gradient(90deg, transparent, var(--accent), transparent)`,
              borderRadius: '0 0 2px 2px',
            }} aria-hidden="true" />

            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Contact form"
              style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}
            >
              <Field
                label="Your Name"
                name="name"
                value={form.name}
                error={errors.name}
                touched={touched.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Akram Rihani"
                disabled={isDisabled}
              />

              <Field
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                error={errors.email}
                touched={touched.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                disabled={isDisabled}
              />

              <Field
                label="Message"
                name="message"
                type="textarea"
                value={form.message}
                error={errors.message}
                touched={touched.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Tell me about your project, idea, or just say hello…"
                disabled={isDisabled}
                charCount={form.message.length}
                maxChars={MAX_MESSAGE}
              />

              {/* Form-level hint */}
              <p style={{
                fontFamily: 'DM Mono, monospace', fontSize: '0.62rem',
                letterSpacing: '0.06em', color: 'rgba(255,255,255,0.18)',
                margin: '0 0 0.2rem',
              }}>
                All fields required · Response within 24h
              </p>

              <SubmitButton
                status={status}
                disabled={isDisabled || (isFormDirty && hasErrors)}
              />
            </form>
          </div>

        </div>
      </main>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}