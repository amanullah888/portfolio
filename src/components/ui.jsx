import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

/* Scroll-reveal wrapper with a springy cartoon entrance */
export function Reveal({ children, delay = 0, y = 40, className = '', once = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-12% 0px -12% 0px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ type: 'spring', stiffness: 120, damping: 12, delay }}
    >
      {children}
    </motion.div>
  )
}

/* Comic speech bubble with a tail.
 *
 * Pass `editId` to make it selectable in Design Mode. That exposes two editable
 * targets so you can position and shape the bubble independently:
 *   - `<editId>`        the whole bubble  → drag / X / Y / rotate / z-index
 *   - `<editId>__box`   the inner panel   → padding / border-radius / font size
 * (font-size on the box cascades to the text inside, so typography is covered.)
 */
export function SpeechBubble({
  children,
  tail = 'left',
  color = '#fff',
  text = '#0b0b12',
  className = '',
  style,
  editId,
  label,
}) {
  const tailPos = {
    left: { left: 26, bottom: -18, transform: 'skewX(-6deg)' },
    right: { right: 26, bottom: -18, transform: 'skewX(6deg)' },
    'bottom-left': { left: 26, bottom: -18 },
  }
  const wrapAttr = editId
    ? { 'data-editable-id': editId, 'data-editable-label': label || 'Dialogue bubble' }
    : {}
  const boxAttr = editId
    ? { 'data-editable-id': `${editId}__box`, 'data-editable-label': `${label || 'Dialogue'} box` }
    : {}
  return (
    <div className={`relative inline-block ${className}`} style={style} {...wrapAttr}>
      <div
        className="ink-border font-body font-semibold px-4 py-3 rounded-2xl leading-tight"
        style={{ background: color, color: text }}
        {...boxAttr}
      >
        {children}
      </div>
      <div
        className="absolute w-5 h-5 rotate-45"
        style={{ background: color, border: '4px solid #000', borderTop: 'none', borderLeft: 'none', ...tailPos[tail] }}
      />
    </div>
  )
}

/* Big comic impact word (POW! BOOM! WHOOSH!) */
export function ComicBurst({ word = 'POW!', color = '#ffd21e', className = '', style, size = 'clamp(2rem,7vw,5rem)' }) {
  return (
    <motion.div
      className={`font-impact select-none ${className}`}
      style={style}
      initial={{ scale: 0, rotate: -18 }}
      whileInView={{ scale: 1, rotate: -8 }}
      viewport={{ once: false, margin: '-20%' }}
      transition={{ type: 'spring', stiffness: 260, damping: 10 }}
    >
      <span
        className="inline-block text-stroke comic-shadow"
        style={{ color, fontSize: size, lineHeight: 1 }}
      >
        {word}
      </span>
    </motion.div>
  )
}

/* Decorative starburst behind impact text */
export function StarBurst({ color = '#ff3ea5', className = '', size = 240 }) {
  const points = []
  const spikes = 14
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? 50 : 30
    const a = (Math.PI * i) / spikes
    points.push(`${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`)
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <polygon points={points.join(' ')} fill={color} stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  )
}

/* Section label chip like the concept mock ("1. HOMEPAGE — HERO") */
export function PanelTag({ children, color = '#1a8cff' }) {
  return (
    <div
      className="inline-block font-display text-lg md:text-xl px-4 py-1 ink-border rounded-full tracking-wide"
      style={{ background: color, color: '#0b0b12' }}
    >
      {children}
    </div>
  )
}
