// Original chibi superhero vector art — hand-built, not derived from any
// existing character artwork. Five archetype guides for the tour.

const S = { stroke: '#000', strokeWidth: 5, strokeLinejoin: 'round', strokeLinecap: 'round' }

function Base({ children, className = '', style }) {
  return (
    <svg viewBox="0 0 220 280" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="shine" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {children}
    </svg>
  )
}

/* ---------------- LEADER — masked strategist (blue / gold) ---------------- */
export function Leader({ className, style }) {
  return (
    <Base className={className} style={style}>
      {/* cape */}
      <path d="M70 120 Q40 190 60 250 L110 235 L160 250 Q180 190 150 120 Z" fill="#ffcf1e" {...S} />
      {/* body */}
      <path d="M78 150 Q75 240 110 250 Q145 240 142 150 Z" fill="#1a8cff" {...S} />
      <path d="M92 165 L110 205 L128 165 Z" fill="#0a3d91" {...S} />
      {/* arms */}
      <path d="M80 158 Q55 175 62 205" fill="none" {...S} stroke="#1a8cff" strokeWidth="18" />
      <path d="M140 158 Q168 168 172 138" fill="none" {...S} stroke="#1a8cff" strokeWidth="18" />
      <circle cx="176" cy="132" r="11" fill="#ffcf1e" {...S} />
      {/* head */}
      <circle cx="110" cy="92" r="52" fill="#ffe0bd" {...S} />
      {/* hair spikes */}
      <path d="M60 82 Q58 30 92 40 Q100 18 118 42 Q140 20 150 52 Q170 44 160 86 Q135 60 110 66 Q84 60 60 82 Z" fill="#111" {...S} />
      {/* mask */}
      <path d="M74 84 Q110 70 146 84 Q140 104 110 104 Q80 104 74 84 Z" fill="#0b0b12" {...S} />
      <ellipse cx="94" cy="88" rx="9" ry="7" fill="#fff" />
      <ellipse cx="126" cy="88" rx="9" ry="7" fill="#fff" />
      {/* grin */}
      <path d="M92 118 Q110 132 130 118" fill="none" {...S} />
      <circle cx="110" cy="92" r="52" fill="url(#shine)" />
    </Base>
  )
}

/* ---------------- SHIFTER — green shapeshifter ---------------- */
export function Shifter({ className, style }) {
  return (
    <Base className={className} style={style}>
      <path d="M80 150 Q76 245 110 252 Q144 245 140 150 Z" fill="#2a0a52" {...S} />
      <path d="M82 158 Q58 172 66 208" fill="none" {...S} stroke="#4fd84f" strokeWidth="18" />
      <path d="M138 158 Q164 170 158 206" fill="none" {...S} stroke="#4fd84f" strokeWidth="18" />
      {/* head */}
      <circle cx="110" cy="94" r="52" fill="#4fd84f" {...S} />
      {/* ears */}
      <path d="M66 60 L54 26 L92 54 Z" fill="#4fd84f" {...S} />
      <path d="M154 60 L166 26 L128 54 Z" fill="#4fd84f" {...S} />
      {/* hair swoop */}
      <path d="M62 70 Q80 40 120 50 Q150 56 156 84 Q130 66 100 70 Q78 72 62 90 Z" fill="#2f9e3a" {...S} />
      {/* eyes */}
      <ellipse cx="93" cy="92" rx="12" ry="14" fill="#fff" {...S} strokeWidth="4" />
      <ellipse cx="128" cy="92" rx="12" ry="14" fill="#fff" {...S} strokeWidth="4" />
      <circle cx="95" cy="94" r="5" fill="#111" />
      <circle cx="130" cy="94" r="5" fill="#111" />
      {/* fang grin */}
      <path d="M86 116 Q110 138 134 116" fill="none" {...S} />
      <path d="M100 126 L104 138 L108 126 Z" fill="#fff" {...S} strokeWidth="3" />
      <circle cx="110" cy="94" r="52" fill="url(#shine)" />
    </Base>
  )
}

/* ---------------- MACHINE — half-robot ---------------- */
export function Machine({ className, style }) {
  return (
    <Base className={className} style={style}>
      <path d="M74 150 Q72 245 110 252 Q150 245 146 150 Z" fill="#9aa7b3" {...S} />
      <path d="M110 155 L110 250" {...S} strokeWidth="4" />
      <circle cx="110" cy="185" r="10" fill="#00e0ff" {...S} strokeWidth="4" />
      <path d="M78 158 Q52 172 60 210" fill="none" {...S} stroke="#7c8896" strokeWidth="20" />
      <path d="M142 158 Q170 170 164 206" fill="none" {...S} stroke="#7c8896" strokeWidth="20" />
      {/* head: split human / machine */}
      <path d="M58 94 A52 52 0 0 1 110 42 L110 146 A52 52 0 0 1 58 94 Z" fill="#6b4a35" {...S} />
      <path d="M162 94 A52 52 0 0 0 110 42 L110 146 A52 52 0 0 0 162 94 Z" fill="#8f9aa6" {...S} />
      {/* human eye */}
      <ellipse cx="90" cy="90" rx="9" ry="11" fill="#fff" {...S} strokeWidth="3" />
      <circle cx="91" cy="92" r="4" fill="#111" />
      {/* robot eye */}
      <circle cx="132" cy="90" r="12" fill="#00e0ff" {...S} strokeWidth="4" />
      <circle cx="132" cy="90" r="4" fill="#fff" />
      {/* grin */}
      <path d="M84 116 Q110 134 136 114" fill="none" {...S} />
      <path d="M110 42 A52 52 0 0 1 162 94" fill="none" stroke="#00e0ff" strokeWidth="3" opacity="0.6" />
    </Base>
  )
}

/* ---------------- STAR — cheerful flyer ---------------- */
export function Star({ className, style }) {
  return (
    <Base className={className} style={style}>
      {/* long hair behind */}
      <path d="M60 90 Q40 190 70 250 L110 235 L150 250 Q180 190 160 90 Z" fill="#ff7a1a" {...S} />
      <path d="M82 150 Q78 235 110 244 Q142 235 138 150 Z" fill="#7b2ff7" {...S} />
      <path d="M84 158 Q60 172 68 206" fill="none" {...S} stroke="#ffb27a" strokeWidth="16" />
      <path d="M136 158 Q160 168 168 132" fill="none" {...S} stroke="#ffb27a" strokeWidth="16" />
      <circle cx="171" cy="126" r="9" fill="#ff3ea5" {...S} />
      {/* head */}
      <circle cx="110" cy="94" r="52" fill="#ffb27a" {...S} />
      {/* hair front */}
      <path d="M58 88 Q60 34 110 40 Q160 34 162 88 Q150 60 110 62 Q70 60 58 88 Z" fill="#ff7a1a" {...S} />
      {/* eyes (green) */}
      <ellipse cx="92" cy="92" rx="11" ry="13" fill="#eafff0" {...S} strokeWidth="3" />
      <ellipse cx="128" cy="92" rx="11" ry="13" fill="#eafff0" {...S} strokeWidth="3" />
      <circle cx="93" cy="94" r="6" fill="#2fbf6b" />
      <circle cx="129" cy="94" r="6" fill="#2fbf6b" />
      {/* smile */}
      <path d="M88 116 Q110 136 132 116" fill="none" {...S} />
      <circle cx="76" cy="116" r="6" fill="#ff3ea5" opacity="0.6" />
      <circle cx="144" cy="116" r="6" fill="#ff3ea5" opacity="0.6" />
      <circle cx="110" cy="94" r="52" fill="url(#shine)" />
    </Base>
  )
}

/* ---------------- SORCERESS — hooded mystic ---------------- */
export function Sorceress({ className, style }) {
  return (
    <Base className={className} style={style}>
      {/* cloak */}
      <path d="M52 150 Q40 250 110 258 Q180 250 168 150 Q150 120 110 120 Q70 120 52 150 Z" fill="#4b2fae" {...S} />
      <path d="M110 130 L110 250" {...S} strokeWidth="3" opacity="0.5" />
      {/* hood */}
      <path d="M56 96 Q56 40 110 40 Q164 40 164 96 Q164 118 140 120 L80 120 Q56 118 56 96 Z" fill="#3a2296" {...S} />
      {/* face shadow */}
      <path d="M78 96 Q78 66 110 66 Q142 66 142 96 Q142 118 110 120 Q78 118 78 96 Z" fill="#e9d7ff" {...S} />
      {/* gem */}
      <path d="M110 74 L116 82 L110 90 L104 82 Z" fill="#ff3ea5" {...S} strokeWidth="3" />
      {/* eyes calm */}
      <path d="M90 100 Q98 96 106 100" fill="none" {...S} strokeWidth="4" />
      <path d="M114 100 Q122 96 130 100" fill="none" {...S} strokeWidth="4" />
      <circle cx="98" cy="103" r="3" fill="#111" />
      <circle cx="122" cy="103" r="3" fill="#111" />
      {/* neutral mouth */}
      <path d="M100 114 L120 114" fill="none" {...S} strokeWidth="4" />
    </Base>
  )
}

export const CHARACTERS = { Leader, Shifter, Machine, Star, Sorceress }
