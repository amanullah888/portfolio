import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

import Nav from './components/Nav'
import Hero from './components/sections/Hero'
import AboutPowers from './components/sections/AboutPowers'
import Shift from './components/sections/Shift'
import Experience from './components/sections/Experience'
import Projects from './components/sections/Projects'
import Personality from './components/sections/Personality'
import Hire from './components/sections/Hire'
import FooterOutro from './components/sections/FooterOutro'
import Character from './components/Character'
import VisualEditor from './editor/VisualEditor'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [lenis, setLenis] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // lerp is the smoothing factor: lower = smoother/floatier, higher = snappier.
    // Lenis defaults to 0.1; ~0.06-0.08 is the sweet spot for a site like this.
    // Lenis also honours prefers-reduced-motion on its own (forces lerp to 1).
    const l = new Lenis({
      lerp: 0.075,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
      smoothWheel: true,
      // Native touch scrolling is already smooth and momentum-correct; syncing
      // it through JS makes phones feel laggy.
      syncTouch: false,
    })
    setLenis(l)

    l.on('scroll', ScrollTrigger.update)
    const raf = (time) => l.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      l.destroy()
    }
  }, [])

  // GSAP scroll effects synced to Lenis:
  //  [data-parallax]  -> vertical parallax drift
  //  [data-zoom]      -> cinematic "camera push-in": scales up + fades in as
  //                      the element travels through the viewport
  useEffect(() => {
    if (!lenis) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.2
        gsap.to(el, {
          yPercent: -speed * 100,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })

      gsap.utils.toArray('[data-zoom]').forEach((el) => {
        const amt = parseFloat(el.dataset.zoom) || 0.18 // extra scale at centre
        gsap.fromTo(
          el,
          { scale: 1 - amt * 0.6, filter: 'brightness(0.8)' },
          {
            scale: 1 + amt,
            filter: 'brightness(1.05)',
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'center center', scrub: true },
          },
        )
      })
    })
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [lenis, loaded])

  // Full-screen panels keep their overflowing content in an inner `.panel-scroll`
  // region. Lenis drives page smooth-scroll by hijacking the wheel, so it must
  // step aside for that inner scroll — but ONLY while the panel actually
  // overflows, otherwise the wheel would get trapped over a panel that has
  // nothing to scroll. We flag overflowing regions with `data-lenis-prevent`
  // (Lenis's own opt-out) and keep it in sync as the viewport / content changes.
  // Native overscroll at the region's top/bottom edge still chains to the page,
  // so scrolling never dead-ends. Touch is native already (syncTouch: false).
  useEffect(() => {
    const regions = Array.from(document.querySelectorAll('.panel-scroll'))
    if (!regions.length) return
    const sync = () => {
      regions.forEach((el) => {
        const overflowing = el.scrollHeight > el.clientHeight + 1
        el.toggleAttribute('data-lenis-prevent', overflowing)
      })
    }
    sync()
    const ro = new ResizeObserver(sync)
    regions.forEach((el) => {
      ro.observe(el)
      if (el.firstElementChild) ro.observe(el.firstElementChild)
    })
    window.addEventListener('resize', sync)
    document.fonts?.ready.then(sync)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', sync)
    }
  }, [lenis, loaded])

  return (
    <>
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}

      <Nav lenis={lenis} />

      <main className={loaded ? '' : 'pointer-events-none'}>
        <Hero lenis={lenis} />
        <Divider word="WHOOSH!" color="#ffd21e" from="#071a3d" to="#3a0d16" />
        <AboutPowers />
        <Shift />
        <Divider word="BOOT UP!" color="#00e0ff" from="#0b3d1f" to="#062b3a" />
        <Experience />
        <Divider word="BAM!" color="#7b2ff7" from="#041018" to="#160a2e" />
        <Projects />
        <Divider word="SPARKLE!" color="#ffd21e" from="#1a0740" to="#c73da0" />
        <Personality />
        <Divider word="ZAP!" color="#c89bff" from="#3d1150" to="#3a0a6b" />
        <Hire />
        <FooterOutro lenis={lenis} />
      </main>

      {/* Design Mode — visual layout editor. Renders nothing until toggled on;
          the real site is completely unaffected while it's off. */}
      <VisualEditor lenis={lenis} />
    </>
  )
}

/* Comic scene divider — a smooth colour bridge with a flying impact word.
   `from` = colour of the section above, `to` = colour of the section below, so
   the band fades one into the other instead of showing a hard seam. */
function Divider({ word, color, from, to }) {
  return (
    <div
      className="relative h-16 md:h-24 -my-px"
      style={{ background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)` }}
    >
      <motion.div
        initial={{ x: '-30%', rotate: -12, opacity: 0 }}
        whileInView={{ x: '0%', rotate: -6, opacity: 1 }}
        viewport={{ once: false, margin: '-10%' }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="absolute inset-0 flex items-center justify-center"
        data-parallax="0.15"
      >
        <span className="font-impact text-stroke comic-shadow select-none"
          style={{ color, fontSize: 'clamp(1.4rem,4vw,2.6rem)' }}>{word}</span>
      </motion.div>
    </div>
  )
}

/* Titans Tower boot-up preloader */
function Preloader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const done = useRef(false)

  useEffect(() => {
    let raf
    const start = performance.now()
    const finish = () => {
      if (done.current) return
      done.current = true
      setPct(100)
      setLeaving(true) // CSS-only fade/slide (best effort; never blocks unmount)
      setTimeout(onDone, 450) // guaranteed unmount, independent of any animation
    }
    const tick = (t) => {
      const p = Math.min(100, ((t - start) / 1800) * 100)
      setPct(Math.floor(p))
      if (p < 100) raf = requestAnimationFrame(tick)
      else finish()
    }
    raf = requestAnimationFrame(tick)
    // Hard fallback: rAF is paused in background/hidden tabs, so guarantee the
    // site becomes interactive regardless of visibility or frame rate.
    const hard = setTimeout(finish, 2400)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(hard)
    }
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(circle at 50% 40%, #1a8cff, #071a3d 70%)',
        transition: 'transform .5s cubic-bezier(.76,0,.24,1), opacity .5s ease',
        transform: leaving ? 'translateY(-100%)' : 'none',
        opacity: leaving ? 0 : 1,
      }}
    >
      <div className="speed-lines absolute inset-0 opacity-30 spin-slower" />
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, -3, 3, 0] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
        className="w-32 h-40 relative z-10"
      >
        <Character id="robin" variant="boot" className="w-full h-full" />
      </motion.div>
      <div className="relative z-10 mt-4 font-display text-tt-yellow text-3xl comic-shadow">ASSEMBLING THE TITANS…</div>
      <div className="relative z-10 mt-4 w-64 h-4 ink-border rounded-full overflow-hidden bg-black/40">
        <div className="h-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#ffd21e,#ff3ea5,#4fd84f)' }} />
      </div>
      <div className="relative z-10 mt-2 font-display text-white/80">{pct}%</div>
    </div>
  )
}
