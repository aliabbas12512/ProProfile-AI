import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  error: Error | null
}

/** Catches rendering errors anywhere in the app so a bug in one profile's
 * data (e.g. from a corrupted import) shows a recoverable error screen
 * instead of a blank white page. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('ProProfile AI crashed:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h1 className="text-lg font-bold mb-2">Something went wrong</h1>
            <p className="text-sm text-slate-400 mb-5">
              This screen hit an unexpected error. Your saved projects are untouched — go back to the home
              screen and try again.
            </p>
            <a href="#/" onClick={() => window.location.reload()} className="inline-block text-xs bg-amber-500 text-slate-900 font-semibold rounded-md px-4 py-2">
              Back to Home
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
