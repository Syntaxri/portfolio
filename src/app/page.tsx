import { GitHubActivity } from '../components/GitHubActivity'
import { ProfilePanel } from '../components/ProfilePanel'
import { ProjectsPanel } from '../components/ProjectsPanel'
import { TechStack } from '../components/TechStack'

export default function Home() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-6">
      {/* Three-panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-5 items-start">
        <div
          className="lg:sticky lg:top-28 animate-slide-up"
          style={{ animationDelay: '0.1s', opacity: 0 }}
        >
          <ProfilePanel />
        </div>

        <div
          className="animate-slide-up"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          <ProjectsPanel />
        </div>

        <div
          className="lg:sticky lg:top-28 hidden lg:block animate-slide-up"
          style={{ animationDelay: '0.25s', opacity: 0 }}
        >
          <GitHubActivity />
        </div>
      </div>

      <div
        className="mt-16 mb-10 animate-slide-up"
        style={{ animationDelay: '0.3s', opacity: 0 }}
      >
        <TechStack />
      </div>
    </div>
  )
}
