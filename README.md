# ⚡ Aman Ullah Kazi — "NEW TITAN UNLOCKED" Portfolio

An interactive, animated portfolio built like a Teen Titans-style cartoon episode.
Each guide character walks visitors through one part of who Aman is.

Built with **Vite + React**, **Framer Motion**, **GSAP + ScrollTrigger**, **Lenis** smooth
scroll and **Tailwind CSS v4**.

> The character art is **100% original vector work** (hand-built SVG in `src/components/Characters.jsx`).
> It is *inspired by* the Teen Titans Go! archetypes and color palette but does not reproduce
> DC / Cartoon Network's copyrighted character designs. Swap in your own art any time.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## The episode (sections)

1. **Hero** — the leader bursts in, "NEW TITAN UNLOCKED"
2. **My Superpowers** — skills reframed as powers (Lightning Hands, Neural Brain…)
3. **Shape-Shifter** — auto-cycles through every role Aman becomes
4. **About Me** — a "classified" mission-briefing cork board
5. **My Journey** — experience "installs" like software in a HUD command center
6. **My Projects** — MatchIT, Burky Flows, CinemaSync as comic case files
7. **Fun Facts** — the warm, personality section
8. **Hire Me** — a dark-magic finale that casts the "hire" spell + all contact links
9. **Footer** — the team waves goodbye, credits roll

## Make it yours

- **All content** lives in [`src/data/content.js`](src/data/content.js) — name, projects,
  skills, timeline, contact links. Edit there, everything updates.
- **Resume:** drop your PDF at `public/resume.pdf`, then set `resumeUrl: '/resume.pdf'`
  in `content.js`.
- **Colors** are CSS variables in [`src/index.css`](src/index.css) (`@theme` block).
- **Characters** are editable SVG components in
  [`src/components/Characters.jsx`](src/components/Characters.jsx).

## Deploy

Any static host works. `npm run build` then deploy `dist/`
(Vercel / Netlify: framework "Vite", build `npm run build`, output `dist`).
