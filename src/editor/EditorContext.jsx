import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { buildCss, viewportForWidth } from './props'
import {
  clone,
  loadInitial,
  persistSaved,
  pruneEmpty,
  removeId,
  setValue,
} from './store'

const EditorCtx = createContext(null)
export const useEditor = () => useContext(EditorCtx)

export function EditorProvider({ children, lenis }) {
  const [enabled, setEnabled] = useState(false)
  const [viewport, setViewport] = useState('desktop')
  const [selectedId, setSelectedId] = useState(null)

  const [overrides, setOverrides] = useState(() => loadInitial())
  const [savedSnapshot, setSavedSnapshot] = useState(() => clone(loadInitial()))

  // History: stacks of full-overrides snapshots.
  const [past, setPast] = useState([])
  const [future, setFuture] = useState([])
  // Snapshot captured at the start of a continuous gesture (drag/resize) so the
  // whole gesture collapses into a single undo step.
  const gestureSnap = useRef(null)

  const dirty = useMemo(
    () => JSON.stringify(pruneEmpty(overrides)) !== JSON.stringify(pruneEmpty(savedSnapshot)),
    [overrides, savedSnapshot],
  )

  // ---- history-aware mutation -------------------------------------------------
  const pushHistory = useCallback((snapshot) => {
    setPast((p) => [...p.slice(-99), snapshot])
    setFuture([])
  }, [])

  // Discrete change (numeric input, reset, keyboard tap): one history entry each.
  const commit = useCallback(
    (mutator) => {
      setOverrides((prev) => {
        pushHistory(clone(prev))
        return mutator(clone(prev))
      })
    },
    [pushHistory],
  )

  // Continuous change (mouse drag/resize): call beginGesture once, then setLive
  // freely, then endGesture to record a single undo step.
  const beginGesture = useCallback(() => {
    gestureSnap.current = clone(overrides)
  }, [overrides])

  const setLive = useCallback((mutator) => {
    setOverrides((prev) => mutator(clone(prev)))
  }, [])

  const endGesture = useCallback(() => {
    if (gestureSnap.current) {
      const snap = gestureSnap.current
      gestureSnap.current = null
      setOverrides((cur) => {
        if (JSON.stringify(cur) !== JSON.stringify(snap)) pushHistory(snap)
        return cur
      })
    }
  }, [pushHistory])

  // Convenience: set a single prop on the current selection + viewport.
  const setProp = useCallback(
    (key, value, { live = false } = {}) => {
      if (!selectedId) return
      const fn = (prev) => setValue(prev, selectedId, viewport, key, value)
      if (live) setLive(fn)
      else commit(fn)
    },
    [selectedId, viewport, commit, setLive],
  )

  const undo = useCallback(() => {
    setPast((p) => {
      if (!p.length) return p
      const prev = p[p.length - 1]
      setOverrides((cur) => {
        setFuture((f) => [clone(cur), ...f.slice(0, 99)])
        return prev
      })
      return p.slice(0, -1)
    })
  }, [])

  const redo = useCallback(() => {
    setFuture((f) => {
      if (!f.length) return f
      const next = f[0]
      setOverrides((cur) => {
        setPast((p) => [...p.slice(-99), clone(cur)])
        return next
      })
      return f.slice(1)
    })
  }, [])

  const resetElement = useCallback(
    (id = selectedId) => {
      if (!id) return
      commit((prev) => removeId(prev, id))
    },
    [selectedId, commit],
  )

  const resetAll = useCallback(() => commit(() => ({})), [commit])

  const save = useCallback(() => {
    const clean = pruneEmpty(overrides)
    persistSaved(clean)
    setSavedSnapshot(clone(clean))
  }, [overrides])

  const exportJson = useCallback(() => JSON.stringify(pruneEmpty(overrides), null, 2), [overrides])

  // ---- live stylesheet injection ---------------------------------------------
  useEffect(() => {
    let tag = document.getElementById('tt-editor-overrides')
    if (!tag) {
      tag = document.createElement('style')
      tag.id = 'tt-editor-overrides'
      document.head.appendChild(tag)
    }
    tag.textContent = buildCss(overrides, { activeViewport: enabled ? viewport : null })
  }, [overrides, enabled, viewport])

  // While editing, reflect the chosen layer on <html> so the preview mirror in
  // buildCss activates. Also flag design-mode for global CSS affordances.
  useEffect(() => {
    const el = document.documentElement
    if (enabled) {
      el.dataset.editorVp = viewport
      el.dataset.editorOn = 'true'
    } else {
      delete el.dataset.editorVp
      delete el.dataset.editorOn
    }
  }, [enabled, viewport])

  // Design Mode pauses smooth-scroll so dragging doesn't fight Lenis; restore on
  // exit. Also clear the current selection when leaving the editor.
  useEffect(() => {
    if (!lenis) return
    if (enabled) lenis.stop()
    else lenis.start()
  }, [enabled, lenis])

  useEffect(() => {
    if (!enabled) setSelectedId(null)
  }, [enabled])

  // Which layer is actually live for the current window width (for a hint).
  const [liveViewport, setLiveViewport] = useState(() =>
    typeof window === 'undefined' ? 'desktop' : viewportForWidth(window.innerWidth),
  )
  useEffect(() => {
    const onResize = () => setLiveViewport(viewportForWidth(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const value = {
    enabled,
    setEnabled,
    viewport,
    setViewport,
    liveViewport,
    selectedId,
    setSelectedId,
    overrides,
    // history
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    undo,
    redo,
    // mutations
    beginGesture,
    setLive,
    endGesture,
    setProp,
    resetElement,
    resetAll,
    // persistence
    dirty,
    save,
    exportJson,
  }

  return <EditorCtx.Provider value={value}>{children}</EditorCtx.Provider>
}
