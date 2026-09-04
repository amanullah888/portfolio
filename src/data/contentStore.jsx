// =============================================================================
// Content store — layers your saved/edited copy on top of the CONTENT defaults.
//
//   defaults (content.js)  <  committed overrides (content.overrides.json)  <
//   live edits (localStorage, made in Content Mode)
//
// Overrides are a FLAT map of dotted paths → values, e.g.
//   { "hero.name": "…", "projects.items.2.desc": "…" }
// which makes them trivial to save, diff and reset.
//
// Components read copy with `useContent()` (the merged tree). The editor uses
// `useContentEditor()` for the mutation/save controls.
// =============================================================================
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import CONTENT from './content'
import FILE_OVERRIDES from './content.overrides.json'

const LOCAL_KEY = 'tt-portfolio:content:overrides'

const clone = (o) => JSON.parse(JSON.stringify(o))

// --- path helpers ------------------------------------------------------------
export function getByPath(obj, path) {
  const parts = Array.isArray(path) ? path : String(path).split('.')
  let cur = obj
  for (const p of parts) {
    if (cur == null) return undefined
    cur = cur[p]
  }
  return cur
}

export function setByPath(obj, path, value) {
  const parts = Array.isArray(path) ? path : String(path).split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]
    if (cur[key] == null || typeof cur[key] !== 'object') {
      // next segment numeric → make an array, else an object
      cur[key] = /^\d+$/.test(parts[i + 1]) ? [] : {}
    }
    cur = cur[key]
  }
  cur[parts[parts.length - 1]] = value
  return obj
}

// Build the merged content tree from defaults + a flat overrides map.
function buildMerged(overrides) {
  const out = clone(CONTENT)
  for (const [path, value] of Object.entries(overrides || {})) {
    if (value === undefined) continue
    try {
      setByPath(out, path, value)
    } catch {
      /* ignore a stale path that no longer exists in the schema */
    }
  }
  return out
}

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}') || {}
  } catch {
    return {}
  }
}

// The committed baseline shipped with the site (empty until you Save).
const FILE = FILE_OVERRIDES && typeof FILE_OVERRIDES === 'object' ? FILE_OVERRIDES : {}

const ContentCtx = createContext(null)
const EditorCtx = createContext(null)

export function ContentProvider({ children }) {
  // Live layer: file overrides + whatever is unsaved in localStorage.
  const [local, setLocal] = useState(() => ({ ...FILE, ...loadLocal() }))
  // The last state written to disk — what "dirty" is measured against. Starts
  // at the committed file so a fresh load with no local edits reads as clean.
  const [savedBaseline, setSavedBaseline] = useState(() => ({ ...FILE }))

  // Persist the live layer as you type so a refresh never loses work.
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(local))
    } catch {
      /* storage may be unavailable (private mode) — non-fatal */
    }
  }, [local])

  const merged = useMemo(() => buildMerged(local), [local])

  // Set one field. Passing the default value (or '') removes the override so the
  // saved file stays minimal and "Reset" truly returns to the baseline.
  const updateAt = useCallback((path, value) => {
    setLocal((prev) => {
      const next = { ...prev }
      const key = Array.isArray(path) ? path.join('.') : path
      const def = getByPath(CONTENT, key)
      if (value === def) delete next[key]
      else next[key] = value
      return next
    })
  }, [])

  const resetAll = useCallback(() => setLocal({}), [])

  const resetPath = useCallback((path) => {
    setLocal((prev) => {
      const next = { ...prev }
      delete next[Array.isArray(path) ? path.join('.') : path]
      return next
    })
  }, [])

  const overridesJson = useCallback(() => JSON.stringify(local, null, 2), [local])

  const dirty = useMemo(
    () => JSON.stringify(local) !== JSON.stringify(savedBaseline),
    [local, savedBaseline],
  )

  // Persist permanently by writing content.overrides.json via the dev endpoint.
  const saveToFile = useCallback(async () => {
    const snapshot = local
    const res = await fetch('/__save-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snapshot, null, 2),
    })
    if (!res.ok) throw new Error(`Save failed (${res.status})`)
    setSavedBaseline({ ...snapshot }) // now clean until the next edit
    return true
  }, [local])

  const editorValue = useMemo(
    () => ({ merged, overrides: local, updateAt, resetAll, resetPath, overridesJson, saveToFile, dirty }),
    [merged, local, updateAt, resetAll, resetPath, overridesJson, saveToFile, dirty],
  )

  return (
    <ContentCtx.Provider value={merged}>
      <EditorCtx.Provider value={editorValue}>{children}</EditorCtx.Provider>
    </ContentCtx.Provider>
  )
}

// Read merged copy in any component: `const c = useContent()` → c.hero.name …
export function useContent() {
  const ctx = useContext(ContentCtx)
  return ctx || CONTENT // fallback so the app still renders if unwrapped
}

// Editor-only controls (mutation + save). Null when no provider is present.
export function useContentEditor() {
  return useContext(EditorCtx)
}
