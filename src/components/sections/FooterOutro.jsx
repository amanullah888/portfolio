import { motion } from 'framer-motion'
import Character from '../Character'
import { useContent } from '../../data/contentStore'

const charIds = ['robin', 'beastboy', 'cyborg', 'starfire', 'raven']

export default function FooterOutro({ lenis }) {
  const { footer, profile, nav } = useContent()
  const outro = footer.outro || []
  const top = () => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))
  const go = (id) => {
    const el = document.getElementById(id)
    if (lenis) lenis.scrollTo(el, { offset: -10, duration: 1.4 })
    else el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="relative pt-24 pb-10 overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#05010f,#0b0b12)' }}>
      <div className="absolute inset-0 grid-lines opacity-30" />

      <div className="relative z-10 mx-auto w-[min(1150px,92vw)]">
        <div className="text-center mb-10">
          <span className="font-impact text-stroke comic-shadow text-tt-yellow"
            style={{ fontSize: 'clamp(2rem,6vw,4rem)' }}>{footer.missionComplete}</span>
        </div>

        {/* the team waving with sign-off bubbles */}
        <div className="flex flex-wrap justify-center items-end gap-6 md:gap-10">
          {charIds.map((id, i) => (
            <motion.div
              key={id}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 140, damping: 11 }}
              className="flex flex-col items-center gap-2 w-32 md:w-44"
            >
              <div className="ink-border rounded-xl px-2 py-1 text-center bg-white text-tt-ink text-xs font-body font-semibold"
                style={{ borderColor: '#000' }}>
                "{outro[i]?.line}"
              </div>
              <div className="wobble h-40 md:h-52 flex items-end" style={{ animationDelay: `${i * 0.2}s` }}>
                <Character id={id} variant="footer" className="h-full w-auto" style={{ width: 'auto', height: '100%' }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* credits roll */}
        <div className="mt-14 text-center">
          <div className="font-display text-3xl md:text-4xl text-white text-stroke-thin">{profile.name.toUpperCase()}</div>
          <div className="font-display text-tt-pink text-xl mt-1">{footer.credit}</div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {nav.links.map((n) => (
              <button key={n.id} onClick={() => go(n.id)}
                className="magnetic font-display text-sm text-white/70 hover:text-tt-yellow px-3 py-1">
                {n.label}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-white/70 text-sm">
            {/* keep the email intact — never break it mid-word; it wraps to its
                own line instead if the row is too narrow. */}
            <a className="magnetic hover:text-tt-yellow whitespace-nowrap" href={`mailto:${profile.email}`}>{profile.email}</a>
            <span aria-hidden="true">•</span>
            <a className="magnetic hover:text-tt-yellow" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            <span>•</span>
            <a className="magnetic hover:text-tt-yellow" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>

          <p className="mt-6 text-white/40 text-xs">© {new Date().getFullYear()} {profile.name}. {footer.copyright}</p>
        </div>

        <div className="mt-8 flex justify-center">
          <button onClick={top} className="magnetic btn-comic rounded-full w-14 h-14 bg-tt-yellow text-tt-ink text-2xl flex items-center justify-center">
            ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
