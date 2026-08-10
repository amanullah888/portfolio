import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useEditor } from './EditorContext'
import { getValue, setValue } from './store'

const SNAP = 6 // px threshold for alignment snapping
const HANDLES = [
  ['nw', -1, -1], ['n', 0, -1], ['ne', 1, -1],
  ['w', -1, 0], ['e', 1, 0],
  ['sw', -1, 1], ['s', 0, 1], ['se', 1, 1],
]

// Read the element's current translate offset from the overrides store.
function currentOffset(overrides, id, vp) {
  return {
    tx: Number(getValue(overrides, id, vp, 'tx')) || 0,
    ty: Number(getValue(overrides, id, vp, 'ty')) || 0,
  }
}

export default function Overlay() {
  const ed = useEditor()
  const {
    enabled, viewport, selectedId, setSelectedId,
    overrides, beginGesture, setLive, endGesture,
  } = ed

  const [rect, setRect] = useState(null) // selection box (viewport coords)
  const [hoverRect, setHoverRect] = useState(null)
  const [hoverLabel, setHoverLabel] = useState('')
  const [guides, setGuides] = useState([]) // {axis:'x'|'y', pos:number}
  const [badge, setBadge] = useState(null) // {text, x, y}

  const drag = useRef(null) // active drag/resize gesture state
  const overridesRef = useRef(overrides)
  overridesRef.current = overrides

  // Keep the selection box glued to the real element every frame (covers scroll,
  // animation, resize, layout shifts).
  useLayoutEffect(() => {
    if (!enabled || !selectedId) {
      setRect(null)
      return
    }
    let raf
    const measure = () => {
      const el = document.querySelector(`[data-editable-id="${cssq(selectedId)}"]`)
      if (el) {
        const r = el.getBoundingClientRect()
        setRect({ x: r.left, y: r.top, w: r.width, h: r.height })
      } else {
        setRect(null)
      }
    }
    const tick = () => {
      measure()
      raf = requestAnimationFrame(tick)
    }
    measure() // measure synchronously so the box appears on the same frame
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [enabled, selectedId])

  // ---- pointer: selection, drag, resize --------------------------------------
  useEffect(() => {
    if (!enabled) return

    const onDown = (e) => {
      // Resize handles must be checked first — they also carry .tt-ed-ui.
      const handleEl = e.target.closest('[data-ed-handle]')
      if (handleEl && selectedId) {
        e.preventDefault()
        e.stopPropagation()
        startResize(handleEl.dataset.edHandle, e)
        return
      }

      // Let the rest of the editor chrome (toolbar/inspector) work normally.
      if (e.target.closest('.tt-ed-ui')) return

      const el = e.target.closest('[data-editable-id]')
      // In Design Mode we intercept the page's own clicks so buttons/links don't
      // fire while you're arranging things.
      e.preventDefault()
      e.stopPropagation()

      if (!el) {
        setSelectedId(null)
        return
      }
      const id = el.dataset.editableId
      setSelectedId(id)
      startDrag(id, el, e)
    }

    // Capture phase so we win against the site's own handlers.
    document.addEventListener('pointerdown', onDown, true)
    // Swallow the click that follows a pointerdown so links/buttons stay inert.
    const swallow = (e) => {
      if (e.target.closest('.tt-ed-ui')) return
      if (e.target.closest('[data-editable-id]') || drag.current) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    document.addEventListener('click', swallow, true)
    return () => {
      document.removeEventListener('pointerdown', onDown, true)
      document.removeEventListener('click', swallow, true)
    }
  }, [enabled, selectedId, viewport])

  function collectPeers(selId) {
    const peers = []
    document.querySelectorAll('[data-editable-id]').forEach((el) => {
      if (el.dataset.editableId === selId) return
      if (el.querySelector(`[data-editable-id="${cssq(selId)}"]`)) return // ancestor
      const r = el.getBoundingClientRect()
      if (r.width && r.height) peers.push(r)
    })
    return peers
  }

  function startDrag(id, el, e) {
    const startRect = el.getBoundingClientRect()
    const off = currentOffset(overridesRef.current, id, viewport)
    beginGesture()
    drag.current = {
      mode: 'move',
      id,
      pointerId: e.pointerId,
      downX: e.clientX,
      downY: e.clientY,
      startRect,
      startTx: off.tx,
      startTy: off.ty,
      peers: collectPeers(id),
      moved: false,
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  function startResize(handle, e) {
    const el = document.querySelector(`[data-editable-id="${cssq(selectedId)}"]`)
    if (!el) return
    const startRect = el.getBoundingClientRect()
    const off = currentOffset(overridesRef.current, selectedId, viewport)
    const [, dx, dy] = HANDLES.find((h) => h[0] === handle) || ['', 0, 0]
    const w0 = Number(getValue(overridesRef.current, selectedId, viewport, 'width'))
    const h0 = Number(getValue(overridesRef.current, selectedId, viewport, 'height'))
    beginGesture()
    drag.current = {
      mode: 'resize',
      id: selectedId,
      dirX: dx,
      dirY: dy,
      downX: e.clientX,
      downY: e.clientY,
      baseW: Number.isFinite(w0) && w0 ? w0 : startRect.width,
      baseH: Number.isFinite(h0) && h0 ? h0 : startRect.height,
      startTx: off.tx,
      startTy: off.ty,
      moved: false,
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  function onMove(e) {
    const g = drag.current
    if (!g) return
    g.moved = true

    if (g.mode === 'move') {
      let tx = g.startTx + (e.clientX - g.downX)
      let ty = g.startTy + (e.clientY - g.downY)

      // Alignment snapping against peers + viewport centre.
      const shift = e.shiftKey
      const activeGuides = []
      if (!shift) {
        const left = g.startRect.left + (tx - g.startTx)
        const top = g.startRect.top + (ty - g.startTy)
        const cx = left + g.startRect.width / 2
        const cy = top + g.startRect.height / 2
        const right = left + g.startRect.width
        const bottom = top + g.startRect.height

        const xTargets = [window.innerWidth / 2]
        const yTargets = [window.innerHeight / 2]
        g.peers.forEach((p) => {
          xTargets.push(p.left, p.left + p.width / 2, p.right)
          yTargets.push(p.top, p.top + p.height / 2, p.bottom)
        })

        const snapAxis = (edges, targets) => {
          let best = null
          edges.forEach((edge) => {
            targets.forEach((t) => {
              const d = t - edge.v
              if (Math.abs(d) < SNAP && (!best || Math.abs(d) < Math.abs(best.d))) {
                best = { d, pos: t }
              }
            })
          })
          return best
        }
        const sx = snapAxis(
          [{ v: left }, { v: cx }, { v: right }],
          xTargets,
        )
        const sy = snapAxis(
          [{ v: top }, { v: cy }, { v: bottom }],
          yTargets,
        )
        if (sx) { tx += sx.d; activeGuides.push({ axis: 'x', pos: sx.pos }) }
        if (sy) { ty += sy.d; activeGuides.push({ axis: 'y', pos: sy.pos }) }
      }
      setGuides(activeGuides)

      setLive((prev) => {
        let n = setValue(prev, g.id, viewport, 'tx', round(tx))
        n = setValue(n, g.id, viewport, 'ty', round(ty))
        return n
      })
      setBadge({
        text: `x ${round(tx)}  y ${round(ty)}`,
        x: g.startRect.left + (tx - g.startTx),
        y: g.startRect.top + (ty - g.startTy) - 26,
      })
    } else if (g.mode === 'resize') {
      const dxs = e.clientX - g.downX
      const dys = e.clientY - g.downY
      let w = g.baseW
      let h = g.baseH
      let tx = g.startTx
      let ty = g.startTy
      if (g.dirX === 1) w = Math.max(8, g.baseW + dxs)
      if (g.dirX === -1) { w = Math.max(8, g.baseW - dxs); tx = g.startTx + (g.baseW - w) * -1 + dxs }
      if (g.dirY === 1) h = Math.max(8, g.baseH + dys)
      if (g.dirY === -1) { h = Math.max(8, g.baseH - dys); ty = g.startTy + (g.baseH - h) * -1 + dys }

      setLive((prev) => {
        let n = prev
        if (g.dirX) n = setValue(n, g.id, viewport, 'width', round(w))
        if (g.dirY) n = setValue(n, g.id, viewport, 'height', round(h))
        if (g.dirX === -1) n = setValue(n, g.id, viewport, 'tx', round(tx))
        if (g.dirY === -1) n = setValue(n, g.id, viewport, 'ty', round(ty))
        return n
      })
      setBadge({ text: `${round(w)} × ${round(h)}`, x: e.clientX + 12, y: e.clientY - 8 })
    }
  }

  function onUp() {
    const g = drag.current
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    drag.current = null
    setGuides([])
    setBadge(null)
    if (g) endGesture()
  }

  // ---- hover highlight --------------------------------------------------------
  useEffect(() => {
    if (!enabled) return
    const onOver = (e) => {
      if (drag.current) return
      if (e.target.closest('.tt-ed-ui')) { setHoverRect(null); return }
      const el = e.target.closest('[data-editable-id]')
      if (!el || el.dataset.editableId === selectedId) { setHoverRect(null); return }
      const r = el.getBoundingClientRect()
      setHoverRect({ x: r.left, y: r.top, w: r.width, h: r.height })
      setHoverLabel(el.dataset.editableLabel || el.dataset.editableId)
    }
    const onOut = () => setHoverRect(null)
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)
    return () => {
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
    }
  }, [enabled, selectedId])

  // ---- keyboard nudging -------------------------------------------------------
  const kbTimer = useRef(null)
  const kbActive = useRef(false)
  useEffect(() => {
    if (!enabled) return
    const onKey = (e) => {
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (!selectedId) return
      const map = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }
      const dir = map[e.key]
      if (!dir) return
      e.preventDefault()
      const step = e.shiftKey ? 10 : 1
      if (!kbActive.current) { beginGesture(); kbActive.current = true }
      // Accumulate from the *previous* state (not a ref) so a fast key-repeat
      // burst — which React batches into one render — still adds up correctly.
      setLive((prev) => {
        const cur = currentOffset(prev, selectedId, viewport)
        let n = setValue(prev, selectedId, viewport, 'tx', cur.tx + dir[0] * step)
        n = setValue(n, selectedId, viewport, 'ty', cur.ty + dir[1] * step)
        return n
      })
      clearTimeout(kbTimer.current)
      kbTimer.current = setTimeout(() => { endGesture(); kbActive.current = false }, 350)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enabled, selectedId, viewport, beginGesture, setLive, endGesture])

  if (!enabled) return null

  return (
    <div className="tt-ed-overlay" aria-hidden>
      {/* hover highlight */}
      {hoverRect && (
        <div className="tt-ed-hover" style={boxStyle(hoverRect)}>
          <span className="tt-ed-hover-label">{hoverLabel}</span>
        </div>
      )}

      {/* alignment guides */}
      {guides.map((gd, i) =>
        gd.axis === 'x' ? (
          <div key={i} className="tt-ed-guide-v" style={{ left: gd.pos }} />
        ) : (
          <div key={i} className="tt-ed-guide-h" style={{ top: gd.pos }} />
        ),
      )}

      {/* selection box + handles */}
      {rect && (
        <div className="tt-ed-select" style={boxStyle(rect)}>
          {HANDLES.map(([name]) => (
            <span
              key={name}
              className={`tt-ed-handle tt-ed-handle-${name} tt-ed-ui`}
              data-ed-handle={name}
            />
          ))}
        </div>
      )}

      {/* live numeric badge */}
      {badge && (
        <div className="tt-ed-badge" style={{ left: badge.x, top: badge.y }}>
          {badge.text}
        </div>
      )}
    </div>
  )
}

const boxStyle = (r) => ({ left: r.x, top: r.y, width: r.w, height: r.h })
const round = (n) => Math.round(n)
function cssq(s) {
  return String(s).replace(/["\\]/g, '\\$&')
}
