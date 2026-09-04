import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import CyborgNeck from '../CyborgNeck'
import { SpeechBubble, PanelTag, Lines } from '../ui'
import { useContent } from '../../data/contentStore'

export default function Experience() {
  const { experience } = useContent()
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  // NOTE: no `overflow-hidden` on the <section> itself — that would make it the
  // scroll container for the Cyborg column's `position: sticky`, so the head
  // would scroll away with the section instead of pinning to the viewport. The
  // decorative backgrounds are clipped by their own inset-0 wrapper instead,
  // leaving the sticky head free to stick against the window.
  return (
    <section id="experience" ref={sectionRef} className="relative py-14 md:py-20"
      style={{ background: 'radial-gradient(120% 90% at 50% 0%, #062b3a, #041018 70%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 grid-lines opacity-50" />
        <div className="absolute inset-0"
          style={{ background: 'repeating-linear-gradient(0deg, rgba(0,224,255,0.04) 0 2px, transparent 2px 5px)' }} />
      </div>

      {/* Two real columns: Cyborg's head sticks to the viewport while you scroll
          the timeline, so the neck actually extends on screen. */}
      {/* Columns must stretch to the row height (no `items-start` on the grid) or
          the sticky Cyborg has no range to stick over. */}
      <div className="relative z-10 mx-auto w-[min(1280px,92vw)] grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-10">

        <div className="order-2 lg:order-1">
        <div className="mb-12">
          <PanelTag color="#00e0ff">{experience.tag}</PanelTag>
          <h2 className="mt-4 mega text-white" style={{ fontSize: 'clamp(3rem,8vw,6.5rem)' }}>
            {experience.heading}
          </h2>
          <p className="mt-2 font-mono text-cyan-300/80 text-base flicker">{experience.terminalLine}</p>
        </div>

        <div className="relative pl-6 md:pl-10">
          {/* spine */}
          <div className="absolute left-2 md:left-4 top-2 bottom-2 w-1.5 rounded-full"
            style={{ background: 'linear-gradient(#00e0ff,#7b2ff7)' }} />
          <div className="space-y-8">
            {experience.items.map((e, i) => (
              <LogCard key={`${e.year}-${e.title}-${i}`} e={e} i={i} labels={experience} />
            ))}
          </div>
        </div>
        </div>

        {/* ---- Cyborg column (sticky, pinned near the top of the section) ----
             The head is anchored at the TOP of this stage and stays pinned near
             the top of the viewport for the whole scroll; the body descends from
             it to the stage bottom (level with the last card) as you scroll, so
             the neck stretches to span the timeline. The stage's own pixel height
             is what the neck component measures to size that descent. `items-start`
             keeps the head at the top; the stage is tall (90svh) so the body has
             the full timeline to travel down without being clipped. */}
        <div className="hidden lg:block order-1 lg:order-2">
          {/* Stage height sets how far the body descends (= stretch length). Kept
              moderate so the neck reads as an attached, stretchy neck rather than a
              floating head far from the body; the box % is bumped to match so the
              character stays the same size. */}
          <div ref={stageRef} className="sticky top-[6vh] h-[73svh] flex items-start justify-center">
            <div className="relative h-full w-full flex items-start justify-center">
              <CyborgNeck
                sectionRef={sectionRef}
                stageRef={stageRef}
                className="char-glow"
                style={{ height: '47%' }}
              />
              <div className="absolute top-[4%] right-0 z-30">
                <SpeechBubble tail="right" color="#00e0ff" editId="experience__bubble" label="Cyborg bubble">
                  <span className="text-sm"><Lines text={experience.bubble} /></span>
                </SpeechBubble>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LogCard({ e, i, labels }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })

  return (
    <div ref={ref} className="relative">
      <div className="absolute -left-[1.15rem] md:-left-[1.6rem] top-6 w-6 h-6 rounded-full ink-border bg-cyan-400 flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-tt-ink" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -30, rotateY: -12 }}
        animate={inView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
        transition={{ type: 'spring', stiffness: 90, damping: 13, delay: i * 0.05 }}
        className="ink-border rounded-2xl p-5 md:p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(0,224,255,0.12), rgba(123,47,247,0.12))',
          boxShadow: '0 0 22px rgba(0,224,255,0.15), 8px 8px 0 rgba(0,0,0,0.85)',
          backdropFilter: 'blur(2px)',
        }}
      >
        {/* corner brackets */}
        <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-300/70" />
        <span className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-300/70" />
        <span className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-300/70" />
        <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-300/70" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-display text-3xl text-cyan-300">{e.year}</div>
            <div className="font-display text-xl md:text-2xl text-white">{e.title}</div>
            <div className="font-mono text-xs text-cyan-200/70">{e.org}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-mono text-[10px] text-cyan-200/70">{labels.powerLevelLabel}</div>
            <div className="font-display text-2xl text-tt-yellow">{e.xp}%</div>
          </div>
        </div>

        <p className="mt-3 text-white/85">{e.log}</p>

        {/* install bar */}
        <div className="mt-4">
          <div className="font-mono text-[11px] text-cyan-200/80 mb-1">
            {inView ? labels.statusDone : labels.statusInstalling}
          </div>
          <div className="h-3 rounded-full bg-black/50 ink-border overflow-hidden" style={{ boxShadow: 'none', border: '2px solid #000' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${e.xp}%` } : {}}
              transition={{ duration: 1.2, delay: 0.2 + i * 0.05, ease: 'easeOut' }}
              className="h-full"
              style={{ background: 'linear-gradient(90deg,#00e0ff,#4fd84f,#ffd21e)' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
