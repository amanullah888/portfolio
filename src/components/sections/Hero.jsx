import { motion } from 'framer-motion'
import Character from '../Character'
import { SpeechBubble, StarBurst } from '../ui'
import Particles from '../Particles'

export default function Hero({ lenis }) {
  const go = (id) => {
    const el = document.getElementById(id)
    if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.6 })
    else el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="panel vignette"
      style={{
        backgroundImage:
          "linear-gradient(100deg, rgba(7,20,45,0.82) 0%, rgba(7,20,45,0.55) 45%, rgba(7,20,45,0.35) 100%), " +
          "linear-gradient(180deg, rgba(7,20,45,0.15) 0%, rgba(7,20,45,0.55) 75%, #071a3d 100%), " +
          "url('/hero/titans-tower.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center 25%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* window bloom — brightens the tower's warm windows so they glow like real lights.
          Reuses the same image + position as the background so it tracks the tower on any viewport. */}
      <div
        className="absolute inset-0 pointer-events-none tower-glow mix-blend-screen"
        style={{
          backgroundImage: "url('/hero/titans-tower.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          backgroundRepeat: 'no-repeat',
          // crush the dark-blue mids to black so the scene stays dark; only the
          // bright warm window pixels survive to glow through the screen blend.
          filter: 'brightness(0.8) contrast(3.6) saturate(1.7) blur(2px)',
        }}
      />

      {/* atmosphere */}
      <div className="absolute inset-0 speed-lines opacity-20 spin-slower" />
      <div className="absolute inset-0 halftone-light opacity-20" />
      <Particles count={26} variant="bolt" className="opacity-70" />

      {/* balanced two-column layout inside one centred container */}
      <div className="panel-scroll">
      <div className="panel-inner relative z-[5] mx-auto w-[min(1200px,92vw)] grid md:grid-cols-[1fr_0.85fr] gap-0 items-center pt-20 md:pt-6">
        {/* ---------- Text ----------
            Name-first on mobile so the headline is the first thing you see and
            never gets pushed below the fold (or clipped) by the character. On
            desktop the grid puts this column on the left as before. */}
        <div className="order-1 md:order-1 pb-4 md:pb-0">
          {/* Robin introduces Aman — the eyebrow reads as Robin speaking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-2 flex-wrap"
          >
            <span className="inline-block ink-border rounded-full bg-tt-pink text-white font-display px-3 py-0.5 -rotate-2"
              style={{ fontSize: 'clamp(0.85rem,1.4vw,1.1rem)' }}>
              🐦 ROBIN
            </span>
            <span className="font-display text-tt-yellow comic-shadow" style={{ fontSize: 'clamp(1.1rem,2.2vw,2rem)' }}>
              HEY, TITANS — THIS IS
            </span>
          </motion.div>

          <motion.h1
            data-editable-id="hero__name"
            data-editable-label="Name — Aman Ullah Kazi"
            initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.4 }}
            className="mega hero-name text-white mt-1"
            style={{ fontSize: 'clamp(2.4rem,10.5vw,7rem)' }}
          >
            AMAN<br />ULLAH<br />KAZI
          </motion.h1>

          <motion.div
            data-editable-id="hero__role"
            data-editable-label="Role badge — Full Stack Developer"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75, type: 'spring', stiffness: 120 }}
            className="mt-4 inline-block ink-border-lg rounded-2xl px-5 py-2.5 bg-tt-yellow -rotate-1"
          >
            <span className="font-display text-tt-ink tracking-wide" style={{ fontSize: 'clamp(1.3rem,3vw,2.4rem)' }}>
              FULL STACK DEVELOPER
            </span>
          </motion.div>

          <motion.p
            data-editable-id="hero__intro"
            data-editable-label="Intro paragraph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05 }}
            className="mt-5 text-white/90 max-w-xl"
            style={{ fontSize: 'clamp(1.05rem,1.5vw,1.4rem)', lineHeight: 1.5 }}
          >
            <span className="text-tt-green font-display">“This guy adapts.”</span>{' '}
            I build awesome stuff that solves real-world problems — from schema design to shipped product.
          </motion.p>

          <motion.div
            data-editable-id="hero__cta"
            data-editable-label="Hero buttons"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25 }}
            className="mt-6 flex flex-wrap gap-4"
          >
            <button onClick={() => go('projects')}
              className="btn-comic bg-tt-yellow text-tt-ink rounded-xl px-7 py-4"
              style={{ fontSize: 'clamp(1.05rem,1.4vw,1.4rem)' }}>
              EXPLORE MY WORK
            </button>
            <button onClick={() => go('hire')}
              className="btn-comic bg-tt-pink text-white rounded-xl px-7 py-4"
              style={{ fontSize: 'clamp(1.05rem,1.4vw,1.4rem)' }}>
              HIRE ME
            </button>
          </motion.div>
        </div>

        {/* ---------- Character column ----------
            Below the name on mobile and capped shorter there so he doesn't eat
            the whole screen; full-height on desktop where he shares the row. */}
        <div className="order-2 md:order-2 relative flex items-end justify-center self-stretch min-h-0">
          {/* Robin + everything that should track him */}
          <div
            className="relative z-10 flex items-end h-[38svh] md:h-[min(74svh,620px)]"
          >
            {/* halo / starburst centred behind Robin — calm fade-in, no unlock pop */}
            <motion.div
              className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 aspect-square pointer-events-none"
              style={{ width: '150%', maxWidth: 620 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <StarBurst color="#ffd21e" size="100%" className="spin-slower w-full h-full opacity-80" />
            </motion.div>

            {/* Robin — capped so he fits the screen instead of overflowing */}
            <motion.div
              data-editable-id="hero__robin"
              data-editable-label="Robin (character)"
              className="relative z-10 h-full drift char-glow flex items-end"
              initial={{ y: '-25%', opacity: 0, rotate: 8, scale: 0.85 }}
              animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 80, damping: 12, delay: 0.7 }}
            >
              <Character id="robin" variant="giant" priority alt="Robin striking a hero pose" className="h-full w-auto" style={{ width: 'auto', height: '100%' }} />
            </motion.div>

            {/* speech bubble — Robin's introduction */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 1.7 }}
              className="absolute -left-24 top-[16%] z-30 hidden lg:block"
            >
              <SpeechBubble tail="right" color="#fff" editId="hero__bubble" label="Robin intro bubble">
                <span className="text-sm md:text-base">Titans… meet our<br />newest member.<br /><b>This guy adapts.</b></span>
              </SpeechBubble>
            </motion.div>
          </div>
        </div>
      </div>
      </div>

      {/* scroll cue */}
      <motion.button
        onClick={() => go('about')}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/90"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
      >
        <span className="font-display tracking-widest text-base">SCROLL DOWN</span>
        <span className="text-3xl">↓</span>
      </motion.button>
    </section>
  )
}
