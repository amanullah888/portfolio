import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Character from '../Character'
import { PanelTag } from '../ui'
import Particles from '../Particles'
import { PROFILE } from '../../data/content'

export default function Hire() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-25%' })

  const contacts = [
    { icon: '✉️', label: PROFILE.email, href: `mailto:${PROFILE.email}`, cta: 'Email' },
    { icon: '📞', label: PROFILE.phone, href: `tel:${PROFILE.phone.replace(/\s/g, '')}`, cta: 'Call' },
    { icon: '💼', label: 'LinkedIn', href: PROFILE.linkedin, cta: 'Connect' },
    { icon: '🐙', label: 'GitHub', href: PROFILE.github, cta: 'Follow' },
  ]

  return (
    <section
      id="hire"
      ref={ref}
      data-magic
      className="panel"
      style={{ background: [
        // soft magic glow around the centre where Raven / the circle sit
        'radial-gradient(85% 80% at 50% 42%, rgba(96,26,150,0.6) 0%, rgba(24,2,48,0) 62%)',
        // vertical base: top edge is a flat #3a0a6b so it merges seamlessly with
        // the ZAP divider above it; bottom fades to near-black for the footer
        'linear-gradient(180deg, #3a0a6b 0%, #1a0533 34%, #0a0320 68%, #05010f 100%)',
      ].join(', ') }}
    >
      <Particles count={30} variant="magic" />
      <div className="absolute inset-0 halftone opacity-10" />

      {/* giant magic circle */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0, rotate: -60 }}
        animate={inView ? { scale: 1, opacity: 0.5, rotate: 0 } : {}}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <MagicCircle />
      </motion.div>

      <div className="panel-scroll">
      <div className="panel-inner relative z-10 mx-auto w-[min(1000px,92vw)] text-center py-6 md:py-8">
        <PanelTag color="#7b2ff7">RAVEN'S CHAMBER — LET'S CONNECT</PanelTag>

        <motion.div
          initial={{ y: -30, opacity: 0, scale: 0.85 }}
          animate={inView ? { y: 0, opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 80, damping: 12, delay: 0.2 }}
          className="mt-6 flex justify-center"
        >
          <div className="h-[24vh] md:h-[27vh] drift char-glow" data-zoom="0.12"
            data-editable-id="hire__raven" data-editable-label="Raven (character)">
            <Character id="raven" variant="giant" className="h-full w-auto" style={{ width: 'auto', height: '100%' }} />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-4 font-display text-2xl md:text-3xl text-tt-purple/90"
          style={{ color: '#c89bff' }}
        >
          "Your decision has already been made…"
        </motion.p>

        {/* Spell-revealed headline */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.6, filter: 'blur(12px)' }}
          animate={inView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
          transition={{ delay: 0.9, type: 'spring', stiffness: 90, damping: 12 }}
          className="mt-4 font-display text-white text-stroke comic-shadow leading-none"
          style={{ fontSize: 'clamp(2.6rem,9vw,6rem)', textShadow: '0 0 30px rgba(123,47,247,0.9)' }}
        >
          YOU WANT TO<br />HIRE AMAN.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.3 }}
          className="mt-4 text-white/80 text-lg"
        >
          The spell is cast. Resistance is futile. (Also I'm genuinely a great hire.) — 📍 {PROFILE.location}
        </motion.p>

        {/* Buttons materialize */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, type: 'spring', stiffness: 110 }}
          className="mt-6 flex flex-wrap justify-center gap-4"
        >
          <a href={`mailto:${PROFILE.email}`} className="magnetic btn-comic rounded-2xl px-7 py-4 text-2xl bg-tt-pink text-white">
            HIRE ME
          </a>
          <a href={`mailto:${PROFILE.email}`} className="magnetic btn-comic rounded-2xl px-7 py-4 text-2xl bg-tt-yellow text-tt-ink">
            LET'S TALK
          </a>
          <a href={PROFILE.resumeUrl} target="_blank" rel="noreferrer" className="magnetic btn-comic rounded-2xl px-7 py-4 text-2xl bg-tt-green text-tt-ink">
            📄 RESUME
          </a>
        </motion.div>

        {/* Contact grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.8 }}
          className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto"
        >
          {contacts.map((c) => (
            <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
              className="magnetic ink-border rounded-2xl p-4 bg-white/10 backdrop-blur hover:bg-white/20 transition flex flex-col items-center gap-1"
              data-hot>
              <span className="text-3xl">{c.icon}</span>
              <span className="font-display text-tt-yellow text-sm">{c.cta}</span>
              <span className="text-white/80 text-xs break-all">{c.label}</span>
            </a>
          ))}
        </motion.div>
      </div>
      </div>
    </section>
  )
}

function MagicCircle() {
  return (
    <svg width="min(120vw,900px)" height="min(120vw,900px)" viewBox="0 0 400 400" aria-hidden className="spin-slower">
      <g fill="none" stroke="#a86bff" strokeWidth="1.5" opacity="0.9">
        <circle cx="200" cy="200" r="190" />
        <circle cx="200" cy="200" r="150" strokeDasharray="6 10" />
        <circle cx="200" cy="200" r="120" />
        <circle cx="200" cy="200" r="80" strokeDasharray="2 8" />
      </g>
      <g stroke="#d9b3ff" strokeWidth="1" opacity="0.7">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (Math.PI * 2 * i) / 12
          return <line key={i} x1={200 + 80 * Math.cos(a)} y1={200 + 80 * Math.sin(a)}
            x2={200 + 190 * Math.cos(a)} y2={200 + 190 * Math.sin(a)} />
        })}
      </g>
      {/* pentagram-ish star */}
      <polygon points="200,60 243,300 40,150 360,150 157,300"
        fill="none" stroke="#c89bff" strokeWidth="1.5" opacity="0.6" />
    </svg>
  )
}
