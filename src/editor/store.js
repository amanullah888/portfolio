// ---------------------------------------------------------------------------
// Persistence + immutable helpers for the overrides object.
// ---------------------------------------------------------------------------
import LAYOUT_DEFAULTS from './layoutDefaults'

const SAVED_KEY = 'tt-portfolio:layout:saved' // persisted by "Save Layout"

export const clone = (o) => JSON.parse(JSON.stringify(o ?? {}))

// Deep-merge b onto a (b wins). Only plain objects are merged; leaves replace.
function merge(a, b) {
  const out = clone(a)
  for (const [k, v] of Object.entries(b || {})) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out[k] = merge(out[k] || {}, v)
    } else {
      out[k] = v
    }
  }
  return out
}

// The layout the site boots with: committed defaults + whatever was last saved.
export function loadInitial() {
  let saved = {}
  try {
    saved = JSON.parse(localStorage.getItem(SAVED_KEY) || '{}')
  } catch {
    saved = {}
  }
  return merge(LAYOUT_DEFAULTS, saved)
}

export function persistSaved(overrides) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(pruneEmpty(overrides)))
    return true
  } catch {
    return false
  }
}

// Read a single property for an id/viewport, or undefined.
export function getValue(overrides, id, viewport, key) {
  return overrides?.[id]?.[viewport]?.[key]
}

// Immutably set one property. Passing value === undefined removes it (and prunes
// any layers/ids left empty), so "reset to default" produces a clean object.
export function setValue(overrides, id, viewport, key, value) {
  const next = clone(overrides)
  next[id] = next[id] || {}
  next[id][viewport] = next[id][viewport] || {}
  if (value === undefined || value === null || value === '') {
    delete next[id][viewport][key]
  } else {
    next[id][viewport][key] = value
  }
  return pruneEmpty(next)
}

// Drop empty viewport layers and empty ids so the serialized object stays tidy.
export function pruneEmpty(overrides) {
  const out = {}
  for (const [id, layers] of Object.entries(overrides || {})) {
    const keptLayers = {}
    for (const [vp, layer] of Object.entries(layers || {})) {
      const keys = Object.keys(layer || {}).filter(
        (k) => layer[k] !== undefined && layer[k] !== null && layer[k] !== '',
      )
      if (keys.length) {
        keptLayers[vp] = Object.fromEntries(keys.map((k) => [k, layer[k]]))
      }
    }
    if (Object.keys(keptLayers).length) out[id] = keptLayers
  }
  return out
}

export function removeId(overrides, id) {
  const next = clone(overrides)
  delete next[id]
  return next
}
