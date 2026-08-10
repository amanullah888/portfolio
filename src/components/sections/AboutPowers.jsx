import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Character from '../Character'
import PowersCarousel from '../PowersCarousel'
import { Reveal, SpeechBubble, PanelTag } from '../ui'
import Particles from '../Particles'
import { ABOUT, PROFILE } from '../../data/content'

/*
 * "About me" and "My superpowers" merged into a single opening section, so the
 * site introduces who Aman is and what he can do in one continuous beat rather
 * than splitting them across two screens with a scene divider in between.
 *
 * Robin is sticky in his own column and swaps pose partway through: serious
 * arms-crossed for the dossier half, the pointing hero pose for the powers half.
 */

const noteColors = ['#ffd21e', '#4fd84f', '#ff8fce', '#7ec8ff', '#c9a7ff']
const rot = [-3, 2, -1.5, 3, -2]

export default function AboutPowers() {
  const sectionRef = useRef(null)
  // Which sticky on THE BOARD is being hovered — drives the pop-out + blur.
  const [hoveredNote, setHoveredNote] = useState(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Crossfade the two Robin poses around the midpoint of the section.
  const seriousOpacity = useTransform(scrollYProgress, [0.38, 0.5], [1, 0])
  const heroOpacity = useTransform(scrollYProgress, [0.38, 0.5], [0, 1])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative pt-5 pb-6 md:pt-7 md:pb-8 overflow-hidden vignette"
      style={{ background: 'linear-gradient(180deg,#3a0d16 0%,#180208 38%,#0a1f4d 68%,#0b1230 100%)' }}
    >
      <div className="absolute inset-0 grid-lines opacity-40" />
      <Particles count={14} variant="bolt" />

      {/* No `items-start`: columns must stretch to the row height or the sticky
          Robin has no range to stick over.
          minmax(0,…) tracks are REQUIRED — a bare `1.2fr 0.8fr` lets the wide
          left column's min-content size blow past its share and squeeze the
          Robin column to zero width (he vanishes and only his clipped speech
          bubble shows). minmax(0,…) forces the tracks to honour the ratio. */}
      <div className="relative z-10 mx-auto w-[min(1320px,92vw)] grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-8 lg:gap-12">

        {/* Blur backdrop while a sticky is popped out. Lives INSIDE this
            container (not the section) at z-20 so it sits above the normal
            content but below the hovered note, which is lifted to z-40. */}
        <AnimatePresence>
          {hoveredNote !== null && (
            <motion.div
              key="board-blur"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 z-20 bg-black/40 backdrop-blur-md pointer-events-none rounded-3xl"
            />
          )}
        </AnimatePresence>

        {/* ---------------- Content column ---------------- */}
        <div>
          {/* ===== ABOUT ===== */}
          <div className="mb-6">
            <PanelTag color="#ff3ea5">CLASSIFIED — MISSION BRIEFING</PanelTag>
            <h2 className="mt-4 mega text-white" style={{ fontSize: 'clamp(3rem,8vw,6.5rem)' }}>
              ABOUT ME
            </h2>
          </div>

          <div className="grid md:grid-cols-[0.88fr_1.12fr] gap-6 items-start">
            <Reveal>
              <div className="ink-border-lg rounded-3xl p-7 bg-[#2a0810] halftone">
                <div className="font-display text-tt-yellow text-2xl mb-2">// DOSSIER</div>
                <p className="text-white/90 text-lg leading-relaxed">{ABOUT.intro}</p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Fact k="Name" v={PROFILE.name} />
                  <Fact k="Class" v="Full Stack Dev" />
                  <Fact k="Base" v={PROFILE.location} />
                  <Fact k="Fuel" v="Coffee ☕ + Cartoons" />
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
                  className="mt-6 inline-block font-impact text-tt-green text-stroke-thin text-xl -rotate-2"
                >
                  ✓ ACHIEVEMENT UNLOCKED: Reliable Teammate
                </motion.div>
              </div>
            </Reveal>

            {/* When a note is hovered the whole board is lifted above the blur
                backdrop (z-20) so it stays crisp while the rest of the section
                blurs behind it — the hovered note then pops out over its
                neighbours. Elevating the panel (rather than the deeply-nested
                note) sidesteps the Reveal wrapper's transform stacking context. */}
            <div className="relative rounded-3xl ink-border-lg p-6 bg-[#3d2a17] transition-shadow"
              style={{
                backgroundImage: 'radial-gradient(rgba(0,0,0,0.15) 1px, transparent 1px)',
                backgroundSize: '10px 10px',
                zIndex: hoveredNote !== null ? 30 : undefined,
              }}>
              <div className="font-display text-white/80 text-xl mb-4">THE BOARD
                <span className="text-white/40 text-sm font-body ml-2">(hover a note)</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {ABOUT.stickies.map((s, i) => {
                  const active = hoveredNote === i
                  // Pop-out is driven by state + a CSS transform (not framer's
                  // whileHover, which proved flaky nested inside Reveal) so it
                  // stays perfectly in sync with the blur backdrop.
                  return (
                    <Reveal key={s.t} delay={i * 0.06} className="w-[calc(50%-0.375rem)]">
                      <div
                        onMouseEnter={() => setHoveredNote(i)}
                        onMouseLeave={() => setHoveredNote(null)}
                        onFocus={() => setHoveredNote(i)}
                        onBlur={() => setHoveredNote(null)}
                        tabIndex={0}
                        className="magnetic p-3 rounded-md relative cursor-pointer outline-none"
                        style={{
                          background: noteColors[i % noteColors.length],
                          transformOrigin: 'center',
                          transform: active
                            ? 'rotate(0deg) scale(1.55) translateY(-6px)'
                            : `rotate(${rot[i % rot.length]}deg)`,
                          transition: 'transform .28s cubic-bezier(.34,1.56,.64,1), box-shadow .28s ease',
                          zIndex: active ? 40 : 1,
                          boxShadow: active
                            ? '12px 16px 0 rgba(0,0,0,0.55)'
                            : '4px 6px 0 rgba(0,0,0,0.35)',
                        }}
                        data-hot
                      >
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-600 border-2 border-black" />
                        <div className="font-display text-tt-ink text-lg">{s.t}</div>
                        <p className="text-tt-ink/85 text-sm font-medium mt-1 leading-snug">{s.v}</p>
                      </div>
                    </Reveal>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Robin column (sticky) ---------------- */}
        <div className="hidden lg:block">
          <div className="sticky top-[9vh] h-[82svh] flex items-end justify-center">
            <div className="relative h-full w-full flex items-end justify-center"
              data-editable-id="about__robin" data-editable-label="Robin (About)">
              {/* two poses stacked, crossfaded on scroll */}
              <motion.div
                className="absolute inset-0 flex items-end justify-center drift char-glow"
                style={{ opacity: seriousOpacity }}
              >
                <Character id="robin-serious" variant="giant" className="h-full w-auto"
                  style={{ width: 'auto', height: '100%' }} />
              </motion.div>
              <motion.div
                className="absolute inset-0 flex items-end justify-center drift char-glow"
                style={{ opacity: heroOpacity }}
              >
                <Character id="robin" variant="giant" className="h-full w-auto"
                  style={{ width: 'auto', height: '100%' }} />
              </motion.div>

              <div className="absolute top-[4%] left-0 z-30">
                <SpeechBubble tail="left" color="#fff" editId="about__bubble" label="Robin About bubble">
                  <span className="text-sm">Okay. Time for<br />some <b>serious</b> stuff.</span>
                </SpeechBubble>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== POWERS (full-bleed) ===== */}
      {/* Pulled OUT of the two-column grid above so the carousel spans the whole
          container instead of being crammed into the 1.2fr text column — that
          left the wide right half (Robin's column) empty during the powers scroll. */}
      <div className="relative z-10 mx-auto w-[min(1320px,92vw)] mt-12">
        <div className="mb-6">
          <PanelTag color="#ffd21e">EVERY TITAN HAS A POWER…</PanelTag>
          <h2 className="mt-4 mega text-white" style={{ fontSize: 'clamp(3rem,8vw,6.5rem)' }}>
            MY SUPERPOWERS
          </h2>
          <p className="mt-4 text-white/85 max-w-lg" style={{ fontSize: 'clamp(1.1rem,1.5vw,1.4rem)' }}>
            Not "skills." <b>Powers.</b> Here's what the new Titan brings to the fight.
          </p>
        </div>

        <PowersCarousel />
      </div>
    </section>
  )
}

function Fact({ k, v }) {
  return (
    <div className="ink-border rounded-xl px-3 py-2 bg-tt-ink/40">
      <div className="font-display text-tt-pink text-xs tracking-wider">{k}</div>
      <div className="text-white font-semibold text-sm">{v}</div>
    </div>
  )
}
