# CI/CD Pipeline

## Workflows

| Workflow | Trigger | Jobs | Purpose |
|---|---|---|---|
| **CI** | Push to `main`, PR | `gate` → `checks` → `build` → `e2e` (matrix) | Fast PR feedback + full cross-browser on merge |
| **Nightly** | `cron: '0 2 * * *'` | `e2e` (matrix: 5 projects) | Full cross-browser regression against `main` |

## Pipeline Design

```
PR (chromium only)        Push to main              Nightly (02:00 UTC)
────────────────          ────────────              ────────────────────
gate → checks → build     gate → checks → build     e2e (5 projects in parallel)
  → e2e (chromium)          → e2e (5 projects)       30 min timeout
```

## Job Details

### `gate` — always-pass status check

- Runs on every PR and push
- Provides a stable required check for branch protection
- Prevents deadlock when `paths-ignore` would skip the entire workflow

### `checks` — lint + typecheck + unit tests

- Runs on every PR and push
- 10 minute timeout
- Caches `node_modules` via npm

### `build` — Next.js production build

- Runs on every PR and push
- Produces `.next/` artifact (1 day retention)
- `include-hidden-files: true` — required for `.next` directory
- No E2E env vars needed — `validateEnv()` only throws at request time in production

### `e2e` — Playwright matrix

- Needs `build` job artifact
- **PR**: chromium only (`if: github.event_name != 'pull_request' || matrix.project == 'chromium'`)
- **Push to main**: all 5 projects
- Matrix: `chromium`, `firefox`, `webkit`, `mobile-chrome`, `mobile-safari`
- `fail-fast: false` — all shards run even if one fails
- 15 minute timeout per shard
- Playwright browsers cached via `actions/cache@v4` keyed on lockfile hash
- On cache hit: runs `playwright install-deps` only (no full browser download)
- Video disabled in CI; traces kept on first retry
- HTML report uploaded as artifact on failure (7 day retention)

## PR Coverage Strategy

| Trigger | E2E projects | Why |
|---|---|---|
| `pull_request` | chromium only | Fastest signal; catches 90% of regressions |
| `push` to `main` | all 5 | Full cross-browser before deploy |
| `schedule` (nightly) | all 5 | Regression against `main` |

## Cost Optimizations

- **Parallel shards**: 5 projects run concurrently on push/nightly
- **PR chromium-only**: 80% reduction in E2E runner minutes on PRs
- **No redundant builds**: `e2e` reuses `.next/` from `build` job
- **Browser cache**: Lockfile-keyed cache avoids re-downloading ~500MB on every run
- **Video off**: No video encoding or upload costs in CI
- **Retention**: Build artifacts 1 day, test reports 7–14 days

## Performance Targets

| Job | Current | Target |
|---|---|---|
| `checks` | ~1.5 min | ~1.5 min |
| `build` | ~2 min | ~2 min |
| `e2e` (full matrix) | ~21 min (sequential) | ~5 min (parallel) |
| **PR wall-clock** | ~25 min | **< 8 min** |

## Tuning

Playwright workers per shard are configurable via `PW_WORKERS` env var:

```yaml
# Example: 3 workers per shard
env:
  PW_WORKERS: 3
```

Default is 3 in CI. Increase for faster shards, decrease if runners are CPU-constrained.
