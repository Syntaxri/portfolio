/**
 * Mutable scroll state shared between DOM (GSAP) and the WebGL world.
 * Deliberately not React state — updated every scroll tick without renders.
 */
export const scrollState = {
  progress: 0,
  velocity: 0,
  y: 0,
}

export function setScrollStats(y: number, progress: number, velocity: number) {
  scrollState.y = y
  scrollState.progress = progress
  scrollState.velocity = velocity
}
