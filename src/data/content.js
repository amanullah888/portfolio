// =============================================================================
// ALL the portfolio's copy lives here — one single source of truth.
//
// Everything you can read on the site (headings, taglines, speech bubbles,
// button labels, project blurbs, footer lines… everything) is a field in the
// CONTENT object below. Edit a value here and it changes on the site.
//
// You normally DON'T need to hand-edit this file: run the dev server and use
// "Content Mode" (the floating button, bottom-left) to edit any text right on
// the page, then hit "Save" — that writes your changes to
// `content.overrides.json`, which is layered on top of these defaults at
// runtime. This file stays the clean, documented baseline you can always fall
// back to with "Reset".
//
// Multi-line strings: use "\n" for a line break (rendered as <br/>).
// =============================================================================

export const CONTENT = {
  // --- Who you are (used across several sections) ---------------------------
  profile: {
    name: 'Aman Ullah Kazi',
    // Your headline title. `titles` rotates in the hero badge, so you don't
    // have to commit to a single label — the first one is also the default
    // shown everywhere else.
    role: 'Full-Stack & AI Engineer',
    titles: [
      'Full-Stack & AI Engineer',
      'Full-Stack Developer',
      'AI / Automation Engineer',
      'Systems Builder',
      'Product Engineer',
    ],
    tagline: 'I build software that solves real problems — web, backend and AI.',
    location: 'Karachi, Pakistan',
    email: 'amanullahkazi8@gmail.com',
    phone: '+92 336 2354307',
    linkedin: 'https://linkedin.com/in/aman-ullah-kazi',
    github: 'https://github.com/amanullah888',
    resumeUrl: '/resume.pdf', // drop your PDF at public/resume.pdf
    // Contextual CVs. Each role points at a file in /public. If a role-specific
    // file is missing, the download gracefully falls back to `resumeUrl` (the
    // general CV) so a button never leads to a dead route — to enable a tailored
    // CV, just drop the named PDF into public/ and it's used automatically.
    resumeName: 'Aman-Ullah-Kazi-CV.pdf',
    resumes: [
      { id: 'fullstack', label: 'Full-Stack / Systems', file: '/resume.pdf', download: 'Aman-Ullah-Kazi-Full-Stack-CV.pdf' },
      { id: 'ai', label: 'AI Automation', file: '/resume-ai-automation.pdf', download: 'Aman-Ullah-Kazi-AI-Automation-CV.pdf' },
      { id: 'product', label: 'Product Engineer', file: '/resume-product-engineer.pdf', download: 'Aman-Ullah-Kazi-Product-Engineer-CV.pdf' },
    ],
  },

  // --- Boot-up preloader -----------------------------------------------------
  preloader: {
    line: 'ASSEMBLING THE TITANS…',
  },

  // --- Top menu --------------------------------------------------------------
  nav: {
    menuButton: 'MENU',
    menuTitle: 'SELECT A MISSION',
    hireCta: 'HIRE ME',
    links: [
      { id: 'hero', label: 'Home' },
      { id: 'about', label: 'About & Powers' },
      { id: 'shift', label: 'Skills' },
      { id: 'experience', label: 'Journey' },
      { id: 'projects', label: 'Projects' },
      { id: 'personality', label: 'Fun' },
      { id: 'hire', label: 'Hire Me' },
    ],
  },

  // --- Scene dividers (the flying comic words between sections) --------------
  dividers: {
    afterHero: 'WHOOSH!',
    afterAbout: 'BOOT UP!',
    afterSkills: 'BAM!',
    afterExperience: 'SPARKLE!',
    afterProjects: 'ZAP!',
  },

  // --- Hero ------------------------------------------------------------------
  hero: {
    eyebrowBadge: '🐦 NEW TITAN',
    eyebrowText: 'HEY, TITANS — THIS IS',
    // Name shown stacked in the hero. One line per "\n".
    name: 'AMAN\nULLAH\nKAZI',
    introLead: 'This guy adapts.',
    introBody:
      'I build software that solves real problems — from schema design to shipped product.',
    ctaPrimary: 'EXPLORE MY WORK',
    ctaSecondary: 'HIRE ME',
    bubble: 'Titans… meet our\nnewest member.',
    // Second Robin bubble — specifically about adaptability.
    bubble2: 'And this guy?\nHe adapts fast.',
  },

  // --- About -----------------------------------------------------------------
  about: {
    tag: 'CLASSIFIED — MISSION BRIEFING',
    heading: 'ABOUT ME',
    dossierLabel: '// DOSSIER',
    intro:
      "I'm Aman Ullah Kazi — a software & AI builder (React + Python) who turns messy ideas into clean, working products across web, backend, AI and automation. Lately that means LLM agents, RAG pipelines and backends that actually prove they're correct.",
    // Name and Base are pulled from `profile`; these two are free text.
    factClass: 'Software & AI Builder',
    factFuel: 'Cartoons 📺 + Sugar 🍬',
    achievement: '✓ ACHIEVEMENT UNLOCKED: Reliable Teammate',
    boardTitle: 'THE BOARD',
    boardHint: '(hover a note)',
    stickies: [
      { t: 'Who', v: 'Builder who ships end-to-end — frontend, backend, AI & everything glued between.' },
      { t: 'Enjoys', v: 'Building products from zero, wiring up AI agents, and automating repetitive work.' },
      { t: 'Thinks', v: 'Break the problem down, ship the smallest working thing, then make it great.' },
      { t: 'Personality', v: 'Curious by default. Powered by cartoons and questionable amounts of sugar.' },
      { t: 'Solves', v: 'Detective mode ON. I chase the root cause, not the symptom.' },
    ],
    bubble: 'Okay. Time for\nsome serious stuff.',
  },

  // --- Skills ("MY SKILLS") --------------------------------------------------
  skills: {
    tag: "BEAST BOY'S TALENT: NEXT LEVEL",
    heading: 'MY SKILLS',
    subtitleA: 'These are my superpowers',
    subtitleB: '(kind of).',
    crewTitle: 'MEET THE CREW',
    crewHint: '(aka the tech that backs my skills)',
    activeLabel: 'Active',
    swipeHint: '← SWIPE FOR MORE POWERS →',
    // Rotating one-liners next to the Beast Boy mascot.
    jokes: [
      'Check out everything I can do!',
      'These are my superpowers… kind of.',
      'Pick a beast, see the powers.',
      'POOF! Consider it built.',
    ],
    // Each crew member = one skill category. `id` maps to the art at
    // public/characters-processed/crew/<id>.png.
    crew: [
      {
        id: 'beastboy-cat',
        name: 'Kitty',
        role: 'Frontend & UI',
        vibe: 'Energy & Fun',
        color: '#7ec8ff',
        blurb: 'Fast, playful interfaces people actually enjoy using.',
        skills: [
          { name: 'React', badge: '⚛️', color: '#61dafb', desc: 'Interactive, component-driven UIs at speed.' },
          { name: 'Next.js 15', badge: 'N', color: '#ffffff', desc: 'App Router, SSR & modern web apps.' },
          { name: 'TypeScript', badge: 'TS', color: '#3178c6', desc: 'Type-safe code that scales cleanly.' },
          { name: 'Tailwind', badge: '🌊', color: '#38bdf8', desc: 'Utility-first styling, pixel-perfect fast.' },
          { name: 'Framer Motion', badge: '🎞️', color: '#e64bd0', desc: 'Motion & micro-interactions that feel alive.' },
          { name: 'React Flow', badge: '🕸️', color: '#ff8f3e', desc: 'Node canvases for visual, graph-based UIs.' },
        ],
      },
      {
        id: 'beastboy-gorilla',
        name: 'Gorilla',
        role: 'Backend & Systems',
        vibe: 'Power & Strength',
        color: '#ffd21e',
        blurb: 'Heavy-lifting APIs, databases and systems that never blink.',
        skills: [
          { name: 'Python', badge: '🐍', color: '#ffd43b', desc: 'Backend logic, scripting & automation.' },
          { name: 'FastAPI', badge: '⚡', color: '#05998b', desc: 'Async, typed, production-ready APIs.' },
          { name: 'SQLAlchemy', badge: '🧱', color: '#c0392b', desc: 'ORM modeling with Pydantic-typed schemas.' },
          { name: 'PostgreSQL', badge: '🐘', color: '#4169e1', desc: 'Relational data, modeled to last.' },
          { name: 'Redis', badge: '🧰', color: '#ff4438', desc: 'Caching & fast in-memory data paths.' },
          { name: 'Docker', badge: '🐳', color: '#2496ed', desc: 'Containerized, reproducible everywhere.' },
        ],
      },
      {
        id: 'beastboy-lion',
        name: 'Roaaar',
        role: 'AI, Data & Cloud',
        vibe: 'Courage & Drive',
        color: '#ff8f3e',
        blurb: 'The bold stuff — LLMs, AI pipelines, data and the cloud.',
        skills: [
          { name: 'LangGraph', badge: '🕸️', color: '#7b2ff7', desc: 'Orchestrating multi-agent AI workflows.' },
          { name: 'LangChain', badge: '🔗', color: '#1c8c6b', desc: 'Chains, tools & retrieval for LLM apps.' },
          { name: 'RAG', badge: '📚', color: '#ff6f61', desc: 'Grounded answers via vector retrieval.' },
          { name: 'n8n', badge: 'n8n', color: '#ea4b71', desc: 'Low-code automation & workflow pipelines.' },
          { name: 'dbt + DuckDB', badge: '🦆', color: '#fff100', desc: 'Analytics engineering & local warehouses.' },
          { name: 'AWS', badge: '☁️', color: '#ff9900', desc: 'Cloud infra that ships to production.' },
          { name: 'pandas', badge: '🐼', color: '#7c8cff', desc: 'Wrangling & analyzing data at scale.' },
          { name: 'PyTorch', badge: '🔥', color: '#ee4c2c', desc: 'Training & fine-tuning deep models.' },
        ],
      },
    ],
    // The scrolling role ticker under the skills panel.
    forms: [
      { label: 'Developer', emoji: '💻', color: '#4fd84f' },
      { label: 'UI Designer', emoji: '🎨', color: '#1a8cff' },
      { label: 'UX Designer', emoji: '🧭', color: '#ffd21e' },
      { label: 'ML Engineer', emoji: '📊', color: '#ff3ea5' },
      { label: 'AI Engineer', emoji: '🤖', color: '#7b2ff7' },
      { label: 'Automation Engineer', emoji: '🌀', color: '#4fd84f' },
      { label: 'Product Builder', emoji: '🚀', color: '#1a8cff' },
      { label: 'Founder', emoji: '👑', color: '#ffd21e' },
      { label: 'Full-Stack Developer', emoji: '🦸', color: '#ff3ea5' },
    ],
  },

  // --- Experience / Journey --------------------------------------------------
  experience: {
    tag: 'SYSTEM: TITANS COMMAND CENTER',
    heading: 'MY JOURNEY',
    terminalLine: '> installing experience modules...',
    powerLevelLabel: 'POWER LEVEL',
    statusInstalling: 'STATUS: installing...',
    statusDone: 'STATUS: EXPERIENCE UPDATED ✓',
    bubble: 'This list is\nso long…',
    items: [
      {
        year: '2022',
        title: 'FAST Origin',
        org: 'FAST-NUCES · BS Artificial Intelligence',
        log: 'Started the BS in Artificial Intelligence at FAST — and started tutoring O/A-Level CS & Maths on the side. First lines of code compiled successfully.',
        xp: 20,
      },
      {
        year: '2025',
        title: 'Burky Flows',
        org: 'AI Automation Engineer · Contract',
        log: 'Joined Burky Flows building AI automation and software — shipping LLM systems in Python & n8n across OpenAI, Claude and Gemini, including a RAG-powered WhatsApp assistant with retrieval and memory.',
        xp: 55,
      },
      {
        year: '2025',
        title: 'MatchIT',
        org: 'Founder & Sole Dev · ongoing',
        log: 'Founded and built a sports community platform solo — Next.js + FastAPI + PostgreSQL, containerised and deployed. Schema to production, all mine.',
        xp: 75,
      },
      {
        year: '2026',
        title: 'Burky Flows',
        org: 'AI Automation Engineer · Building Flagship Systems',
        log: 'Kept scaling automation work at Burky Flows while going deep on flagship systems — RaastTwin, an autonomous repair engine and an incident-autopsy engine. Correctness, observability and AI that proves itself.',
        xp: 90,
      },
      {
        year: '2026',
        title: 'Graduation',
        org: 'Graduated · BS Artificial Intelligence',
        log: 'Graduated FAST with the BS in Artificial Intelligence — degree done, systems shipping.',
        xp: 100,
      },
    ],
  },

  // --- Projects --------------------------------------------------------------
  projects: {
    tag: 'THE TEAM SHOWS OFF',
    heading: 'MY PROJECTS',
    subtitleA: 'Real systems, AI engines and shipped products.',
    subtitleB: 'Swipe through the case files.',
    bubble1: 'BUILT WITH\nCODE & CHAOS!',
    bubble2: 'IDEAS TODAY,\nIMPACT TOMORROW.',
    burst1: 'BAM!',
    burst2: 'ALWAYS BUILDING!',
    privateLabel: 'Case file · Private',
    liveLabel: 'Live',
    codeLabel: 'Code',
    moreBanner: 'MORE COMING SOON!',
    comingSoonTitle: 'MORE\nCOMING\nSOON!',
    comingSoonText: 'New case files are in the lab.',
    comingSoonTag: '⚡ STAY TUNED ⚡',
    // repo → "Code" button, live → "Live" button. Leave a link out ('') and the
    // card shows a quiet "case file" chip instead of a dead button.
    items: [
      {
        name: 'MatchIT',
        tagline: 'Sports community platform — founder & sole dev.',
        desc: 'Player discovery, match creation, court booking, tournament brackets, teams, chat and an escrow-style wallet for entry fees. Built end-to-end and solo, from schema design to production deploy. (Private repo.)',
        stack: ['Next.js', 'TypeScript', 'Tailwind', 'FastAPI', 'PostgreSQL', 'Docker'],
        accent: '#ff3ea5',
        emoji: '⚽',
        guide: 'robin',
        repo: '',
        live: '',
      },
      {
        name: 'RaastTwin',
        tagline: 'Deterministic instant-payment settlement twin.',
        desc: 'A discrete-event digital twin of an instant-payment network — banks → central switch → RTGS → a real double-entry ledger — built to prove financial correctness under adversarial, reproducible chaos. Invariants are cross-checked by property-based tests and a TLA+ formal spec; any failure replays and minimizes to a 3-payment counterexample.',
        stack: ['Python', 'FastAPI', 'TLA+', 'Hypothesis', 'Prometheus', 'Next.js'],
        accent: '#00e0ff',
        emoji: '🏦',
        guide: 'cyborg',
        repo: 'https://github.com/amanullah888/raasttwin',
        live: '',
      },
      {
        name: 'AI Backend Repair Engine',
        tagline: 'Autonomous debugging that proves its own fix.',
        desc: 'Diagnoses broken Python backends, localizes the root cause by fusing static analysis, runtime traces and a NetworkX dependency graph, then generates a patch and proves it inside a sandbox. Evidence fusion localizes the bug in 100% of benchmarks (top-3) vs 45% static-only and 0% for a blind LLM.',
        stack: ['Python', 'FastAPI', 'NetworkX', 'LLMs', 'Docker', 'pytest'],
        accent: '#7b2ff7',
        emoji: '🛠️',
        guide: 'robin',
        repo: 'https://github.com/amanullah888/ai-backend-repair-engine',
        live: '',
      },
      {
        name: 'AI Incident Autopsy Engine',
        tagline: 'Automated production-incident investigation.',
        desc: 'Ingests telemetry from a simulated distributed backend, detects incidents, ranks root causes and reconstructs the failure chain with real ML, graph and temporal analysis. Every LLM claim is tagged FACT / INFERENCE / UNCERTAINTY and cited to an evidence id, so the write-up can\'t hallucinate. Runs with zero infrastructure.',
        stack: ['Python', 'scikit-learn', 'NetworkX', 'FastAPI', 'React Flow', 'Redpanda'],
        accent: '#a35bff',
        emoji: '🔬',
        guide: 'raven',
        repo: 'https://github.com/amanullah888/ai-incident-autopsy-engine',
        live: '',
      },
      {
        name: 'AgentOps Studio',
        tagline: 'Build, run & observe multi-agent workflows.',
        desc: 'A React Flow canvas to compose sequential, parallel and conditional agent graphs, a Postgres-backed API that logs every run, and an eval dashboard for success rate, latency and token cost — plus an MCP hub for GitHub, Notion, Gmail & Slack.',
        stack: ['Next.js 15', 'React 19', 'LangGraph', 'FastAPI', 'PostgreSQL', 'MCP'],
        accent: '#4fd84f',
        emoji: '🕹️',
        guide: 'beastboy',
        repo: 'https://github.com/amanullah888/AgentOpsStudio',
        live: '',
      },
      {
        name: 'GridPulse',
        tagline: 'Weather → electricity-demand data pipeline.',
        desc: 'A production-style batch pipeline for five US grid regions: Python ingestion with idempotent upserts → a DuckDB warehouse modeled in dbt (star schema, 35 tests) → FastAPI → a Next.js dashboard. Surfaces a real finding — Houston/ERCOT is the most weather-sensitive region at ≈3.8% demand per °C.',
        stack: ['Python', 'DuckDB', 'dbt', 'Prefect', 'FastAPI', 'Next.js'],
        accent: '#ffd21e',
        emoji: '⚡',
        guide: 'starfire',
        repo: 'https://github.com/amanullah888/gridpulse-data-pipeline',
        live: 'https://gridpulse-data-pipeline.vercel.app',
      },
      {
        name: 'LCR GPT',
        tagline: 'Regulatory reporting assistant · contributor.',
        desc: 'A production RAG system that maps financial items to their exact PRA Liquidity Coverage Ratio reporting locations across regulatory templates: PDF & XLSX parsing, chunking, vector embedding into ChromaDB, and retrieval-backed LLM answers.',
        stack: ['Python', 'FastAPI', 'LangChain', 'ChromaDB', 'RAG', 'AWS'],
        accent: '#1a8cff',
        emoji: '📊',
        guide: 'raven',
        repo: 'https://github.com/unaizaahmedk/in-house-gpt-lcr-reporting-',
        live: '',
      },
      {
        name: 'Retail Sales Intelligence',
        tagline: 'ETL + analytics dashboard.',
        desc: 'An end-to-end pipeline that cleans and aggregates raw transactions, runs RFM customer segmentation into five tiers, and surfaces revenue, product and regional trends through 10+ chart types with a live SQL query console.',
        stack: ['Python', 'pandas', 'SQLite', 'Plotly', 'Streamlit', 'scikit-learn'],
        accent: '#ff8f3e',
        emoji: '🛒',
        guide: 'starfire',
        repo: 'https://github.com/amanullah888/RetailSalesIntelligenceDashboard',
        live: '',
      },
    ],
  },

  // --- Personality / Fun -----------------------------------------------------
  personality: {
    tag: 'THE SOFTER SIDE',
    heading: 'FUN FACTS ABOUT ME',
    // The colourful subtitle: "A mix of {A}, {B}, and {C}."
    subtitleWords: ['skills', 'quirks', 'superpowers'],
    traitsTitle: 'WHAT I BRING TO THE TEAM',
    traits: ['Communication', 'Leadership', 'Teamwork', 'Curiosity', 'Helping people', 'Always learning'],
    funFacts: [
      { icon: '📺', t: 'Loves a good cartoon.' },
      { icon: '🧩', t: 'Enjoys solving problems more than finding them.' },
      { icon: '🌙', t: 'Certified night owl.' },
      { icon: '🤑', t: 'All about the greens 💵' },
      { icon: '✨', t: 'Dream: build products that help people — and the community around them.' },
    ],
    bubble: 'Ooh! Please,\nenjoy the fun facts!',
  },

  // --- Hire ------------------------------------------------------------------
  hire: {
    tag: "RAVEN'S CHAMBER — LET'S CONNECT",
    quote: 'Your decision has already been made…',
    headline: 'YOU WANT TO\nHIRE AMAN.',
    pitch: "The spell is cast. Resistance is futile. (Also I'm genuinely a great hire.)",
    ctaPrimary: 'HIRE ME',
    ctaSecondary: "LET'S TALK",
    resumeLabel: '📄 DOWNLOAD CV',
    cvPickTitle: 'Hiring for a specific role? Grab the matching CV:',
    // Labels for the four contact tiles (icons + links are fixed in code).
    contacts: {
      emailCta: 'Email',
      phoneCta: 'Call',
      linkedinCta: 'Connect',
      githubCta: 'Follow',
    },
  },

  // --- Footer ----------------------------------------------------------------
  footer: {
    missionComplete: 'MISSION COMPLETE!',
    credit: 'created, directed & coded by the new Titan',
    copyright: 'All rights reserved. Built with React, GSAP, Framer Motion & Lenis.',
    // Sign-off lines above each waving Titan (order: Robin, Beast Boy, Cyborg,
    // Starfire, Raven).
    outro: [
      { who: 'Leader', line: 'Mission Complete.', color: '#1a8cff' },
      { who: 'Shifter', line: "Tell him he's awesome.", color: '#4fd84f' },
      { who: 'Machine', line: 'Booyah!', color: '#ffd21e' },
      { who: 'Star', line: 'Please return soon, friend.', color: '#ff3ea5' },
      { who: 'Sorceress', line: '…Whatever.', color: '#7b2ff7' },
    ],
  },
}

// -----------------------------------------------------------------------------
// Legacy named exports — derived from CONTENT so older imports keep working.
// New code should read content through `useContent()` (src/data/contentStore).
// -----------------------------------------------------------------------------
export const PROFILE = CONTENT.profile
export const ABOUT = CONTENT.about
export const SKILL_CREW = CONTENT.skills.crew
export const SKILLS = SKILL_CREW.flatMap((c) => c.skills)
export const FORMS = CONTENT.skills.forms
export const EXPERIENCE = CONTENT.experience.items
export const PROJECTS = CONTENT.projects.items
export const PERSONALITY = CONTENT.personality
export const OUTRO = CONTENT.footer.outro
export const NAV = CONTENT.nav.links

// Legacy — the old "My Superpowers" carousel (no longer mounted on the page).
// Kept so its component still imports cleanly.
export const POWERS = [
  { name: 'Frontend Development', badge: 'Frontend', power: 'Lightning Hands', icon: '⚡', color: 'tt-yellow', desc: 'React, Next.js & pixel-perfect UI at blazing speed.', tags: ['React', 'Next.js', 'Tailwind'] },
  { name: 'Backend Development', badge: 'Backend', power: 'Infinite Logic', icon: '🧠', color: 'tt-blue', desc: 'Async APIs, databases & systems that never blink.', tags: ['Python', 'FastAPI', 'PostgreSQL'] },
  { name: 'AI Engineering', badge: 'AI Engineering', power: 'Neural Brain', icon: '🤖', color: 'tt-purple', desc: 'LLMs, agents & retrieval pipelines that reason.', tags: ['LangGraph', 'RAG', 'ChromaDB'] },
  { name: 'Automation', badge: 'Automation', power: 'Clone Army', icon: '🌀', color: 'tt-green', desc: 'n8n, bots & workflows that do the boring parts.', tags: ['n8n', 'Webhooks', 'Workflows'] },
  { name: 'Correctness & Testing', badge: 'Problem Solver', power: 'Detective Mode', icon: '🔎', color: 'tt-pink', desc: 'Root-cause hunting, property tests & formal specs.', tags: ['pytest', 'Hypothesis', 'TLA+'] },
  { name: 'Fast Learning', badge: 'Fast Learner', power: 'XP Multiplier', icon: '📈', color: 'tt-yellow', desc: 'New stack? Consider it already learned.', tags: ['Any Stack', 'Docs', 'Speed'] },
]

export default CONTENT
