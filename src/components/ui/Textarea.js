'use client';

import { MAX_MESSAGE_LENGTH } from '@/config/contact';

export default function Textarea({
  label,
  name,
  value,
  error,
  touched,
  onChange,
  onBlur,
  placeholder,
  disabled,
  charCount,
  maxChars = MAX_MESSAGE_LENGTH,
  className = '',
}) {
  const hasError = touched && error;
  const isValid = touched && !error && value?.trim().length > 0;

  const borderColor = hasError
    ? 'border-red-500/60'
    : isValid
      ? 'border-emerald-500/40'
      : 'border-white/10';

  const labelColor = hasError
    ? 'text-red-400/90'
    : isValid
      ? 'text-emerald-400/80'
      : 'text-white/40';

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label
          htmlFor={name}
          className={`font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 ${labelColor}`}
        >
          {label}
          {isValid && <span className="text-emerald-400 text-xs">&#10003;</span>}
          {hasError && <span className="text-red-400 text-xs">&#10005;</span>}
        </label>

        <span
          className={`font-mono text-xs tracking-wider ${
            charCount > maxChars * 0.9 ? 'text-red-400' : 'text-white/30'
          }`}
        >
          {charCount}/{maxChars}
        </span>
      </div>

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
        className={`
          w-full px-4 py-3.5
          bg-white/[0.04] rounded-lg
          font-mono text-sm text-white/95
          placeholder:text-white/[0.18] placeholder:font-mono
          outline-none border transition-all duration-200
          focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_var(--accent)_at_0.08]
          disabled:opacity-50
          resize-y min-h-[140px]
          ${borderColor}
          ${className}
        `}
        onFocus={(e) => {
          e.target.style.borderColor = hasError
            ? 'rgba(239,68,68,0.8)'
            : 'rgba(var(--accent-rgb),0.6)';
          e.target.style.boxShadow = hasError
            ? '0 0 0 3px rgba(239,68,68,0.08)'
            : '0 0 0 3px rgba(var(--accent-rgb),0.06)';
        }}
        onBlurCapture={(e) => {
          e.target.style.boxShadow = 'none';
        }}
      />

      {hasError && (
        <p
          id={`${name}-error`}
          role="alert"
          className="font-mono text-xs text-red-400 flex items-center gap-1 mt-0.5"
        >
          <span aria-hidden>&#9888;</span> {error}
        </p>
      )}
    </div>
  );
}
