import { motion } from 'framer-motion'
import Character from '../Character'
import { Reveal, PanelTag, SpeechBubble } from '../ui'
import { PROJECTS } from '../../data/content'

export default function Projects() {
  return (
    <section id="projects" className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#160a2e,#2a0a52 55%,#1a0740)' }}>
      <div className="absolute inset-0 halftone-light opacity-30" />

      <div className="relative z-10 mx-auto w-[min(1320px,92vw)]">
        <div className="text-center mb-16">
          <PanelTag color="#7b2ff7">THE TEAM SHOWS OFF</PanelTag>
          <h2 className="mt-4 mega text-white" style={{ fontSize: 'clamp(3.2rem,9vw,7rem)' }}>
            MY PROJECTS
          </h2>
          <p className="mt-4 text-white/85" style={{ fontSize: 'clamp(1.1rem,1.5vw,1.4rem)' }}>Each Titan grabbed one to brag about. Hover to open the case file.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <motion.article
                whileHover="open"
                initial="closed"
                className="magnetic group relative rounded-3xl ink-border-lg overflow-hidden h-full flex flex-col"
                style={{ background: '#120726' }}
                data-hot
              >
                {/* header with emoji + guide */}
                <div className="relative h-52 flex items-center justify-center overflow-hidden"
                  style={{ background: `radial-gradient(circle at 50% 20%, ${p.accent}, #0b0620)` }}>
                  <div className="absolute inset-0 halftone opacity-20" />
                  <motion.div
                    variants={{ closed: { scale: 1, rotate: 0 }, open: { scale: 1.15, rotate: -6 } }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    className="text-8xl drop-shadow-xl"
                  >
                    {p.emoji}
                  </motion.div>
                  <div className="absolute -bottom-3 right-2 h-32 w-auto opacity-95 group-hover:-translate-y-1.5 transition-transform">
                    <Character id={p.guide} variant="badge" className="h-full w-auto" style={{ width: 'auto', height: '100%' }} />
                  </div>
                  <motion.div
                    variants={{ closed: { opacity: 0, y: 8 }, open: { opacity: 1, y: 0 } }}
                    className="absolute top-3 left-3"
                  >
                    <SpeechBubble tail="left" color="#ffd21e" editId={`projects__bubble__${i}`} label={`${p.name} bubble`}><span className="text-xs">Check this out!</span></SpeechBubble>
                  </motion.div>
                </div>

                {/* body */}
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="font-display text-4xl" style={{ color: p.accent }}>{p.name}</h3>
                  <div className="font-display text-white/70 text-lg">{p.tagline}</div>
                  <p className="mt-3 text-white/80 leading-snug flex-1">{p.desc}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span key={s} className="text-xs font-display px-2.5 py-1 rounded-full ink-border"
                        style={{ background: '#1c0f38', color: '#fff', border: '2px solid #000' }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  <a href={p.link} target={p.link !== '#' ? '_blank' : undefined} rel="noreferrer"
                    className="mt-6 btn-comic inline-block rounded-xl px-5 py-3 font-display text-xl w-full text-center"
                    style={{ background: p.accent, color: '#0b0b12' }}>
                    VIEW PROJECT →
                  </a>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
