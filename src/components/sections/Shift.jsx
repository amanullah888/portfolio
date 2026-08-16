import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SpeechBubble, PanelTag } from '../ui'
import { SKILL_CREW, FORMS } from '../../data/content'

// How many skill tiles fit in the fixed-size block before the rest become
// swipeable. 6 = a tidy 3×2 grid on desktop; bump/lower to taste.
const PAGE_SIZE = 6

/*
 * "MY SKILLS" — a character-based skill explorer.
 *
 * Each of Beast Boy's shape-shift forms (the crew) stands for a skill category.
 * Pick a character on the left → the grid on the right morphs to that
 * character's real skills. Everything is driven from SKILL_CREW in
 * data/content.js, so swapping a character, category, art or skill list is a
 * one-file edit.
 */

const JOKES = [
  'Check out everything I can do!',
  'These are my superpowers… kind of.',
  'Pick a beast, see the powers.',
  'POOF! Consider it built.',
]

const CREW_IMG = (id) => `/characters-processed/crew/${id}.png`

export default function Shift() {
  const [active, setActive] = useState(0)
  const [joke, setJoke] = useState(0)

  useEffect(() => {
    const j = setInterval(() => setJoke((v) => (v + 1) % JOKES.length), 3200)
    return () => clearInterval(j)
  }, [])

  const crew = SKILL_CREW[active]

  return (
    <section
      id="shift"
      className="panel"
      style={{ background: 'linear-gradient(180deg,#0b1230,#08351a 55%,#0b3d1f)' }}
    >
      {/* comic "concentration lines" radiating from behind Beast Boy, plus a
          faint halftone wash for texture */}
      <div className="absolute inset-0 comic-burst" style={{ '--burst-x': '78%', '--burst-y': '6%' }} />
      <div className="absolute inset-0 halftone opacity-[0.08]" />

      <div className="panel-scroll">
      <div className="panel-inner mx-auto w-[min(1200px,94vw)] px-1 py-4 md:py-5">

        {/* ---------------- Header band ---------------- */}
        <div className="mb-4 md:mb-5 flex items-end justify-between gap-6">
          <div>
            <PanelTag color="#4fd84f">BEAST BOY'S TALENT: NEXT LEVEL</PanelTag>
            {/* pb on the heading contains the hard drop-shadow so it can't bleed
                onto the subheading below (which was overlapping it). */}
            <h2 className="mt-3 mega text-white leading-[0.9] pb-2" style={{ fontSize: 'clamp(2.4rem,6vw,4.6rem)' }}>
              MY SKILLS
            </h2>
            <p className="mt-2 text-tt-green font-display" style={{ fontSize: 'clamp(1rem,1.6vw,1.35rem)' }}>
              These are my superpowers <span className="text-white/70">(kind of).</span>
            </p>
          </div>

          {/* Beast Boy mascot + rotating quip (desktop only) */}
          <div className="hidden lg:flex items-end gap-3 shrink-0 pb-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={joke}
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: 'spring', stiffness: 240, damping: 14 }}
              >
                <SpeechBubble tail="right" color="#4fd84f" editId="shift__bubble" label="Beast Boy bubble">
                  <span className="text-sm">{JOKES[joke]}</span>
                </SpeechBubble>
              </motion.div>
            </AnimatePresence>
            <img
              src={CREW_IMG('beastboy')}
              alt=""
              draggable={false}
              loading="lazy"
              decoding="async"
              className="w-20 xl:w-24 h-auto select-none drift char-glow"
              style={{ '--r': '2deg' }}
            />
          </div>
        </div>

        {/* ---------------- One HUD frame: Crew | Skills ---------------- */}
        {/* A single notched comic panel wraps the whole explorer so it reads as
            one compact rectangle — no stretched columns or dead vertical space. */}
        <div className="notch-frame p-[3px]" style={{ background: 'rgba(79,216,79,0.55)' }}>
          <div className="notch-frame p-4 md:p-5" style={{ background: '#0a1f14' }}>
            <div className="grid lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] gap-5 lg:gap-6 items-start">

              {/* ===== Crew selector ===== */}
              <div className="min-w-0">
                <div className="mb-3">
                  <div className="font-display text-white text-lg md:text-xl">MEET THE CREW <span className="align-middle">🐾</span></div>
                  <p className="text-white/70 font-body text-xs mt-0.5 italic">(aka the tech that backs my skills)</p>
                </div>

                {/* Horizontal scroll on mobile; stacks on desktop at natural
                    height (no flex-1 stretch — that's what left the dead space). */}
                <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0 no-scrollbar">
                  {SKILL_CREW.map((c, i) => (
                    <CrewCard
                      key={c.id}
                      crew={c}
                      active={i === active}
                      onSelect={() => setActive(i)}
                    />
                  ))}
                </div>
              </div>

              {/* ===== Skills panel ===== */}
              <div className="min-w-0">
                {/* active category banner */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-white/10">
                  <span
                    className="w-1.5 self-stretch rounded-full shrink-0"
                    style={{ background: crew.color }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-impact text-xl md:text-2xl text-stroke-thin" style={{ color: crew.color }}>
                        {crew.name.toUpperCase()}
                      </span>
                      <span className="font-display text-white/85 text-base md:text-lg">— {crew.role}</span>
                    </div>
                    <p className="text-white/60 font-body text-sm leading-snug mt-0.5">{crew.blurb}</p>
                  </div>
                  <span
                    className="ml-auto shrink-0 font-display text-xs tracking-widest uppercase"
                    style={{ color: crew.color }}
                  >
                    Active
                  </span>
                </div>

                {/* skills — a fixed-size block. Each character shows one page
                    (up to PAGE_SIZE); anything beyond that is swipeable, so the
                    block stays exactly the same height whether a character has 5
                    skills or 7. */}
                <SkillsDeck crew={crew} />
              </div>
            </div>
          </div>
        </div>

        {/* shape-shift roles — a full-width endless news-ticker strip tucked
            directly under the crew + skills frame */}
        <div className="mt-3">
          <FormsMarquee />
        </div>
      </div>
      </div>
    </section>
  )
}

/* ---------- Crew selector card ---------- */
function CrewCard({ crew, active, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onMouseEnter={onSelect}
      aria-pressed={active}
      className="magnetic group relative shrink-0 w-[230px] lg:w-full text-left rounded-2xl ink-border p-3 flex items-center gap-3 overflow-hidden outline-none"
      style={{
        background: active ? '#12301c' : '#0e2417',
        boxShadow: active
          ? `10px 10px 0 rgba(0,0,0,0.85), 0 0 0 3px ${crew.color}, 0 0 26px ${crew.color}66`
          : undefined,
      }}
      animate={{ scale: active ? 1.02 : 1, x: active ? 2 : 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      data-hot
    >
      {/* accent wash on active / hover */}
      <span
        className="absolute inset-0 transition-opacity pointer-events-none"
        style={{
          opacity: active ? 0.22 : 0,
          background: `radial-gradient(circle at 22% 40%, ${crew.color}, transparent 68%)`,
        }}
      />
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(circle at 22% 40%, ${crew.color}, transparent 68%)` }}
      />

      {/* thumbnail */}
      <span
        className="relative shrink-0 grid place-items-center w-16 h-16 rounded-xl border-2 border-black overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.28)' }}
      >
        <img
          src={CREW_IMG(crew.id)}
          alt={crew.name}
          draggable={false}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-contain select-none transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-105'}`}
        />
      </span>

      {/* label */}
      <span className="relative min-w-0 flex-1">
        <span className="block font-impact text-lg text-stroke-thin leading-tight" style={{ color: crew.color }}>
          {crew.name}
        </span>
        <span className="block font-body text-white/70 text-xs leading-tight">{crew.vibe}</span>
        <span className="block font-display text-white/60 text-[0.7rem] mt-0.5 tracking-wide">{crew.role}</span>
      </span>

      {/* chevron */}
      <span
        className="relative shrink-0 grid place-items-center w-7 h-7 rounded-full border-2 border-black font-display text-sm transition-colors"
        style={{ background: active ? crew.color : 'rgba(255,255,255,0.14)', color: active ? '#0b0b12' : '#fff' }}
      >
        ›
      </span>
    </motion.button>
  )
}

/* ---------- Individual skill tile ---------- */
// Short alphanumeric badges (N, TS, JS, n8n) render as coloured type; anything
// else (emoji) renders as-is.
const isText = (b) => /^[A-Za-z0-9.]{1,4}$/.test(b) && /[A-Za-z]/.test(b)

function SkillCard({ skill, n, accent }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.9 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 240, damping: 18 } },
      }}
      whileHover={{ y: -6 }}
      className="magnetic group relative rounded-2xl ink-border p-3 md:p-4 overflow-hidden"
      style={{ background: '#0e2417' }}
      data-hot
    >
      {/* hover glow in the skill's own colour */}
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${skill.color}, transparent 70%)` }}
      />
      {/* index number, comic-style */}
      <span className="absolute right-3 bottom-2 font-impact text-white/12 text-4xl leading-none select-none pointer-events-none">
        {String(n).padStart(2, '0')}
      </span>

      <div className="relative">
        <span
          className="grid place-items-center w-12 h-12 rounded-xl border-2 border-black text-3xl leading-none mb-3"
          style={{ background: 'rgba(0,0,0,0.25)', color: isText(skill.badge) ? skill.color : undefined }}
        >
          {isText(skill.badge) ? <b className="font-display text-2xl">{skill.badge}</b> : skill.badge}
        </span>
        <div className="font-display text-white text-lg md:text-xl leading-tight">{skill.name}</div>
        <p className="mt-1 text-white/65 font-body text-sm leading-snug">{skill.desc}</p>
      </div>

      {/* bottom accent bar */}
      <span
        className="absolute left-0 bottom-0 h-1.5 w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{ background: accent }}
      />
    </motion.div>
  )
}

/* ---------- Swipeable, fixed-size skills block ---------- */
function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function SkillsDeck({ crew }) {
  const trackRef = useRef(null)
  const [page, setPage] = useState(0)
  const pages = chunk(crew.skills, PAGE_SIZE)

  // Reset to the first page whenever the character changes.
  useEffect(() => {
    setPage(0)
    if (trackRef.current) trackRef.current.scrollLeft = 0
  }, [crew.id])

  // Page geometry is read from the actual page elements (not clientWidth) so
  // paging stays exact regardless of the track's own padding.
  const sync = useCallback(() => {
    const el = trackRef.current
    if (!el || !el.firstChild) return
    setPage(Math.round(el.scrollLeft / el.firstChild.offsetWidth))
  }, [])

  // Native `scrollTo({behavior:'smooth'})` is a no-op on this inner track
  // (Lenis / reduced-motion disables native smooth scroll), so tween scrollLeft
  // by hand. Snap is turned off during the tween so it can't fight the anim.
  const goTo = (i) => {
    const el = trackRef.current
    if (!el || !el.children.length) return
    const clamped = Math.max(0, Math.min(el.children.length - 1, i))
    const target = el.children[clamped].offsetLeft - el.children[0].offsetLeft
    const start = el.scrollLeft
    const dist = target - start
    if (Math.abs(dist) < 2) return
    const t0 = performance.now()
    const dur = 380
    el.style.scrollSnapType = 'none'
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur)
      const e = 1 - Math.pow(1 - p, 3) // easeOutCubic
      el.scrollLeft = start + dist * e
      if (p < 1) requestAnimationFrame(step)
      else el.style.scrollSnapType = ''
    }
    requestAnimationFrame(step)
  }

  const multi = pages.length > 1

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={sync}
        className="no-scrollbar flex overflow-x-auto snap-x snap-mandatory px-1 pb-2"
        style={{ overscrollBehaviorX: 'contain' }}
      >
        {pages.map((pg, pi) => (
          <motion.div
            /* key includes crew.id so pages re-run their pop-in on every switch */
            key={`${crew.id}-${pi}`}
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            className="snap-start shrink-0 w-full grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 content-start"
          >
            {pg.map((s, i) => (
              <SkillCard key={s.name} skill={s} n={pi * PAGE_SIZE + i + 1} accent={crew.color} />
            ))}
          </motion.div>
        ))}
      </div>

      {/* Controls only render for multi-page characters, so single-page ones
          don't carry an empty row of dead space above the roles strip. */}
      {multi && (
        <div className="mt-3 h-9 flex items-center justify-between gap-3">
          <>
            <span className="font-display text-white/75 text-xs tracking-wide">
              ← SWIPE FOR MORE POWERS →
            </span>
            <div className="flex items-center gap-3">
              {/* dots */}
              <div className="flex items-center gap-1.5">
                {pages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to page ${i + 1}`}
                    aria-current={i === page}
                    className="grid place-items-center bg-transparent border-0 p-0 cursor-pointer"
                    style={{ minWidth: 24, height: 24 }}
                  >
                    <span
                      className="block rounded-full border-2 border-black transition-all"
                      style={{
                        width: i === page ? 26 : 11,
                        height: 11,
                        background: i === page ? crew.color : 'rgba(255,255,255,0.3)',
                      }}
                    />
                  </button>
                ))}
              </div>
              {/* arrows */}
              <div className="flex gap-2">
                <DeckArrow dir="prev" onClick={() => goTo(page - 1)} disabled={page === 0} color={crew.color} />
                <DeckArrow dir="next" onClick={() => goTo(page + 1)} disabled={page === pages.length - 1} color={crew.color} />
              </div>
            </div>
          </>
        </div>
      )}
    </div>
  )
}

function DeckArrow({ dir, onClick, disabled, color }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous skills' : 'More skills'}
      className="ink-border rounded-full w-9 h-9 flex items-center justify-center font-display text-lg transition-opacity"
      style={{
        background: disabled ? 'rgba(255,255,255,0.12)' : color,
        color: disabled ? 'rgba(255,255,255,0.4)' : '#0b0b12',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {dir === 'prev' ? '‹' : '›'}
    </button>
  )
}

/* ---------- Endless role-ticker strip ---------- */
function FormsMarquee() {
  // Two copies of the list back-to-back so the -50% slide loops seamlessly.
  const loop = [...FORMS, ...FORMS]
  return (
    <div
      className="marquee marquee-mask rounded-2xl ink-border py-3"
      style={{ background: '#0b1a10' }}
    >
      <div className="marquee-track gap-2.5 pr-2.5">
        {loop.map((f, i) => (
          <span
            key={`${f.label}-${i}`}
            aria-hidden={i >= FORMS.length}
            className="shrink-0 font-display text-xs sm:text-sm px-3 py-1.5 rounded-full ink-border whitespace-nowrap"
            style={{ background: '#0e2417', color: '#cfe' }}
          >
            {f.emoji} {f.label}
          </span>
        ))}
      </div>
    </div>
  )
}
