import { useMemo } from 'react'

// Lightweight floating particles (CSS-animated). `variant` changes the vibe.
export default function Particles({ count = 18, variant = 'sparkle', className = '' }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 6 + Math.random() * 16,
        delay: Math.random() * 4,
        dur: 3 + Math.random() * 5,
        rot: Math.random() * 360,
      })),
    [count],
  )

  const glyph = { sparkle: '✦', star: '★', bubble: '●', magic: '✧', bolt: '⚡' }[variant] || '✦'
  const color = {
    sparkle: '#ffd21e',
    star: '#ff3ea5',
    bubble: 'rgba(255,255,255,0.5)',
    magic: '#c89bff',
    bolt: '#ffd21e',
  }[variant]

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {bits.map((b) => (
        <span
          key={b.id}
          className="absolute"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            fontSize: b.size,
            color,
            '--r': `${b.rot}deg`,
            animation: `twinkle ${b.dur}s ease-in-out ${b.delay}s infinite, floaty ${b.dur * 1.6}s ease-in-out ${b.delay}s infinite`,
            filter: variant === 'magic' ? 'drop-shadow(0 0 6px #7b2ff7)' : 'none',
          }}
        >
          {glyph}
        </span>
      ))}
    </div>
  )
}
