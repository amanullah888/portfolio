import { motion } from 'framer-motion'
import Character from '../Character'
import { Reveal, PanelTag, SpeechBubble, Lines } from '../ui'
import Particles from '../Particles'
import { useContent } from '../../data/contentStore'

// accent palettes reused for the trait pills and the fact icon tiles
const TRAIT_COLORS = ['#ffd21e', '#4fd84f', '#1a8cff', '#7b2ff7', '#ff3ea5', '#ffffff']
const FACT_COLORS = ['#ff3ea5', '#1a8cff', '#4fd84f', '#ffd21e', '#ff3ea5']

export default function Personality() {
  const { personality } = useContent()
  const words = personality.subtitleWords || []
  return (
    <section id="personality" className="panel overflow-hidden vignette"
      style={{ background: [
        // spotlight glow at the top-centre — fades to transparent so it never
        // touches the panel edges
        'radial-gradient(120% 85% at 50% 16%, rgba(224,84,188,0.5) 0%, rgba(199,61,160,0.22) 40%, rgba(199,61,160,0) 60%)',
        // vertical base: top edge is a flat #c73da0 (matches the SPARKLE divider
        // below it) and the bottom edge is a flat #3d1150 (matches ZAP above Hire)
        'linear-gradient(180deg, #c73da0 0%, #a82d88 22%, #7a2270 54%, #3d1150 100%)',
      ].join(', ') }}>
      <Particles count={26} variant="star" />
      <div className="absolute inset-0 halftone-light opacity-25" />

      {/* giant Starfire anchored to the panel's bottom-left as a decorative
          layer (outside the scroll region so she stays put while the content
          scrolls, if it ever needs to). */}
      <div className="absolute bottom-0 left-[1%] z-[2] pointer-events-none drift char-glow hidden lg:flex items-end"
        style={{ height: 'min(58svh,460px)' }}
        data-editable-id="personality__starfire" data-editable-label="Starfire (character)">
        <Character id="starfire" variant="giant" className="h-full w-auto" style={{ width: 'auto', height: '100%' }} />
      </div>
      {/* Positioned to sit just above Starfire's head so the bubble reads as her
          speaking — not floating disconnected near the top of the panel. */}
      <div className="absolute top-[33%] left-[13%] z-30 hidden lg:block">
        <SpeechBubble tail="left" color="#fff" editId="personality__bubble" label="Starfire bubble">
          <span className="text-sm"><Lines text={personality.bubble} /></span>
        </SpeechBubble>
      </div>

      {/* section tag pinned to the top-right corner, like the reference */}
      <div className="absolute top-6 right-6 z-30 hidden md:block"
        data-editable-id="personality__tag" data-editable-label="Softer side tag">
        <PanelTag color="#ffd21e">{personality.tag}</PanelTag>
      </div>

      <div className="panel-scroll">
      <div className="panel-inner relative z-10 mx-auto w-[min(1320px,92vw)] py-10 md:py-12">
        {/* header — centred over the content column with a soft dark splash so
            the white title pops against the bright gradient. */}
        <div className="mb-8 md:mb-10 lg:ml-auto lg:max-w-[72%] text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-x-8 -inset-y-4 -z-10 rounded-[45%] bg-black/45 blur-2xl" aria-hidden />
            <h2 className="mega text-white" style={{ fontSize: 'clamp(2.6rem,7vw,6rem)' }}>
              {personality.heading}
            </h2>
          </div>
          <p className="mt-4 font-display text-xl md:text-2xl text-white/90 tracking-wide">
            A mix of <span style={{ color: '#4dc3ff' }}>{words[0]}</span>,{' '}
            <span style={{ color: '#ff3ea5' }}>{words[1]}</span>, and{' '}
            <span style={{ color: '#ffd21e' }}>{words[2]}</span>.
          </p>
        </div>

        <div className="lg:ml-auto lg:max-w-[72%] grid lg:grid-cols-[0.9fr_1.15fr] gap-6 lg:gap-8 items-start">
          {/* traits */}
          <Reveal>
            <div className="ink-border-lg rounded-3xl p-6 md:p-7"
              style={{ background: 'rgba(58,18,74,0.72)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
              <div className="inline-block font-display text-lg md:text-xl px-5 py-2 mb-5 ink-border rounded-full"
                style={{ background: '#ff3ea5', color: '#0b0b12' }}>
                {personality.traitsTitle}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {personality.traits.map((t, i) => (
                  <motion.span
                    key={t}
                    whileHover={{ scale: 1.06, rotate: i % 2 ? 2 : -2 }}
                    className="magnetic font-display text-sm md:text-base px-3 py-2.5 rounded-xl ink-border flex items-center gap-2"
                    style={{ background: TRAIT_COLORS[i % TRAIT_COLORS.length], color: '#0b0b12' }}
                    data-hot
                  >
                    <span className="shrink-0">★</span>
                    <span className="leading-tight">{t}</span>
                  </motion.span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* fun facts list */}
          <div className="space-y-3">
            {personality.funFacts.map((f, i) => (
              <Reveal key={f.t} delay={i * 0.06}>
                <motion.div
                  whileHover={{ x: 8 }}
                  className="magnetic flex items-center gap-4 ink-border rounded-2xl p-3 pr-5 bg-white"
                  data-hot
                >
                  <span className="grid place-items-center rounded-xl ink-border shrink-0 text-3xl"
                    style={{ width: 56, height: 56, background: FACT_COLORS[i % FACT_COLORS.length] }}>
                    {f.icon}
                  </span>
                  <span className="font-body font-semibold text-tt-ink text-base md:text-lg leading-snug">{f.t}</span>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
