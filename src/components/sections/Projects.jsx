import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Character from '../Character'
import { Reveal, PanelTag, SpeechBubble, ComicBurst, Lines } from '../ui'
import { useContent } from '../../data/contentStore'

/* ---------------------------------------------------------------------------
   Projects — "The team shows off"
   A horizontal, swipeable comic-card carousel. Each Titan-themed card is a
   numbered case file: character art + icon badge in the header, then title,
   one-liner, tech tags and a launch arrow. Drag / swipe / arrows to browse;
   the run ends on a "MORE COMING SOON!" card.
--------------------------------------------------------------------------- */

export default function Projects() {
  const { projects } = useContent()
  const scroller = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  // Refresh the arrow enabled/disabled state from the live scroll position.
  const syncEdges = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft >= max - 4)
  }, [])

  useEffect(() => {
    syncEdges()
    window.addEventListener('resize', syncEdges)
    return () => window.removeEventListener('resize', syncEdges)
  }, [syncEdges])

  // Scroll by roughly one card (+ gap) in either direction.
  const nudge = (dir) => {
    const el = scroller.current
    if (!el) return
    const card = el.querySelector('[data-card]')
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  // Pointer drag-to-scroll (desktop mouse feels like a real swipe).
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false })
  const onPointerDown = (e) => {
    const el = scroller.current
    if (!el) return
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false }
    el.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!drag.current.down) return
    const el = scroller.current
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    el.scrollLeft = drag.current.startLeft - dx
  }
  const endDrag = (e) => {
    const el = scroller.current
    drag.current.down = false
    el?.releasePointerCapture?.(e.pointerId)
  }

  return (
    <section id="projects" className="panel overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#160a2e,#2a0a52 55%,#1a0740)' }}>
      <div className="absolute inset-0 halftone-light opacity-25" />

      {/* ---- floating comic decorations (desktop only, non-interactive) ---- */}
      <ComicBurst word={projects.burst1} color="#7ec8ff"
        className="absolute top-[16%] left-[3%] z-[3] hidden xl:block drift pointer-events-none" />
      <div className="absolute top-[15%] right-[3%] z-[3] hidden xl:block floaty pointer-events-none">
        <SpeechBubble tail="right" color="#fff">
          <span className="text-sm font-display tracking-wide"><Lines text={projects.bubble1} /></span>
        </SpeechBubble>
      </div>
      <div className="absolute bottom-[10%] left-[4%] z-[3] hidden xl:block wobble pointer-events-none">
        <SpeechBubble tail="bottom-left" color="#fff">
          <span className="text-sm font-display tracking-wide"><Lines text={projects.bubble2} /></span>
        </SpeechBubble>
      </div>
      <ComicBurst word={projects.burst2} color="#ffd21e" size="clamp(1.5rem,2.6vw,2.4rem)"
        className="absolute bottom-[3%] right-[3%] z-[3] hidden xl:block pop-blink pointer-events-none" />

      <div className="panel-scroll">
      <div className="panel-inner relative z-10 mx-auto w-[min(1320px,94vw)] py-6 md:py-8">
        {/* ---- heading ---- */}
        <div className="text-center mb-4 md:mb-6">
          <PanelTag color="#7b2ff7">{projects.tag}</PanelTag>
          <h2 className="mt-3 mega text-white" style={{ fontSize: 'clamp(2.8rem,7.5vw,5.6rem)' }}>
            {projects.heading}
          </h2>
          <p className="mt-2 text-white/85" style={{ fontSize: 'clamp(1rem,1.4vw,1.25rem)' }}>
            {projects.subtitleA} <span className="hidden sm:inline">{projects.subtitleB}</span>
          </p>
        </div>

        {/* ---- carousel ---- */}
        <div className="relative">
          {/* prev / next arrows (desktop) */}
          <CarouselArrow dir="prev" onClick={() => nudge(-1)} disabled={atStart} />
          <CarouselArrow dir="next" onClick={() => nudge(1)} disabled={atEnd} />

          {/* edge fades hint at more off-screen */}
          <div className={`pointer-events-none absolute inset-y-0 left-0 w-14 z-[2] transition-opacity ${atStart ? 'opacity-0' : 'opacity-100'}`}
            style={{ background: 'linear-gradient(90deg,#1c0a3e,transparent)' }} />
          <div className={`pointer-events-none absolute inset-y-0 right-0 w-14 z-[2] transition-opacity ${atEnd ? 'opacity-0' : 'opacity-100'}`}
            style={{ background: 'linear-gradient(270deg,#22094a,transparent)' }} />

          <div
            ref={scroller}
            onScroll={syncEdges}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 pt-2 px-1 cursor-grab active:cursor-grabbing"
            style={{ scrollBehavior: 'smooth', touchAction: 'pan-y' }}
          >
            {projects.items.map((p, i) => (
              <ProjectCard key={`${p.name}-${i}`} p={p} n={i + 1} dragRef={drag} labels={projects} />
            ))}
            <ComingSoonCard labels={projects} />
          </div>
        </div>

        {/* ---- "more coming soon" banner ---- */}
        <Reveal>
          <div className="mt-4 flex justify-center">
            <div className="relative inline-flex items-center gap-3 ink-border rounded-full px-7 py-3 font-display text-xl md:text-2xl tracking-wide wobble"
              style={{ background: '#0e0524', color: '#ffd21e' }}>
              <span className="text-tt-purple">✦</span>
              {projects.moreBanner}
              <span className="text-tt-yellow flicker">⚡</span>
            </div>
          </div>
        </Reveal>
      </div>
      </div>
    </section>
  )
}

/* ---- single project case-file card ---- */
function ProjectCard({ p, n, dragRef, labels }) {
  // Ignore the click that ends a drag so a swipe never fires the link.
  const guardClick = (e) => {
    if (dragRef.current?.moved) e.preventDefault()
  }
  // A project can carry a GitHub `repo` and/or a `live` demo. We render only the
  // buttons that point somewhere real; a project with neither (a private repo or
  // work-in-progress) shows a quiet "case file" chip instead of a dead button.
  const hasRepo = p.repo && p.repo !== '#'
  const hasLive = p.live && p.live !== '#'
  const hasAny = hasRepo || hasLive
  return (
    <motion.article
      data-card
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="group relative snap-start shrink-0 w-[82vw] sm:w-[360px] rounded-3xl ink-border-lg overflow-hidden flex flex-col"
      style={{ background: '#100626' }}
    >
      {/* header: character art + icon badge over an accent glow */}
      <div className="relative h-36 overflow-hidden"
        style={{ background: `radial-gradient(circle at 32% 30%, ${p.accent}, #0b0620 78%)` }}>
        <div className="absolute inset-0 speed-lines opacity-30" />
        <div className="absolute inset-0 halftone opacity-20" />

        {/* number badge */}
        <div className="absolute top-3 left-3 z-10 font-display text-2xl text-white text-stroke-thin">
          {String(n).padStart(2, '0')}
        </div>

        {/* icon badge (emoji) */}
        <div className="absolute top-3 right-3 z-10 h-14 w-14 rounded-full grid place-items-center ink-border text-2xl group-hover:rotate-12 transition-transform"
          style={{ background: '#0b0620', boxShadow: `0 0 22px ${p.accent}` }}>
          {p.emoji}
        </div>

        {/* character mascot */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-32 w-auto opacity-95 group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-300 pointer-events-none">
          <Character id={p.guide} variant="badge" className="h-full w-auto" style={{ width: 'auto', height: '100%' }} />
        </div>
      </div>

      {/* body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-3xl leading-none" style={{ color: p.accent }}>{p.name}</h3>
        <p className="mt-2 text-white/80 leading-snug"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {p.tagline}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {p.stack.slice(0, 3).map((s) => (
            <span key={s} className="text-xs font-body font-semibold px-2.5 py-1 rounded-full"
              style={{ background: '#1c0f38', color: '#fff', border: '2px solid #000' }}>
              {s}
            </span>
          ))}
        </div>

        {/* actions — render only the links that point somewhere real. Live demo
            gets the loud accent button; source gets a dark "Code" button. A card
            with neither (private / WIP) shows a quiet "case file" chip instead of
            sprouting a button that leads nowhere. */}
        <div className="mt-auto pt-4 flex flex-wrap justify-end items-center gap-2">
          {!hasAny && (
            <span
              className="mr-auto font-display text-xs tracking-widest uppercase px-3 py-1.5 rounded-full"
              style={{ color: p.accent, background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.12)' }}
            >
              {labels.privateLabel}
            </span>
          )}
          {hasLive && (
            <a
              href={p.live}
              onClick={guardClick}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open the live demo of ${p.name}`}
              className="btn-comic inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl text-sm"
              style={{ background: p.accent, color: '#0b0b12' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
              {labels.liveLabel}
            </a>
          )}
          {hasRepo && (
            <a
              href={p.repo}
              onClick={guardClick}
              target="_blank"
              rel="noreferrer"
              aria-label={`View the source of ${p.name} on GitHub`}
              className="btn-comic inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl text-sm"
              style={{ background: '#0b0620', color: '#fff' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 2.5-.35c.85 0 1.71.12 2.5.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
              </svg>
              {labels.codeLabel}
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

/* ---- closing "more coming soon" card ---- */
function ComingSoonCard({ labels }) {
  return (
    <div data-card
      className="relative snap-start shrink-0 w-[82vw] sm:w-[360px] rounded-3xl overflow-hidden flex flex-col items-center justify-center text-center p-8"
      style={{ border: '4px dashed rgba(255,255,255,0.35)' }}>
      <div className="absolute inset-0 halftone-light opacity-20" />
      <div className="text-6xl mb-4 floaty">🚧</div>
      <div className="font-display text-4xl text-white leading-none"><Lines text={labels.comingSoonTitle} /></div>
      <p className="mt-4 text-white/70">{labels.comingSoonText}</p>
      <div className="mt-5 font-display text-2xl text-tt-yellow pop-blink">{labels.comingSoonTag}</div>
    </div>
  )
}

/* ---- circular comic nav arrow ---- */
function CarouselArrow({ dir, onClick, disabled }) {
  const isPrev = dir === 'prev'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? 'Previous projects' : 'Next projects'}
      className={`hidden md:grid place-items-center absolute top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full ink-border font-display text-2xl transition-all duration-200
        ${isPrev ? '-left-5' : '-right-5'}
        ${disabled ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110'}`}
      style={{ background: '#ffd21e', color: '#0b0b12' }}
    >
      {isPrev ? '‹' : '›'}
    </button>
  )
}
