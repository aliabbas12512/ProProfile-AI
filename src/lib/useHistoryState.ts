import { useCallback, useRef, useState } from 'react'

/** Minimal undo/redo wrapper around useState. Pushes a history entry on
 * every change; Back/Forward walk the stack without creating new entries. */
export function useHistoryState<T>(initial: T) {
  const [state, setStateRaw] = useState(initial)
  const history = useRef<T[]>([initial])
  const index = useRef(0)
  const isTimeTraveling = useRef(false)

  const setState = useCallback((updater: T | ((prev: T) => T)) => {
    setStateRaw((prev) => {
      const next = typeof updater === 'function' ? (updater as (p: T) => T)(prev) : updater
      if (!isTimeTraveling.current) {
        history.current = history.current.slice(0, index.current + 1)
        history.current.push(next)
        index.current = history.current.length - 1
      }
      isTimeTraveling.current = false
      return next
    })
  }, [])

  const undo = useCallback(() => {
    if (index.current === 0) return
    index.current -= 1
    isTimeTraveling.current = true
    setStateRaw(history.current[index.current])
  }, [])

  const redo = useCallback(() => {
    if (index.current >= history.current.length - 1) return
    index.current += 1
    isTimeTraveling.current = true
    setStateRaw(history.current[index.current])
  }, [])

  const canUndo = index.current > 0
  const canRedo = index.current < history.current.length - 1

  return { state, setState, undo, redo, canUndo, canRedo }
}
