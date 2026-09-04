import { useMemo, useState } from 'react'
import { useContentEditor } from '../data/contentStore'
import './contentEditor.css'

// Keys that are visual/config, not copy — hidden from the text editor.
const SKIP_KEYS = new Set(['id', 'guide', 'color', 'accent'])

// Friendly section names for the top-level content groups.
const GROUP_LABELS = {
  profile: 'Profile & contact',
  preloader: 'Loading screen',
  nav: 'Menu',
  dividers: 'Scene dividers',
  hero: 'Hero (top of page)',
  about: 'About',
  skills: 'Skills',
  experience: 'Journey / experience',
  projects: 'Projects',
  personality: 'Fun facts',
  hire: 'Hire me',
  footer: 'Footer',
}
const GROUP_ORDER = Object.keys(GROUP_LABELS)

// Walk a content subtree into a flat list of editable {path, value} leaves.
function collectFields(node, path, out) {
  if (typeof node === 'string' || typeof node === 'number') {
    out.push({ path, value: node, kind: typeof node })
    return
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => collectFields(v, `${path}.${i}`, out))
    return
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (SKIP_KEYS.has(k)) continue
      collectFields(v, path ? `${path}.${k}` : k, out)
    }
  }
}

// "projects.items.2.desc" → "items › #3 › desc" (drop the leading group key).
function labelFor(path, group) {
  const rest = path.startsWith(group + '.') ? path.slice(group.length + 1) : path
  return rest
    .split('.')
    .map((seg) => (/^\d+$/.test(seg) ? `#${Number(seg) + 1}` : seg))
    .join(' › ')
}

export default function ContentEditor() {
  const ed = useContentEditor()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [flash, setFlash] = useState('')
  const [saving, setSaving] = useState(false)

  const groups = useMemo(() => {
    if (!ed) return []
    const keys = [
      ...GROUP_ORDER.filter((k) => k in ed.merged),
      ...Object.keys(ed.merged).filter((k) => !GROUP_ORDER.includes(k)),
    ]
    return keys.map((g) => {
      const fields = []
      collectFields(ed.merged[g], g, fields)
      return { key: g, label: GROUP_LABELS[g] || g, fields }
    })
  }, [ed])

  if (!ed) return null

  const note = (m) => {
    setFlash(m)
    setTimeout(() => setFlash(''), 2200)
  }

  const query = q.trim().toLowerCase()
  const match = (f) =>
    !query ||
    f.path.toLowerCase().includes(query) ||
    String(f.value).toLowerCase().includes(query)

  const onSave = async () => {
    setSaving(true)
    try {
      await ed.saveToFile()
      note('Saved permanently ✓  (content.overrides.json)')
    } catch (e) {
      note('Save failed — is the dev server running? ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const onExport = async () => {
    const json = ed.overridesJson()
    try {
      await navigator.clipboard.writeText(json)
      note('Overrides JSON copied to clipboard')
    } catch {
      console.log('[Content Mode] overrides:\n' + json)
      note('Overrides JSON logged to console')
    }
  }

  return (
    <>
      <button
        className={`tt-ce-toggle ${open ? 'is-on' : ''}`}
        onClick={() => setOpen((o) => !o)}
        title="Edit all the text on the site"
      >
        ✏️ {open ? 'Close Content' : 'Content Mode'}
      </button>

      {open && (
        <aside className="tt-ce-panel" role="dialog" aria-label="Content editor">
          <header className="tt-ce-head">
            <div className="tt-ce-title">
              ✏️ Content Mode
              {ed.dirty && <span className="tt-ce-dot" title="Unsaved changes" />}
            </div>
            <button className="tt-ce-x" onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </header>

          <div className="tt-ce-search">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search text… (e.g. hire, tagline, superpowers)"
              spellCheck={false}
            />
            {q && <button className="tt-ce-clear" onClick={() => setQ('')} aria-label="Clear">✕</button>}
          </div>

          <div className="tt-ce-actions">
            <button className={`tt-ce-btn tt-ce-primary ${ed.dirty ? 'is-dirty' : ''}`} onClick={onSave} disabled={saving || !ed.dirty}>
              {saving ? 'Saving…' : ed.dirty ? 'Save permanently •' : 'Saved'}
            </button>
            <button className="tt-ce-btn" onClick={onExport} title="Copy the overrides JSON">Export</button>
            <button
              className="tt-ce-btn tt-ce-danger"
              onClick={() => { if (confirm('Reset ALL text back to the defaults? (You can Save afterwards to make it permanent.)')) ed.resetAll() }}
              title="Discard every edit and return to the original copy"
            >
              Reset all
            </button>
          </div>

          {flash && <div className="tt-ce-flash">{flash}</div>}

          <div className="tt-ce-scroll">
            {groups.map((g) => {
              const visible = g.fields.filter(match)
              if (!visible.length) return null
              return (
                <section key={g.key} className="tt-ce-group">
                  <h3 className="tt-ce-group-title">{g.label}</h3>
                  {visible.map((f) => (
                    <Field key={f.path} field={f} ed={ed} group={g.key} />
                  ))}
                </section>
              )
            })}
          </div>
        </aside>
      )}
    </>
  )
}

function Field({ field, ed, group }) {
  const { path, value, kind } = field
  const overridden = Object.prototype.hasOwnProperty.call(ed.overrides, path)
  const long = kind === 'string' && (value.length > 42 || value.includes('\n'))

  const onChange = (raw) => {
    ed.updateAt(path, kind === 'number' ? Number(raw) : raw)
  }

  return (
    <label className={`tt-ce-field ${overridden ? 'is-edited' : ''}`}>
      <span className="tt-ce-label">
        {labelFor(path, group)}
        {overridden && (
          <button
            type="button"
            className="tt-ce-reset"
            title="Reset this field to its default"
            onClick={(e) => { e.preventDefault(); ed.resetPath(path) }}
          >
            ↺
          </button>
        )}
      </span>
      {kind === 'number' ? (
        <input className="tt-ce-input" type="number" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : long ? (
        <textarea className="tt-ce-input tt-ce-area" value={value} rows={Math.min(8, value.split('\n').length + 1)} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="tt-ce-input" type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  )
}
