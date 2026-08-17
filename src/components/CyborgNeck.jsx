import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion'
import Character from './Character'
import { PROCESSED } from '../data/assetManifest'

/*
 * Cyborg's detachable-neck gag for the Journey section.
 *
 * His HEAD is the fixed anchor: it stays pinned near the top of the timeline the
 * whole way down. His BODY rides the scroll DOWNWARD and comes to rest at the
 * very bottom of the timeline, level with the last card. The segmented neck
 * stretches continuously between the two, so by the end of the section it spans
 * the full height of the timeline — the joke being the mission list is so long
 * his body has to walk off to read the end of it while his head keeps watch up
 * top.
 *
 * The two halves come from scripts/build_cyborg_neck.py, which composes them into
 * a *shared* 800x1067 canvas at their assembled rest position and emits
 * cyborg-neck.json describing where the neck belongs (as canvas percentages).
 * Because both images fill the same canvas, stacking them in the same box lines
 * them up exactly: at rest the skull sits inside the collar and the wires are
 * hidden behind the torso, so it reads as one character until you scroll.
 *
 * Motion is monotonic — scrolling down only ever lengthens the neck. The body
 * offset drives BOTH the body translate and the tube height from a single value,
 * so the tube stays welded to both ends (head underside, body collar) every frame.
 *
 * Falls back to the ordinary one-piece Cyborg if the metadata or either split
 * PNG is missing.
 */

export default function CyborgNeck({ sectionRef, stageRef, className = '', style }) {
  const boxRef = useRef(null)
  const [meta, setMeta] = useState(null)

  // Require the geometry AND both split halves before committing to the two-part
  // rig; if anything is missing we fall back to the one-piece character below.
  // Existence of the split art is read from the build-time manifest (no image
  // download) — only the small geometry JSON is fetched.
  useEffect(() => {
    let alive = true
    const haveArt = !!PROCESSED['giant/cyborg-head'] && !!PROCESSED['giant/cyborg-body']
    if (!haveArt) return
    fetch('/characters-processed/giant/cyborg-neck.json')
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((m) => { if (alive) setMeta(m || null) })
    return () => { alive = false }
  }, [])

  // Progress runs 0..1 over exactly the span where the section scrolls through
  // the viewport ('start start' -> 'end end'), so the neck maps 1:1 onto the
  // timeline scroll.
  //
  // We compute it from the section's LIVE bounding rect on every scroll frame
  // rather than framer's useScroll({ target }). That built-in caches the target's
  // document offset and only refreshes it via a ResizeObserver on the target
  // itself — so when the sections ABOVE this one grow after first paint (web
  // fonts, images, lazily-sized panels), the cached offset goes stale and the
  // neck reads as partly stretched before the section has even reached the top
  // (the "pre-stretched on production" bug). Reading getBoundingClientRect().top
  // live is immune to that: it is always the true current position.
  const { scrollY } = useScroll()
  const raw = useTransform(scrollY, () => {
    const section = sectionRef?.current
    if (!section) return 0
    const rect = section.getBoundingClientRect()
    const total = rect.height - window.innerHeight // scrollable span within the section
    if (total <= 0) return 0
    // rect.top > 0 => section still below the viewport top => clamped to 0 (rest).
    return Math.min(1, Math.max(0, -rect.top / total))
  })
  // Critically damped: damping 24 >= 2*sqrt(stiffness*mass) = 2*sqrt(110*0.4) =
  // 13.3, so the spring cannot overshoot past full extension and snap back.
  const p = useSpring(raw, { stiffness: 110, damping: 24, mass: 0.4 })

  // How far the body descends, in px = (stage height - character box height),
  // measured live so the body lands at the bottom of the timeline regardless of
  // how many cards it holds. No hardcoded pixel travel.
  const travel = useMotionValue(0)
  useEffect(() => {
    const stage = stageRef?.current
    const box = boxRef.current
    if (!stage || !box) return
    const measure = () => {
      const t = stage.getBoundingClientRect().height - box.getBoundingClientRect().height
      travel.set(Math.max(0, t))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    ro.observe(box)
    return () => ro.disconnect()
  }, [stageRef, meta, travel])

  // Body offset in px, 0 -> travel. This single value drives the body translate
  // and the tube height, keeping the tube connected to the collar at all times.
  const bodyY = useTransform([p, travel], ([pp, t]) => pp * t)

  // Tube top is fixed at the skull underside (head never moves). Its height is
  // the rest gap (negative at rest — skull tucked into the collar) plus the
  // body's downward offset, so its bottom rides the descending collar exactly.
  // max(0px, ...) hides it entirely at rest, where the gap is negative.
  const restGapPct = meta ? (meta.tubeBottomYPct - meta.tubeTopRestYPct) * 100 : 0
  const tubeHeight = useMotionTemplate`max(0px, calc(${restGapPct}% + ${bodyY}px))`

  if (!meta) {
    return (
      <div ref={boxRef} className={className} style={style}>
        <Character id="cyborg" variant="giant" className="h-full w-auto" style={{ width: 'auto', height: '100%' }} />
      </div>
    )
  }

  return (
    <div
      ref={boxRef}
      className={`relative ${className}`}
      // aspectRatio matches the shared canvas so the head/body layers, sized
      // with inset-0, land in exactly the same place they were composed at.
      style={{ aspectRatio: `${meta.canvas[0]} / ${meta.canvas[1]}`, ...style }}
    >
      {/* segmented neck — behind the head, revealed as the body drops away */}
      <motion.div
        aria-hidden
        className="absolute z-[1] pointer-events-none"
        style={{
          left: `${meta.tubeCenterXPct * 100}%`,
          // Widen the neck past the raw metadata so the stretched tube reads as a
          // solid connected neck (head visibly attached to the body) instead of a
          // thin wire that makes the head look detached.
          width: `${meta.tubeWidthPct * 100 * 1.45}%`,
          top: `${meta.tubeTopRestYPct * 100}%`,
          height: tubeHeight,
          x: '-50%',
          border: '3px solid #000',
          borderRadius: 4,
          background:
            'repeating-linear-gradient(180deg, #c3ced9 0px, #c3ced9 5px, #97a2ae 5px, #97a2ae 11px)',
          boxShadow: 'inset 0 0 0 2px rgba(0,224,255,0.25)',
        }}
      />

      {/* head — the fixed anchor, pinned near the top of the timeline */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <Character id="cyborg-head" variant="giant" alt="Cyborg" />
      </div>

      {/* body — travels down with scroll; drawn last so at rest it hides the tube
          and the head's dangling wires, reading as one seamless character */}
      <motion.div className="absolute inset-0 z-[3] pointer-events-none" style={{ y: bodyY }}>
        <Character id="cyborg-body" variant="giant" />
      </motion.div>
    </div>
  )
}
