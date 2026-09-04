import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { useContent } from '../data/contentStore'

export default function Nav({ lenis }) {
  const { nav } = useContent()
  const NAV = nav.links
  const { scrollYProgress } = useScroll()
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  const [active, setActive] = useState('hero')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    NAV.forEach((n) => {
      const el = document.getElementById(n.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  // Close on Escape, and lock page scroll while the menu is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    lenis?.stop()
    return () => {
      window.removeEventListener('keydown', onKey)
      lenis?.start()
    }
  }, [open, lenis])

  const go = (id) => {
    setOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    // The open-effect stops lenis; restart it here so the scroll isn't a no-op
    // (the effect's own cleanup runs after paint, i.e. after this rAF).
    lenis?.start()
    requestAnimationFrame(() => {
      if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 })
      else el.scrollIntoView({ behavior: 'smooth' })
    })
  }

  return (
    <>
      {/* thin scroll progress line across the very top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[4px] origin-left z-[55]"
        style={{
          scaleX: width,
          background: 'linear-gradient(90deg,#1a8cff,#4fd84f,#ffd21e,#ff3ea5,#7b2ff7)',
        }}
      />

      {/* The single menu control: an animated notch tab hanging from the top-center */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center">
        <motion.button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="ink-border rounded-b-2xl bg-tt-ink/95 backdrop-blur px-5 md:px-7 pt-2 pb-2 flex items-center gap-2 hover:bg-tt-ink transition-colors"
          style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.75)' }}
          // Subtle idle bob so the notch reads as interactive; stops when open.
          animate={open ? { y: 0 } : { y: [0, 4, 0] }}
          transition={open ? { duration: 0.2 } : { repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          whileHover={{ y: 2 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="font-display text-tt-yellow tracking-[0.18em] comic-shadow text-sm md:text-base">
            {nav.menuButton}
          </span>
          <motion.span
            className="text-tt-yellow text-lg leading-none"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            ▾
          </motion.span>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* backdrop */}
            <motion.button
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="fixed inset-0 z-[65] bg-black/60 backdrop-blur-sm"
            />

            {/* dropdown panel — drops down from the top-center notch.
                Centering lives on this static wrapper so the inner element can
                own its transform for the drop animation without conflict. */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[70] w-[min(94vw,640px)]">
              <motion.div
                key="menu"
                initial={{ y: -24, opacity: 0, scaleY: 0.6 }}
                animate={{ y: 0, opacity: 1, scaleY: 1 }}
                exit={{ y: -24, opacity: 0, scaleY: 0.6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                className="ink-border-lg rounded-b-3xl px-5 pt-12 pb-6"
                style={{ transformOrigin: 'top center', background: 'linear-gradient(180deg,#0b0b12,#12122b)' }}
              >
                <div className="flex items-center justify-between px-1 pb-3">
                  <span className="font-display text-tt-yellow text-2xl comic-shadow">{nav.menuTitle}</span>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="text-white/70 hover:text-tt-yellow text-3xl leading-none px-2"
                  >
                    ✕
                  </button>
                </div>

                <nav className="grid grid-cols-2 gap-2.5">
                  {NAV.map((n, i) => (
                    <motion.button
                      key={n.id}
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + i * 0.04 }}
                      onClick={() => go(n.id)}
                      className="font-display text-left rounded-xl px-4 py-3 text-lg md:text-xl transition-colors"
                      style={{
                        background: active === n.id ? '#ffd21e' : 'rgba(255,255,255,0.06)',
                        color: active === n.id ? '#0b0b12' : '#fff',
                      }}
                    >
                      {n.label}
                    </motion.button>
                  ))}
                </nav>

                <button
                  onClick={() => go('hire')}
                  className="btn-comic w-full bg-tt-pink text-white rounded-xl px-5 py-3 text-lg mt-4"
                >
                  {nav.hireCta}
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
