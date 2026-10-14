/**
 * Loading state for the work/case-study routes.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="label label-muted">Opening the exhibit…</span>
      </div>
    </div>
  )
}
