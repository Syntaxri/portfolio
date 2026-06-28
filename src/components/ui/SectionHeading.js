export default function SectionHeading({
  label,
  title,
  description,
  accent = false,
  align = 'left',
  className = '',
}) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`mb-12 ${alignClass} ${className}`}>
      {label && (
        <span className="font-mono text-xs uppercase tracking-wide text-[var(--accent)] block mb-4">
          {label}
        </span>
      )}
      {title && (
        <h2
          className={`font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight ${
            accent ? 'text-gradient' : 'text-white'
          }`}
        >
          {title}
        </h2>
      )}
      {description && (
        <p className="font-mono text-sm sm:text-base text-white/40 leading-relaxed mt-4 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
