// ---------------------------------------------------------------------------
// Property schema + CSS-override engine for the Visual Editor.
//
// The editor never mutates component source at runtime. Instead every editable
// element carries a stable `data-editable-id`, and all visual tweaks are stored
// as a plain data object:
//
//   overrides = {
//     "hero__bubble": {
//        desktop: { tx: 20, ty: -40, rotate: -3 },
//        tablet:  { ... },
//        mobile:  { ... },
//     },
//     ...
//   }
//
// From that object we generate a single <style> sheet (see buildCss). This keeps
// positioning values centralized instead of scattered through the JSX/CSS, and
// makes the whole thing serialisable (localStorage today, a committed JSON file
// tomorrow).
//
// Movement + rotation use the *individual* CSS transform properties
// (`translate` / `rotate`) rather than `transform`. Those compose ON TOP of any
// existing `transform` — which is exactly what framer-motion and the CSS
// keyframe animations (.drift/.floaty/…) write to — so entrance animations and
// idle float loops keep working while our offset is layered in. That is the key
// trick that lets us edit the *real* animated elements non-destructively.
// ---------------------------------------------------------------------------

export const VIEWPORTS = [
  { id: 'desktop', label: 'Desktop', icon: '🖥️', min: 1024, max: Infinity },
  { id: 'tablet', label: 'Tablet', icon: '📱', min: 768, max: 1023 },
  { id: 'mobile', label: 'Mobile', icon: '📲', min: 0, max: 767 },
]

// Which viewport layer matches an actual window width (used to tell the user
// whether the layer they're editing is the one currently live on screen).
export function viewportForWidth(w) {
  if (w >= 1024) return 'desktop'
  if (w >= 768) return 'tablet'
  return 'mobile'
}

// Every editable property. `css` is how it renders; `unit` drives the inspector.
// `kind: 'pair'` props (tx/ty) are merged into one declaration by buildDecls.
export const PROP_GROUPS = [
  {
    group: 'Position',
    props: [
      { key: 'tx', label: 'X', unit: 'px', step: 1, kind: 'translate' },
      { key: 'ty', label: 'Y', unit: 'px', step: 1, kind: 'translate' },
      { key: 'top', label: 'Top', unit: 'px', step: 1, css: 'top' },
      { key: 'left', label: 'Left', unit: 'px', step: 1, css: 'left' },
    ],
  },
  {
    group: 'Size',
    props: [
      { key: 'width', label: 'Width', unit: 'px', step: 1, min: 4, css: 'width' },
      { key: 'height', label: 'Height', unit: 'px', step: 1, min: 4, css: 'height' },
    ],
  },
  {
    group: 'Spacing',
    props: [
      { key: 'margin', label: 'Margin', unit: 'px', step: 1, css: 'margin' },
      { key: 'padding', label: 'Padding', unit: 'px', step: 1, min: 0, css: 'padding' },
      { key: 'gap', label: 'Gap', unit: 'px', step: 1, min: 0, css: 'gap' },
    ],
  },
  {
    group: 'Typography',
    props: [
      { key: 'fontSize', label: 'Font size', unit: 'px', step: 0.5, min: 1, css: 'font-size' },
      { key: 'lineHeight', label: 'Line height', unit: '', step: 0.05, min: 0.5, css: 'line-height' },
      { key: 'letterSpacing', label: 'Letter spacing', unit: 'px', step: 0.1, css: 'letter-spacing' },
    ],
  },
  {
    group: 'Appearance',
    props: [
      { key: 'borderRadius', label: 'Border radius', unit: 'px', step: 1, min: 0, css: 'border-radius' },
      { key: 'opacity', label: 'Opacity', unit: '', step: 0.05, min: 0, max: 1, css: 'opacity' },
      { key: 'rotate', label: 'Rotation', unit: '°', step: 1, kind: 'rotate' },
      { key: 'zIndex', label: 'Z-index', unit: '', step: 1, css: 'z-index' },
    ],
  },
]

// Flat lookup: key -> prop meta.
export const PROP_META = Object.fromEntries(
  PROP_GROUPS.flatMap((g) => g.props.map((p) => [p.key, { ...p, group: g.group }])),
)

// Turn one layer object ({tx, padding, ...}) into an array of CSS declarations.
function buildDecls(layer) {
  const d = []
  const has = (k) => layer[k] !== undefined && layer[k] !== null && layer[k] !== ''

  if (has('tx') || has('ty')) {
    const x = Number(layer.tx) || 0
    const y = Number(layer.ty) || 0
    d.push(`translate:${x}px ${y}px`)
  }
  if (has('rotate')) d.push(`rotate:${Number(layer.rotate)}deg`)

  for (const key of Object.keys(layer)) {
    const meta = PROP_META[key]
    if (!meta || !meta.css) continue
    if (!has(key)) continue
    const v = layer[key]
    const unit = meta.unit === 'px' ? 'px' : ''
    d.push(`${meta.css}:${v}${unit}`)
  }
  return d
}

// Build the full stylesheet text from the overrides object.
//
//  - Each layer's rules are wrapped in the matching @media query, so the LIVE
//    site stays genuinely responsive (desktop tweaks never leak onto mobile).
//  - When the editor is enabled we ALSO emit a higher-specificity mirror scoped
//    by `html[data-editor-vp="…"]`, so the layer you're editing is shown live
//    regardless of the actual window width (lets you tune the mobile layer on a
//    desktop screen). That mirror only exists while the editor is on.
export function buildCss(overrides, { activeViewport = null } = {}) {
  const chunks = []

  for (const vp of VIEWPORTS) {
    const rules = []
    for (const [id, layers] of Object.entries(overrides || {})) {
      const layer = layers?.[vp.id]
      if (!layer) continue
      const decls = buildDecls(layer)
      if (!decls.length) continue
      const body = decls.map((x) => `  ${x} !important;`).join('\n')
      rules.push(`[data-editable-id="${cssEscape(id)}"]{\n${body}\n}`)
    }
    if (!rules.length) continue

    const query =
      vp.max === Infinity
        ? `@media (min-width:${vp.min}px)`
        : vp.min === 0
        ? `@media (max-width:${vp.max}px)`
        : `@media (min-width:${vp.min}px) and (max-width:${vp.max}px)`

    chunks.push(`${query}{\n${rules.join('\n')}\n}`)

    // Editor-only preview mirror (higher specificity, no media query).
    if (activeViewport === vp.id) {
      const mirror = rules
        .map((r) => `html[data-editor-vp="${vp.id}"] ${r}`)
        .join('\n')
      chunks.push(mirror)
    }
  }

  return chunks.join('\n\n')
}

function cssEscape(s) {
  return String(s).replace(/["\\]/g, '\\$&')
}
