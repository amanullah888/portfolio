// All real content for the portfolio, kept in one place.

export const PROFILE = {
  name: 'Aman Ullah Kazi',
  role: 'Full Stack Developer',
  tagline: 'I build awesome stuff that solves real-world problems.',
  location: 'Karachi, Pakistan',
  email: 'amanullahkazi8@gmail.com',
  phone: '+92 336 2354307',
  linkedin: 'https://linkedin.com/in/aman-ullah-kazi',
  github: 'https://github.com/amanullah888',
  resumeUrl: '/resume.pdf', // drop your PDF at public/resume.pdf
}

// Robin — "My Superpowers" (skills reframed as powers)
export const POWERS = [
  { name: 'Frontend Development', badge: 'Frontend', power: 'Lightning Hands', icon: '⚡', color: 'tt-yellow', desc: 'React, Next.js & pixel-perfect UI at blazing speed.', tags: ['React', 'Next.js', 'Tailwind'] },
  { name: 'Backend Development', badge: 'Backend', power: 'Infinite Logic', icon: '🧠', color: 'tt-blue', desc: 'Async APIs, databases & systems that never blink.', tags: ['Python', 'FastAPI', 'PostgreSQL'] },
  { name: 'AI Engineering', badge: 'AI Engineering', power: 'Neural Brain', icon: '🤖', color: 'tt-purple', desc: 'LLMs, agents & retrieval pipelines that reason.', tags: ['LangGraph', 'RAG', 'ChromaDB'] },
  { name: 'Automation', badge: 'Automation', power: 'Clone Army', icon: '🌀', color: 'tt-green', desc: 'n8n, bots & workflows that do the boring parts.', tags: ['n8n', 'Webhooks', 'Workflows'] },
  { name: 'Correctness & Testing', badge: 'Problem Solver', power: 'Detective Mode', icon: '🔎', color: 'tt-pink', desc: 'Root-cause hunting, property tests & formal specs.', tags: ['pytest', 'Hypothesis', 'TLA+'] },
  { name: 'Fast Learning', badge: 'Fast Learner', power: 'XP Multiplier', icon: '📈', color: 'tt-yellow', desc: 'New stack? Consider it already learned.', tags: ['Any Stack', 'Docs', 'Speed'] },
]

// Beast Boy — the real tech stack, grouped into "the crew".
//
// Each crew member is one of Beast Boy's shape-shift forms and stands for a
// skill CATEGORY. Selecting a character in the Skills section reveals that
// character's skills. Everything the section renders is driven from here.
//
// To change the section later, edit this array only:
//   - id      → which processed art to show (public/characters-processed/crew/<id>.png)
//   - name    → the character's name (e.g. "Kitty")
//   - role    → the skill category it represents
//   - vibe    → the short personality line under the name
//   - color   → accent used for the active glow / labels
//   - blurb   → one line shown when the character is selected
//   - skills  → the real skills in this category
//       { name, badge, color, desc }  (badge = emoji/letters shown on the tile)
//
// `SKILLS` is kept as a flat list (derived below) for anything that just wants
// every skill without the grouping.
export const SKILL_CREW = [
  {
    id: 'beastboy-cat',
    name: 'Kitty',
    role: 'Frontend & UI',
    vibe: 'Energy & Fun',
    color: '#7ec8ff',
    blurb: 'Fast, playful interfaces people actually enjoy using.',
    skills: [
      { name: 'React',        badge: '⚛️', color: '#61dafb', desc: 'Interactive, component-driven UIs at speed.' },
      { name: 'Next.js 15',   badge: 'N',   color: '#ffffff', desc: 'App Router, SSR & modern web apps.' },
      { name: 'TypeScript',   badge: 'TS',  color: '#3178c6', desc: 'Type-safe code that scales cleanly.' },
      { name: 'Tailwind',     badge: '🌊', color: '#38bdf8', desc: 'Utility-first styling, pixel-perfect fast.' },
      { name: 'Framer Motion',badge: '🎞️', color: '#e64bd0', desc: 'Motion & micro-interactions that feel alive.' },
      { name: 'React Flow',   badge: '🕸️', color: '#ff8f3e', desc: 'Node canvases for visual, graph-based UIs.' },
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
      { name: 'Python',     badge: '🐍', color: '#ffd43b', desc: 'Backend logic, scripting & automation.' },
      { name: 'FastAPI',    badge: '⚡', color: '#05998b', desc: 'Async, typed, production-ready APIs.' },
      { name: 'SQLAlchemy', badge: '🧱', color: '#c0392b', desc: 'ORM modeling with Pydantic-typed schemas.' },
      { name: 'PostgreSQL', badge: '🐘', color: '#4169e1', desc: 'Relational data, modeled to last.' },
      { name: 'Redis',      badge: '🧰', color: '#ff4438', desc: 'Caching & fast in-memory data paths.' },
      { name: 'Docker',     badge: '🐳', color: '#2496ed', desc: 'Containerized, reproducible everywhere.' },
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
      { name: 'LangGraph',   badge: '🕸️', color: '#7b2ff7', desc: 'Orchestrating multi-agent AI workflows.' },
      { name: 'LangChain',   badge: '🔗', color: '#1c8c6b', desc: 'Chains, tools & retrieval for LLM apps.' },
      { name: 'RAG',         badge: '📚', color: '#ff6f61', desc: 'Grounded answers via vector retrieval.' },
      { name: 'n8n',         badge: 'n8n', color: '#ea4b71', desc: 'Low-code automation & workflow pipelines.' },
      { name: 'dbt + DuckDB',badge: '🦆', color: '#fff100', desc: 'Analytics engineering & local warehouses.' },
      { name: 'AWS',         badge: '☁️', color: '#ff9900', desc: 'Cloud infra that ships to production.' },
      { name: 'pandas',      badge: '🐼', color: '#7c8cff', desc: 'Wrangling & analyzing data at scale.' },
      { name: 'PyTorch',     badge: '🔥', color: '#ee4c2c', desc: 'Training & fine-tuning deep models.' },
    ],
  },
]

// Flat list of every skill (derived) — kept for backwards compatibility.
export const SKILLS = SKILL_CREW.flatMap((c) => c.skills)

// Beast Boy — shape-shift forms
export const FORMS = [
  { label: 'Developer', emoji: '💻', color: '#4fd84f' },
  { label: 'UI Designer', emoji: '🎨', color: '#1a8cff' },
  { label: 'UX Designer', emoji: '🧭', color: '#ffd21e' },
  { label: 'ML Engineer', emoji: '📊', color: '#ff3ea5' },
  { label: 'AI Engineer', emoji: '🤖', color: '#7b2ff7' },
  { label: 'Automation Engineer', emoji: '🌀', color: '#4fd84f' },
  { label: 'Product Builder', emoji: '🚀', color: '#1a8cff' },
  { label: 'Founder', emoji: '👑', color: '#ffd21e' },
  { label: 'Full Stack Developer', emoji: '🦸', color: '#ff3ea5' },
]

// Robin — About / mission briefing
export const ABOUT = {
  intro:
    "I'm Aman Ullah Kazi — a Full-Stack developer (React + Python) and AI/systems builder who turns messy ideas into clean, working products. Lately that means LLM agents, RAG pipelines and backends that actually prove they're correct.",
  stickies: [
    { t: 'Who', v: 'Full-Stack dev who ships end-to-end — frontend, backend & everything glued between.' },
    { t: 'Enjoys', v: 'Building products from zero, wiring up AI agents, and killing repetitive work with automation.' },
    { t: 'Thinks', v: 'Break the problem down, ship the smallest working thing, then make it great.' },
    { t: 'Personality', v: 'Curious, relentless, allergic to boring UI. Runs on coffee & cartoons.' },
    { t: 'Solves', v: 'Detective mode ON. I chase the root cause, not the symptom.' },
  ],
}

// Cyborg — experience / mission logs (chronological; XP = the story rising)
export const EXPERIENCE = [
  {
    year: '2022',
    title: 'The Origin Story',
    org: 'FAST-NUCES · BS Artificial Intelligence',
    log: 'Started the AI degree at FAST — and started tutoring O/A-Level CS & Maths on the side. First lines of code compiled successfully.',
    xp: 20,
  },
  {
    year: '2023',
    title: 'Internship Deployed',
    org: 'Global e-Comm Services (subsidiary of TSL)',
    log: 'First real team. Supported web development, deployment and system configuration alongside cross-functional technical operations.',
    xp: 40,
  },
  {
    year: '2024',
    title: 'MatchIT',
    org: 'Founder & Full-Stack Dev · ongoing',
    log: 'Founded and built a sports community platform solo — Next.js + FastAPI + PostgreSQL, containerised and deployed. Schema to production, all mine.',
    xp: 65,
  },
  {
    year: '2026',
    title: 'Burky Flows',
    org: 'AI Automation Engineer · Contract',
    log: 'Shipped LLM automation systems in Python & n8n across OpenAI, Claude and Gemini — including a RAG-powered WhatsApp assistant with retrieval and memory.',
    xp: 85,
  },
  {
    year: '2026',
    title: 'Systems Era',
    org: 'Graduated · Building Flagship Systems',
    log: 'Graduated FAST and went deep — RaastTwin, an autonomous repair engine and an incident-autopsy engine. Correctness, observability and AI that proves itself.',
    xp: 100,
  },
]

// Projects — the team shows off.
//
// Curated from my current GitHub (github.com/amanullah888), newest and
// strongest first. Each card can carry two links:
//   repo → the source on GitHub   (rendered as a "Code" button)
//   live → a running demo         (rendered as a "Live" button)
// Leave a link out (or set it to '') when there isn't one — private repos and
// work-in-progress simply show a quiet "case file" chip instead of a dead button.
export const PROJECTS = [
  {
    name: 'RaastTwin',
    tagline: 'Deterministic instant-payment settlement twin.',
    desc: 'A discrete-event digital twin of an instant-payment network — banks → central switch → RTGS → a real double-entry ledger — built to prove financial correctness under adversarial, reproducible chaos. Invariants are cross-checked by property-based tests and a TLA+ formal spec; any failure replays and minimizes to a 3-payment counterexample.',
    stack: ['Python', 'FastAPI', 'TLA+', 'Hypothesis', 'Prometheus', 'Next.js'],
    accent: '#00e0ff',
    emoji: '🏦',
    guide: 'cyborg',
    repo: 'https://github.com/amanullah888/raasttwin',
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
    name: 'MatchIT',
    tagline: 'Sports community platform — founder & sole dev.',
    desc: 'Player discovery, match creation, court booking, tournament brackets, teams, chat and an escrow-style wallet for entry fees. Built end-to-end and solo, from schema design to production deploy. (Private repo.)',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'FastAPI', 'PostgreSQL', 'Docker'],
    accent: '#ff3ea5',
    emoji: '⚽',
    guide: 'robin',
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
  },
]

// Starfire — personality / softer side
export const PERSONALITY = {
  traits: ['Communication', 'Leadership', 'Teamwork', 'Curiosity', 'Helping people', 'Always learning'],
  funFacts: [
    { icon: '☕', t: 'Powered by snacks & way too much coffee.' },
    { icon: '📺', t: 'Loves cartoons — obviously.' },
    { icon: '🧩', t: 'Enjoys solving problems more than finding them.' },
    { icon: '🌙', t: 'Certified night owl.' },
    { icon: '✨', t: 'Dream: build products that actually make a difference.' },
  ],
}

// Footer — Titan sign-off lines
export const OUTRO = [
  { who: 'Leader', line: 'Mission Complete.', color: '#1a8cff' },
  { who: 'Shifter', line: "Tell him he's awesome.", color: '#4fd84f' },
  { who: 'Machine', line: 'Booyah!', color: '#ffd21e' },
  { who: 'Star', line: 'Please return soon, friend.', color: '#ff3ea5' },
  { who: 'Sorceress', line: '…Whatever.', color: '#7b2ff7' },
]

export const NAV = [
  { id: 'hero', label: 'Home' },
  // About + Powers now live in one merged opening section.
  { id: 'about', label: 'About & Powers' },
  { id: 'shift', label: 'Skills' },
  { id: 'experience', label: 'Journey' },
  { id: 'projects', label: 'Projects' },
  { id: 'personality', label: 'Fun' },
  { id: 'hire', label: 'Hire Me' },
]
