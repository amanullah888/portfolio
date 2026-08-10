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

const bg = {
  'tt-yellow': '#ffd21e',
  'tt-blue': '#1a8cff',
  'tt-purple': '#7b2ff7',
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
        {POWERS.map((p, i) => (
          <motion.article
            key={p.name}
            className="snap-center shrink-0 w-[80%] sm:w-[52%] lg:w-[38%] xl:w-[31%] relative ink-border rounded-3xl p-6 overflow-hidden"
            style={{ background: bg[p.color] }}
            animate={{
              scale: i === idx ? 1 : 0.94,
              opacity: i === idx ? 1 : 0.72,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            data-hot
          >
            <div className="absolute -right-6 -top-6 opacity-20 text-[8rem] leading-none pointer-events-none">
              {p.icon}
            </div>
            <div className="relative">
              <div className="text-6xl mb-3">{p.icon}</div>
              <div className="font-impact text-3xl md:text-4xl text-stroke-thin" style={{ color: '#0b0b12' }}>
                {p.power}
              </div>
              <div className="font-display text-xl text-tt-ink/80 mt-0.5">{p.name}</div>
              <p className="mt-3 text-tt-ink/85 font-medium leading-snug text-lg">{p.desc}</p>
            </div>
          </motion.article>
        ))}
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
