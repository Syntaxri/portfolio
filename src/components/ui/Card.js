export default function Card({
  children,
  variant = 'default',
  hover = false,
  className = '',
  ...props
}) {
  const variants = {
    default: 'glass rounded-xl',
    elevated: 'glass rounded-2xl shadow-xl shadow-black/30',
    flat: 'bg-white/[0.02] border border-white/[0.06] rounded-xl',
  };

  return (
    <div
      className={`
        ${variants[variant] || variants.default}
        ${hover ? 'glass-hover cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
