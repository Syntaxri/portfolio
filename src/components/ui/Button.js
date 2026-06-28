'use client';

const variants = {
  primary:
    'bg-[var(--accent)] text-[var(--bg)] hover:opacity-90 shadow-lg shadow-[var(--accent)]/25',
  secondary:
    'border border-white/10 text-white/80 hover:text-white hover:border-white/25 hover:bg-white/5',
  ghost: 'text-white/40 hover:text-white/70',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-sm',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-mono uppercase tracking-widest
        rounded-lg transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin-slow" aria-hidden />
      )}
      {children}
    </button>
  );
}
