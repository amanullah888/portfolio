import { useRef } from 'react'
import { useEditor } from './EditorContext'
import { PROP_GROUPS } from './props'
import { getValue } from './store'

export default function Inspector() {
  const ed = useEditor()
  const { enabled, selectedId, viewport, overrides } = ed
  if (!enabled) return null

  const el = selectedId
    ? document.querySelector(`[data-editable-id="${cssq(selectedId)}"]`)
    : null
  const label = el?.dataset.editableLabel || selectedId

  return (
    <aside className="tt-ed-inspector tt-ed-ui">
      {!selectedId ? (
        <div className="tt-ed-empty">
          <div className="tt-ed-empty-icon">🎯</div>
          <p><b>Nothing selected.</b></p>
          <p className="tt-ed-muted">Click any element on the page to edit it. Hover to preview what's editable.</p>
        </div>
      ) : (
        <>
          <div className="tt-ed-insp-head">
            <div>
              <div className="tt-ed-insp-title">{label}</div>
              <code className="tt-ed-insp-id">{selectedId}</code>
            </div>
            <button
              className="tt-ed-btn tt-ed-btn-ghost"
              title="Reset this element"
              onClick={() => ed.resetElement()}
            >
              Reset
            </button>
          </div>

          {PROP_GROUPS.map((group) => (
            <div key={group.group} className="tt-ed-group">
              <div className="tt-ed-group-title">{group.group}</div>
              <div className="tt-ed-fields">
                {group.props.map((p) => (
                  <NumberField
                    key={p.key}
                    meta={p}
                    value={getValue(overrides, selectedId, viewport, p.key)}
                    ed={ed}
                  />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </aside>
  )
}

function NumberField({ meta, value, ed }) {
  const scrub = useRef(null)

  const onLabelDown = (e) => {
    e.preventDefault()
    const base = Number(value) || 0
    ed.beginGesture()
    scrub.current = { startX: e.clientX, base }
    const move = (ev) => {
      if (!scrub.current) return
      const dx = ev.clientX - scrub.current.startX
      let v = scrub.current.base + dx * (meta.step < 1 ? meta.step : meta.step)
      v = clampRound(v, meta)
      ed.setProp(meta.key, v, { live: true })
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      scrub.current = null
      ed.endGesture()
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const onInput = (e) => {
    const raw = e.target.value
    if (raw === '') { ed.setProp(meta.key, undefined); return }
    const v = clampRound(parseFloat(raw), meta)
    if (!Number.isNaN(v)) ed.setProp(meta.key, v)
  }

  const step = (delta) => {
    const v = clampRound((Number(value) || 0) + delta * meta.step, meta)
    ed.setProp(meta.key, v)
  }

  return (
    <div className="tt-ed-field">
      <label
        className="tt-ed-field-label"
        onPointerDown={onLabelDown}
        title="Drag to scrub"
      >
        {meta.label}
        {meta.unit ? <span className="tt-ed-unit">{meta.unit}</span> : null}
      </label>
      <div className="tt-ed-field-input">
        <button className="tt-ed-spin" onClick={() => step(-1)} tabIndex={-1}>−</button>
        <input
          type="number"
          inputMode="decimal"
          step={meta.step}
          value={value ?? ''}
          placeholder="auto"
          onChange={onInput}
        />
        <button className="tt-ed-spin" onClick={() => step(1)} tabIndex={-1}>+</button>
      </div>
    </div>
  )
}

function clampRound(v, meta) {
  if (Number.isNaN(v)) return v
  if (meta.min !== undefined) v = Math.max(meta.min, v)
  if (meta.max !== undefined) v = Math.min(meta.max, v)
  // Snap to a sensible precision based on the step.
  const dp = meta.step < 1 ? 2 : 0
  return Number(v.toFixed(dp))
}

function cssq(s) {
  return String(s).replace(/["\\]/g, '\\$&')
}
