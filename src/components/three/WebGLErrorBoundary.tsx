'use client'

import { Component, type ReactNode } from 'react'

interface WebGLErrorBoundaryProps {
  onFail: (error: unknown) => void
  children: ReactNode
}

interface WebGLErrorBoundaryState {
  failed: boolean
}

/**
 * Scoped to the WebGL subsystem only — a WebGL crash must never take the
 * page down with it. The DOM hero content lives outside this boundary and
 * remains available in every case.
 */
export class WebGLErrorBoundary extends Component<WebGLErrorBoundaryProps, WebGLErrorBoundaryState> {
  state: WebGLErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    this.props.onFail(error)
  }

  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}
