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
  { name: 'Frontend Development', power: 'Lightning Hands', icon: '⚡', color: 'tt-yellow', desc: 'React, Next.js & pixel-perfect UI at blazing speed.' },
  { name: 'Backend Development', power: 'Infinite Logic', icon: '🧠', color: 'tt-blue', desc: 'APIs, databases & systems that never blink.' },
  { name: 'AI Engineering', power: 'Neural Brain', icon: '🤖', color: 'tt-purple', desc: 'LLMs, automation & smart pipelines.' },
  { name: 'Automation', power: 'Clone Army', icon: '🌀', color: 'tt-green', desc: 'n8n, bots & workflows that do the boring parts.' },
  { name: 'Problem Solving', power: 'Detective Mode', icon: '🔎', color: 'tt-pink', desc: 'Debugging mysteries nobody else can crack.' },
  { name: 'Fast Learning', power: 'XP Multiplier', icon: '📈', color: 'tt-yellow', desc: 'New stack? Consider it already learned.' },
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
      { name: 'React',      badge: '⚛️', color: '#61dafb', desc: 'Interactive, component-driven UIs at speed.' },
      { name: 'Next.js',    badge: 'N',   color: '#ffffff', desc: 'Server-side rendering & modern web apps.' },
      { name: 'TypeScript', badge: 'TS',  color: '#3178c6', desc: 'Type-safe code that scales cleanly.' },
      { name: 'JavaScript', badge: 'JS',  color: '#f7df1e', desc: 'Bringing ideas to life, one function at a time.' },
      { name: 'Tailwind',   badge: '🌊', color: '#38bdf8', desc: 'Utility-first styling, pixel-perfect fast.' },
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
      { name: 'FastAPI',    badge: '⚡', color: '#05998b', desc: 'Fast, secure, production-ready APIs.' },
      { name: 'Node.js',    badge: '⬢',  color: '#83cd29', desc: 'Event-driven JavaScript on the server.' },
      { name: 'PostgreSQL', badge: '🐘', color: '#4169e1', desc: 'Relational data, modeled to last.' },
      { name: 'SQL',        badge: '🗄️', color: '#e38c00', desc: 'Querying & shaping data at the source.' },
    ],
  },
  {
    id: 'beastboy-lion',
    name: 'Roaaar',
    role: 'AI, Data & Cloud',
    vibe: 'Courage & Drive',
    color: '#ff8f3e',
    blurb: 'The bold stuff — AI pipelines, data and shipping to the cloud.',
    skills: [
      { name: 'Docker',      badge: '🐳', color: '#2496ed', desc: 'Containerized, reproducible everywhere.' },
      { name: 'AWS',         badge: '☁️', color: '#ff9900', desc: 'Cloud infra that ships to production.' },
      { name: 'Git & GitHub',badge: '🐙', color: '#f05032', desc: 'Version control & team workflows.' },
      { name: 'LangGraph',   badge: '🕸️', color: '#7b2ff7', desc: 'Orchestrating multi-agent AI workflows.' },
      { name: 'n8n',         badge: 'n8n', color: '#ea4b71', desc: 'Low-code automation & workflow pipelines.' },
      { name: 'pandas',      badge: '🐼', color: '#150458', desc: 'Wrangling & analyzing data at scale.' },
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
    "I'm Aman Ullah Kazi, a Full Stack Developer who loves turning messy ideas into clean, working products. I like building things people actually use — and making them fast, scalable and delightful.",
  stickies: [
    { t: 'Who', v: 'Full Stack Dev who ships end-to-end — frontend, backend & everything glued between.' },
    { t: 'Enjoys', v: 'Building products from zero, wiring up AI, and killing repetitive work with automation.' },
    { t: 'Thinks', v: 'Break the problem down, ship the smallest working thing, then make it great.' },
    { t: 'Personality', v: 'Curious, relentless, allergic to boring UI. Runs on coffee & cartoons.' },
    { t: 'Solves', v: 'Detective mode ON. I chase the root cause, not the symptom.' },
  ],
}

// Cyborg — experience / mission logs
export const EXPERIENCE = [
  {
    year: '2022',
    title: 'Got Into FAST',
    org: 'The Origin Story',
    log: 'Started the Computer Science journey at FAST. First lines of code compiled successfully.',
    xp: 20,
  },
  {
    year: '2023',
    title: 'Internship Deployed',
    org: 'Real Team, Real Shipping',
    log: 'Interned, collaborated with a team and shipped real features to real users.',
    xp: 45,
  },
  {
    year: '2024',
    title: 'Burky Flows',
    org: 'AI Automation & RAG',
    log: 'Built end-to-end Python + n8n automation pipelines and a RAG-powered WhatsApp assistant.',
    xp: 70,
  },
  {
    year: '2025',
    title: 'MatchIT',
    org: 'Founder & Sole Dev',
    log: 'Shipped a full sports community platform solo — schema to production deploy.',
    xp: 90,
  },
  {
    year: '2026',
    title: 'Teaching',
    org: 'Passing It On',
    log: 'Teaching what I have learned — turning hard-won lessons into other people\'s head starts.',
    xp: 100,
  },
]

// Projects — the team shows off (curated 6, real work from the résumé)
export const PROJECTS = [
  {
    name: 'MatchIT',
    tagline: 'Sports community platform — founder & sole dev.',
    desc: 'Player discovery, match creation, court booking, tournament brackets, teams, chat and an escrow-style wallet for entry fees. Built end-to-end, from schema to production deploy.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'FastAPI', 'PostgreSQL', 'Docker'],
    accent: '#4fd84f',
    emoji: '⚽',
    guide: 'robin',
    link: '#',
  },
  {
    name: 'AgentOps Studio',
    tagline: 'Build, run & observe multi-agent workflows.',
    desc: 'A React Flow canvas to compose sequential, parallel and conditional agent graphs, a Postgres-backed API that logs every run, and an eval dashboard for success rate, latency and token cost — plus an MCP hub for GitHub, Notion, Gmail & Slack.',
    stack: ['Next.js 15', 'TypeScript', 'FastAPI', 'PostgreSQL', 'LangGraph', 'AWS'],
    accent: '#7b2ff7',
    emoji: '🕹️',
    guide: 'cyborg',
    link: '#',
  },
  {
    name: 'Burky Flows',
    tagline: 'AI automation pipelines & a RAG assistant.',
    desc: 'End-to-end Python + n8n automations that pull from REST APIs and business tools, reshape the data and load it downstream on a schedule — plus a RAG-powered WhatsApp assistant with document retrieval and conversation memory.',
    stack: ['Python', 'n8n', 'RAG', 'OpenAI', 'Claude', 'Gemini'],
    accent: '#ff3ea5',
    emoji: '🌀',
    guide: 'beastboy',
    link: '#',
  },
  {
    name: 'LCR GPT',
    tagline: 'Regulatory reporting assistant (contributor).',
    desc: 'A production RAG system for PRA Liquidity Coverage Ratio reporting: parses PDF & XLSX regulatory sources, chunks and embeds the content into ChromaDB, and serves retrieval-backed answers.',
    stack: ['Python', 'FastAPI', 'LangChain', 'ChromaDB', 'Docker', 'AWS'],
    accent: '#1a8cff',
    emoji: '📊',
    guide: 'raven',
    link: '#',
  },
  {
    name: 'Retail Sales Intelligence',
    tagline: 'ETL + analytics dashboard.',
    desc: 'An end-to-end pipeline that cleans and aggregates raw transactions, runs RFM customer segmentation into five tiers, and surfaces revenue, product and regional trends through 10+ chart types with a live SQL query console.',
    stack: ['Python', 'pandas', 'SQLite', 'Plotly', 'Streamlit', 'Scikit-learn'],
    accent: '#ffd21e',
    emoji: '🛒',
    guide: 'starfire',
    link: '#',
  },
  {
    name: 'AI-Assisted Radiology',
    tagline: 'Final year project · Ziauddin Hospital.',
    desc: 'A deep-learning pipeline for anomaly detection on clinical radiology images: cleaning, normalization and augmentation of DICOM datasets, then fine-tuning pre-trained CNNs for diagnostic-error highlighting.',
    stack: ['Python', 'PyTorch', 'TensorFlow', 'CNNs', 'OpenCV', 'DICOM'],
    accent: '#00e0ff',
    emoji: '🧠',
    guide: 'cyborg',
    link: '#',
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
