import { useState } from 'react'
import { useEditor } from './EditorContext'
import { VIEWPORTS } from './props'

export default function Toolbar() {
  const ed = useEditor()
  const { enabled, viewport, liveViewport, dirty } = ed
  const [flash, setFlash] = useState('')

  const note = (msg) => {
    setFlash(msg)
    setTimeout(() => setFlash(''), 1600)
  }

  const onSave = () => {
    ed.save()
    note('Layout saved ✓')
  }

  const onExport = async () => {
    const json = ed.exportJson()
    try {
      await navigator.clipboard.writeText(json)
      note('JSON copied to clipboard')
    } catch {
      // Fallback: drop it in the console so it's still retrievable.
      // eslint-disable-next-line no-console
      console.log('[Visual Editor] layout overrides:\n' + json)
      note('JSON logged to console')
    }
  }

  return (
    <>
      {/* Always-present floating toggle */}
      <button
        className={`tt-ed-toggle tt-ed-ui ${enabled ? 'is-on' : ''}`}
        onClick={() => ed.setEnabled(!enabled)}
        title="Toggle Design Mode"
      >
        <span className="tt-ed-toggle-dot" />
        {enabled ? 'Exit Design Mode' : 'Design Mode'}
      </button>

      {enabled && (
        <div className="tt-ed-toolbar tt-ed-ui">
          <div className="tt-ed-tb-group">
            {VIEWPORTS.map((v) => (
              <button
                key={v.id}
                className={`tt-ed-vp ${viewport === v.id ? 'is-active' : ''}`}
                onClick={() => ed.setViewport(v.id)}
                title={`Edit ${v.label} layer`}
              >
                <span className="tt-ed-vp-icon">{v.icon}</span>
                {v.label}
                {liveViewport === v.id && <span className="tt-ed-live-dot" title="Matches current window width" />}
              </button>
            ))}
          </div>

          <div className="tt-ed-tb-sep" />

          <div className="tt-ed-tb-group">
            <button className="tt-ed-btn" disabled={!ed.canUndo} onClick={ed.undo} title="Undo (Ctrl+Z)">↶ Undo</button>
            <button className="tt-ed-btn" disabled={!ed.canRedo} onClick={ed.redo} title="Redo (Ctrl+Y)">Redo ↷</button>
          </div>

          <div className="tt-ed-tb-sep" />

          <div className="tt-ed-tb-group">
            <button className="tt-ed-btn" onClick={ed.resetAll} title="Reset every element">Reset All</button>
            <button className="tt-ed-btn" onClick={onExport} title="Copy overrides JSON to commit into code">Export</button>
            <button className={`tt-ed-btn tt-ed-btn-primary ${dirty ? 'is-dirty' : ''}`} onClick={onSave}>
              {dirty ? 'Save Layout •' : 'Saved'}
            </button>
          </div>

          {flash && <div className="tt-ed-flash">{flash}</div>}
          {viewport !== liveViewport && (
            <div className="tt-ed-hint">
              Editing <b>{viewport}</b> layer — resize the window to ~{ranges[viewport]} to preview it live.
            </div>
          )}
        </div>
      )}
    </>
  )
}

const ranges = { desktop: '≥1024px', tablet: '768–1023px', mobile: '≤767px' }
