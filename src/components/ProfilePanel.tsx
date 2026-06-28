import Link from 'next/link'

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/Syntaxri',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/riihaniakram',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },

]

export function ProfilePanel() {
  return (
    <div className="panel p-5">
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <div
            className="w-14 h-14 rounded-full overflow-hidden"
            style={{
              border: '1px solid rgba(var(--accent-rgb), 0.2)',
            }}
          >
            <img
              src="/images/akram.png"
              alt="Akram Rihani"
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
            style={{
              background: '#22c55e',
              borderColor: 'var(--bg)',
              animation: 'status-pulse 2s ease-in-out infinite',
            }}
          />
        </div>
        <div>
          <h2 className="font-display font-bold text-base text-white leading-tight">
            Akram Rihani
          </h2>
          <p className="font-mono text-[0.6rem] tracking-wider text-white/35 mt-0.5">
            Backend-Focused Full Stack Engineer
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5">
        <span
          className="w-[6px] h-[6px] rounded-full shrink-0"
          style={{
            background: '#22c55e',
            animation: 'status-pulse 2s ease-in-out infinite',
          }}
        />
        <span className="font-mono text-[0.6rem] tracking-wider uppercase text-emerald-400">
          Available for work
        </span>
      </div>

      <p className="text-sm leading-relaxed text-white/55 mb-5">
        Backend-focused full-stack engineer specialising in Java 17, Spring
        Boot 3, and REST API design. I build secure, scalable systems with
        clean architecture and measurable performance.
      </p>

      <div className="divider mb-4" />

      <div className="space-y-2 mb-5">
        <a
          href="mailto:akramrihanie@gmail.com"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg no-underline transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <span className="w-7 h-7 rounded-md flex items-center justify-center text-xs"
            style={{
              background: 'rgba(var(--accent-rgb), 0.08)',
              color: 'var(--accent)',
            }}
          >
            ✉
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[0.5rem] tracking-widest uppercase text-white/25">
              Email
            </p>
            <p className="text-xs text-white/70 truncate">
              akramrihanie@gmail.com
            </p>
          </div>
        </a>
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <span className="w-7 h-7 rounded-md flex items-center justify-center text-xs"
            style={{
              background: 'rgba(var(--accent-rgb), 0.08)',
              color: 'var(--accent)',
            }}
          >
            📍
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[0.5rem] tracking-widest uppercase text-white/25">
              Location
            </p>
            <p className="text-xs text-white/70">
              Morocco
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-white/5 hover:text-white/70"
            style={{
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            {link.icon}
          </a>
        ))}
      </div>

      <div className="space-y-2">
        <Link
          href="/contact"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-mono text-[0.65rem] tracking-widest uppercase no-underline transition-all duration-200"
          style={{
            background: 'rgba(var(--accent-rgb), 0.12)',
            border: '1px solid rgba(var(--accent-rgb), 0.25)',
            color: 'var(--accent)',
          }}
        >
          Get in touch →
        </Link>
        <Link
          href="/projects"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-mono text-[0.65rem] tracking-widest uppercase no-underline transition-all duration-200"
          style={{
            border: '1px solid rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          View projects →
        </Link>
      </div>
    </div>
  )
}
