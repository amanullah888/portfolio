import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Character from '../Character'
import { PanelTag, Lines } from '../ui'
import Particles from '../Particles'
import { useContent } from '../../data/contentStore'

// Fetch a file and trigger a real "Save As" download (not just a tab open).
// Throws if the file isn't there so the caller can fall back. Note: SPA hosts
// (and `vite preview`) answer a missing /foo.pdf with index.html at status 200,
// so we also reject an HTML response — otherwise we'd "download" the app shell
// renamed as a PDF.
async function triggerDownload(url, filename) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const type = res.headers.get('content-type') || ''
  if (/text\/html/i.test(type)) throw new Error('not a real file (SPA fallback)')
  const blob = await res.blob()
  const href = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = href
  a.download = filename || 'CV.pdf'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(href)
}

export default function Hire() {
  const { hire, profile } = useContent()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-25%' })

  const resumes = profile.resumes || []
  // The default CV behind the big button — the "full-stack" variant if defined,
  // else the generic resume.
  const defaultCV =
    resumes.find((r) => r.id === 'fullstack') ||
    { file: profile.resumeUrl, download: profile.resumeName || 'CV.pdf' }

  // Download the CV for a role. If the role-specific file is missing, fall back
  // to the general CV so the action always yields a real download — never a dead
  // route. Adding the tailored PDF to /public later makes it "just work".
  const downloadCV = async (item) => {
    const primary = item?.file || profile.resumeUrl
    const name = item?.download || profile.resumeName || 'CV.pdf'
    try {
      await triggerDownload(primary, name)
      return
    } catch {
      /* role-specific file not present yet — fall through */
    }
    try {
      if (primary !== profile.resumeUrl) {
        await triggerDownload(profile.resumeUrl, profile.resumeName || 'CV.pdf')
        return
      }
    } catch {
      /* general CV also unreachable — last resort below */
    }
    window.open(profile.resumeUrl, '_blank', 'noopener')
  }

  const contacts = [
    { icon: '✉️', label: profile.email, href: `mailto:${profile.email}`, cta: hire.contacts.emailCta },
    { icon: '📞', label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}`, cta: hire.contacts.phoneCta },
    { icon: '💼', label: 'LinkedIn', href: profile.linkedin, cta: hire.contacts.linkedinCta },
    { icon: '🐙', label: 'GitHub', href: profile.github, cta: hire.contacts.githubCta },
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
        <PanelTag color="#7b2ff7">{hire.tag}</PanelTag>

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
          "{hire.quote}"
        </motion.p>

        {/* Spell-revealed headline */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.6, filter: 'blur(12px)' }}
          animate={inView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
          transition={{ delay: 0.9, type: 'spring', stiffness: 90, damping: 12 }}
          className="mt-4 font-display text-white text-stroke comic-shadow leading-none"
          style={{ fontSize: 'clamp(2.6rem,9vw,6rem)', textShadow: '0 0 30px rgba(123,47,247,0.9)' }}
        >
          <Lines text={hire.headline} />
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.3 }}
          className="mt-4 text-white/80 text-lg"
        >
          {hire.pitch} — 📍 {profile.location}
        </motion.p>

        {/* Buttons materialize */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, type: 'spring', stiffness: 110 }}
          className="mt-6 flex flex-wrap justify-center gap-4"
        >
          <a href={`mailto:${profile.email}`} className="magnetic btn-comic rounded-2xl px-7 py-4 text-2xl bg-tt-pink text-white">
            {hire.ctaPrimary}
          </a>
          <a href={`mailto:${profile.email}`} className="magnetic btn-comic rounded-2xl px-7 py-4 text-2xl bg-tt-yellow text-tt-ink">
            {hire.ctaSecondary}
          </a>
          <button
            type="button"
            onClick={() => downloadCV(defaultCV)}
            className="magnetic btn-comic rounded-2xl px-7 py-4 text-2xl bg-tt-green text-tt-ink"
          >
            {hire.resumeLabel}
          </button>
        </motion.div>

        {/* Role-specific CVs — pick the variant that matches the role you're
            hiring for and it downloads immediately. */}
        {resumes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.65 }}
            className="mt-5 flex flex-col items-center gap-2.5"
          >
            <p className="text-white/70 text-sm md:text-base font-display tracking-wide">
              {hire.cvPickTitle}
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {resumes.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => downloadCV(r)}
                  className="magnetic ink-border rounded-full px-4 py-2 text-sm font-display text-white bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5"
                  data-hot
                >
                  <span aria-hidden="true">⬇</span> {r.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

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
