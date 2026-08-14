import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { POWERS } from '../data/content'

/*
 * The powers as a swipeable card deck instead of a static grid.
 *
 * Built on native CSS scroll-snap so touch swiping is handled by the browser
 * (smooth, momentum-correct, no JS per frame). On desktop, pointer drag and
 * the arrow buttons/keys drive the same scroller, so every input lands in the
 * same place. Dots show position and jump to a card.
 */

const accent = {
  'tt-yellow': '#ffd21e',
  'tt-blue': '#1a8cff',
  'tt-purple': '#a35bff',
  'tt-green': '#4fd84f',
  'tt-pink': '#ff3ea5',
}

export default function PowersCarousel() {
  const trackRef = useRef(null)
  const [idx, setIdx] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const sync = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const cards = Array.from(el.children)
    if (!cards.length) return
    const center = el.scrollLeft + el.clientWidth / 2
    let best = 0
    let bestDist = Infinity
    cards.forEach((c, i) => {
      const cc = c.offsetLeft + c.offsetWidth / 2
      const d = Math.abs(cc - center)
      if (d < bestDist) { bestDist = d; best = i }
    })
    setIdx(best)
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    sync()
    el.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      el.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [sync])

  const goTo = (i) => {
    const el = trackRef.current
    if (!el) return
    const card = el.children[Math.max(0, Math.min(POWERS.length - 1, i))]
    if (card) {
      el.scrollTo({
        left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2,
        behavior: 'smooth',
      })
    }
  }

  // Pointer drag for mouse users (touch is handled natively by scroll-snap).
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let down = false
    let startX = 0
    let startScroll = 0
    let moved = false

    const onDown = (e) => {
      if (e.pointerType === 'touch') return
      down = true
      moved = false
      startX = e.clientX
      startScroll = el.scrollLeft
      el.setPointerCapture?.(e.pointerId)
      el.style.scrollSnapType = 'none'
      el.style.cursor = 'grabbing'
    }
    const onMove = (e) => {
      if (!down) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 4) moved = true
      el.scrollLeft = startScroll - dx
    }
    const onUp = (e) => {
      if (!down) return
      down = false
      el.releasePointerCapture?.(e.pointerId)
      el.style.cursor = ''
      el.style.scrollSnapType = ''
      if (moved) {
        // settle onto the nearest card
        const cards = Array.from(el.children)
        const center = el.scrollLeft + el.clientWidth / 2
        let best = 0
        let bestDist = Infinity
        cards.forEach((c, i) => {
          const cc = c.offsetLeft + c.offsetWidth / 2
          const d = Math.abs(cc - center)
          if (d < bestDist) { bestDist = d; best = i }
        })
        goTo(best)
      }
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="My superpowers"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(idx + 1) }
        if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(idx - 1) }
      }}
      tabIndex={0}
    >
      {/* hint */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-white/60 text-sm tracking-wide">
          ← SWIPE / DRAG TO SEE ALL {POWERS.length} POWERS →
        </span>
        <div className="hidden sm:flex gap-2">
          <ArrowBtn dir="prev" onClick={() => goTo(idx - 1)} disabled={!canPrev} />
          <ArrowBtn dir="next" onClick={() => goTo(idx + 1)} disabled={!canNext} />
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 cursor-grab select-none"
        style={{ scrollBehavior: 'auto', overscrollBehaviorX: 'contain' }}
      >
        {POWERS.map((p, i) => {
          const c = accent[p.color]
          return (
            <motion.article
              key={p.name}
              className="snap-center shrink-0 w-[78%] sm:w-[46%] lg:w-[31%] xl:w-[24%] relative rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(160deg, ${c}1f 0%, rgba(11,11,18,0.96) 55%)`,
                border: `2px solid ${c}`,
                boxShadow: `0 0 0 4px #000, 8px 8px 0 rgba(0,0,0,0.85), 0 0 26px ${c}40`,
              }}
              animate={{
                scale: i === idx ? 1 : 0.92,
                opacity: i === idx ? 1 : 0.6,
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              data-hot
            >
              {/* faint oversized glyph in the corner */}
              <div className="absolute -right-4 -top-4 opacity-10 text-[6rem] leading-none pointer-events-none">
                {p.icon}
              </div>

              <div className="relative p-5">
                {/* category badge */}
                <span
                  className="inline-block font-display text-[0.7rem] tracking-widest uppercase px-2.5 py-1 rounded-md text-tt-ink"
                  style={{ background: c, boxShadow: '2px 2px 0 rgba(0,0,0,0.85)' }}
                >
                  {p.badge}
                </span>

                {/* icon */}
                <div className="text-4xl mt-4 mb-2">{p.icon}</div>

                {/* power name */}
                <h3
                  className="font-impact text-2xl md:text-[1.65rem] leading-tight text-stroke-thin"
                  style={{ color: c }}
                >
                  {p.power}
                </h3>

                {/* description */}
                <p className="mt-2 text-white/75 font-medium leading-snug text-[0.95rem]">
                  {p.desc}
                </p>

                {/* tag pills */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags?.map((t) => (
                    <span
                      key={t}
                      className="font-body text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        color: c,
                        border: `1.5px solid ${c}66`,
                        background: `${c}14`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>

      {/* dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {POWERS.map((p, i) => (
          <button
            key={p.name}
            onClick={() => goTo(i)}
            aria-label={`Go to ${p.power}`}
            aria-current={i === idx}
            className="rounded-full border-2 border-black transition-all"
            style={{
              width: i === idx ? 30 : 12,
              height: 12,
              background: i === idx ? '#ffd21e' : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function ArrowBtn({ dir, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous power' : 'Next power'}
      className="ink-border rounded-full w-10 h-10 flex items-center justify-center font-display text-xl transition-opacity"
      style={{
        background: disabled ? 'rgba(255,255,255,0.12)' : '#ffd21e',
        color: disabled ? 'rgba(255,255,255,0.4)' : '#0b0b12',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {dir === 'prev' ? '‹' : '›'}
    </button>
  )
}
