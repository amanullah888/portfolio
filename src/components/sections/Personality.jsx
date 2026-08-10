import { motion } from 'framer-motion'
import Character from '../Character'
import { Reveal, PanelTag, SpeechBubble } from '../ui'
import Particles from '../Particles'
import { PERSONALITY } from '../../data/content'

export default function Personality() {
  return (
    <section id="personality" className="relative screen py-14 md:py-20 overflow-hidden vignette grid"
      style={{ background: 'radial-gradient(120% 100% at 70% 0%, #ff5fb0, #b3126e 45%, #4d0a3f 100%)' }}>
      <Particles count={26} variant="star" />
      <div className="absolute inset-0 halftone-light opacity-30" />

      {/* giant Starfire anchored left — shares the content's grid cell so her
          bottom edge tracks the content's actual bottom (see Powers.jsx). */}
      <div className="z-[2] pointer-events-none drift char-glow hidden lg:flex items-end justify-self-start self-end ml-[1%]"
        style={{ height: 'min(58svh,460px)', gridRow: 1, gridColumn: 1 }}
        data-editable-id="personality__starfire" data-editable-label="Starfire (character)">
        <Character id="starfire" variant="giant" className="h-full w-auto" style={{ width: 'auto', height: '100%' }} />
      </div>
      <div className="absolute top-[15%] left-[16%] z-30 hidden lg:block">
        <SpeechBubble tail="left" color="#fff" editId="personality__bubble" label="Starfire bubble">
          <span className="text-sm">Ooh! Please,<br />enjoy the <b>fun facts!</b></span>
        </SpeechBubble>
      </div>

      <div className="relative z-10 mx-auto w-[min(1320px,92vw)] self-start" style={{ gridRow: 1, gridColumn: 1 }}>
        <div className="mb-12 lg:ml-auto lg:max-w-[70%] lg:text-right">
          <PanelTag color="#ffd21e">THE SOFTER SIDE</PanelTag>
          <h2 className="mt-4 mega text-white" style={{ fontSize: 'clamp(3rem,8vw,6.5rem)' }}>
            FUN FACTS ABOUT ME
          </h2>
        </div>

        <div className="lg:ml-auto lg:max-w-[70%] grid lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
          {/* traits */}
          <Reveal>
            <div className="ink-border-lg rounded-3xl p-7 bg-white/10 backdrop-blur">
              <div className="font-display text-tt-yellow text-2xl mb-4">WHAT I BRING TO THE TEAM</div>
              <div className="flex flex-wrap gap-3">
                {PERSONALITY.traits.map((t, i) => (
                  <motion.span
                    key={t}
                    whileHover={{ scale: 1.1, rotate: i % 2 ? 3 : -3 }}
                    className="magnetic font-display text-lg px-4 py-2 rounded-full ink-border"
                    style={{ background: ['#ffd21e', '#4fd84f', '#1a8cff', '#7b2ff7', '#ff3ea5', '#fff'][i % 6], color: '#0b0b12' }}
                    data-hot
                  >
                    ★ {t}
                  </motion.span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* fun facts list */}
          <div className="space-y-3">
            {PERSONALITY.funFacts.map((f, i) => (
              <Reveal key={f.t} delay={i * 0.07}>
                <motion.div
                  whileHover={{ x: 8 }}
                  className="magnetic flex items-center gap-4 ink-border rounded-2xl p-4 bg-white/95"
                  data-hot
                >
                  <span className="text-4xl">{f.icon}</span>
                  <span className="font-body font-semibold text-tt-ink text-lg">{f.t}</span>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
