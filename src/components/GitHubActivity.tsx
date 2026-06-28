import type { GitHubEvent } from '@/types'

const GITHUB_USERNAME = 'Syntaxri'

async function getGitHubEvents(): Promise<GitHubEvent[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=30`,
      {
        next: { revalidate: 300 },
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'portfolio-app',
        },
      }
    )
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

function getEventDescription(event: GitHubEvent): string {
  switch (event.type) {
    case 'PushEvent': {
      const payload = event.payload as { commits?: { message: string }[] }
      const count = payload.commits?.length ?? 0
      const msg = payload.commits?.[0]?.message ?? ''
      const shortMsg = msg.length > 50 ? msg.slice(0, 50) + '…' : msg
      return `${count} commit${count > 1 ? 's' : ''}${shortMsg ? `: ${shortMsg}` : ''}`
    }
    case 'CreateEvent': {
      const payload = event.payload as { ref_type?: string }
      return `Created ${payload.ref_type || 'repository'}`
    }
    case 'IssuesEvent': {
      const payload = event.payload as { action?: string }
      return `Issue ${payload.action}`
    }
    case 'PullRequestEvent': {
      const payload = event.payload as { action?: string }
      return `PR ${payload.action}`
    }
    case 'StarEvent':
      return `Starred a repository`
    case 'ForkEvent':
      return `Forked a repository`
    case 'WatchEvent':
      return `Started watching`
    default:
      return `Activity in ${event.repo.name}`
  }
}

function timeAgo(dateString: string): string {
  const now = Date.now()
  const date = new Date(dateString).getTime()
  const diff = now - date
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return dateString.slice(0, 10)
}

export async function GitHubActivity() {
  const events = await getGitHubEvents()

  const uniqueRepos = new Set(events.map((e) => e.repo.name))
  const pushCount = events.filter((e) => e.type === 'PushEvent').length
  const prCount = events.filter((e) => e.type === 'PullRequestEvent').length
  const issueCount = events.filter((e) => e.type === 'IssuesEvent').length

  return (
    <div className="panel p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[0.55rem] font-bold"
            style={{
              background: 'rgba(var(--accent-rgb), 0.1)',
              border: '1px solid rgba(var(--accent-rgb), 0.25)',
              color: 'var(--accent)',
            }}
          >
            G
          </div>
          <h3 className="font-display font-semibold text-sm text-white tracking-tight">
            GitHub
          </h3>
        </div>
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[0.55rem] tracking-widest uppercase no-underline transition-colors"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          Profile ↗
        </a>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-white/30 text-center py-8">
          No recent GitHub activity
        </p>
      ) : (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            <div
              className="rounded-xl p-3 text-center"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <p
                className="font-display font-bold text-lg tracking-tight leading-none"
                style={{ color: 'var(--accent)' }}
              >
                {uniqueRepos.size}
              </p>
              <p className="font-mono text-[0.5rem] tracking-widest uppercase text-white/25 mt-1">
                Repositories
              </p>
            </div>
            <div
              className="rounded-xl p-3 text-center"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <p
                className="font-display font-bold text-lg tracking-tight leading-none"
                style={{ color: 'var(--accent)' }}
              >
                {pushCount + prCount + issueCount}
              </p>
              <p className="font-mono text-[0.5rem] tracking-widest uppercase text-white/25 mt-1">
                Contributions
              </p>
            </div>
          </div>

          {/* Core technologies */}
          <div className="mb-5">
            <p className="font-mono text-[0.5rem] tracking-widest uppercase text-white/25 mb-2.5">
              Core Technologies
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Java', 'Spring Boot', 'React', 'TypeScript', 'Next.js', 'MySQL', 'Docker'].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 rounded-md font-mono text-[0.55rem] tracking-wider uppercase"
                    style={{
                      background: 'rgba(var(--accent-rgb), 0.08)',
                      border: '1px solid rgba(var(--accent-rgb), 0.15)',
                      color: 'var(--accent)',
                    }}
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Recent activity feed */}
          <div>
            <p className="font-mono text-[0.5rem] tracking-widest uppercase text-white/25 mb-2.5">
              Recent Activity
            </p>
            <div className="space-y-0">
              {events.slice(0, 4).map((event, i) => (
                <div
                  key={event.id}
                  className="flex items-start gap-2.5 py-2 border-t border-white/[0.03] first:border-t-0"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{
                      background: i < 2 ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-relaxed text-white/60 line-clamp-1">
                      {getEventDescription(event)}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[0.55rem] font-mono tracking-wider text-white/20 truncate">
                        {event.repo.name.split('/')[1]}
                      </span>
                      <span className="text-[0.5rem] font-mono tracking-wider text-white/15">
                        {timeAgo(event.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
