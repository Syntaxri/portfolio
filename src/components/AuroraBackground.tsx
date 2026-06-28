export function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070a12] via-[#0b1220] to-[#070a12]" />

      {/* Aurora blobs */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full opacity-30 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at center, rgba(139,92,246,0.25) 0%, rgba(99,102,241,0.1) 30%, transparent 60%)',
          animation: 'aurora-drift 25s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-[-10%] right-[-15%] w-[700px] h-[700px] rounded-full opacity-25 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at center, rgba(168,85,247,0.2) 0%, rgba(236,72,153,0.08) 30%, transparent 60%)',
          animation: 'aurora-drift 30s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] rounded-full opacity-20 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at center, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.08) 30%, transparent 60%)',
          animation: 'aurora-drift 20s ease-in-out infinite',
          animationDelay: '-10s',
        }}
      />

      {/* Depth layer */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-transparent to-[#070a12] opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#070a12] via-transparent to-[#070a12] opacity-40" />
    </div>
  )
}
