/**
 * Root loading state — shown during route transitions.
 *
 * NOTE: This is intentionally minimal. The home page has its own
 * <Preloader> (the door ceremony) which handles the initial load
 * experience. This loading.tsx only fires for route transitions
 * (e.g., navigating to /work/[slug]), not for the initial home page load.
 *
 * If you see a double-flash on home page loads, it means this is
 * rendering before the Preloader finishes — in that case, remove
 * this file and rely solely on the Preloader for the home experience.
 */
export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="label label-muted">Preparing the exhibition…</span>
      </div>
    </div>
  )
}
