import { useEffect, useState } from 'react'
import { Leader, Shifter, Machine, Star, Sorceress } from './Characters'

/*
 * Swap-ready character.
 *
 * <Character id="robin" variant="giant" className="w-full" />
 *
 * `variant` selects which pre-processed size/framing to use — it must match
 * the usage group the container belongs to (see scripts/process_characters.py):
 *   - "giant"  — big decorative full-body art anchored to a section edge
 *                (Hero, Powers, About, Experience, Personality, Shift, Hire)
 *   - "footer" — the small sign-off lineup in FooterOutro
 *   - "badge"  — the corner mascot on project cards
 *   - "boot"   — the boot-loader icon (App.jsx)
 *
 * Renders /characters-processed/<variant>/<file> (WebP with a PNG fallback,
 * 2x srcset where available) the moment that file exists in /public. Falls
 * back to the original flat /characters/<file> if a processed variant
 * hasn't been generated for that id (e.g. still-unprocessed extras), then to
 * a hand-drawn SVG stand-in so the site never breaks with missing art.
 * See public/characters/README.md for filenames + specs.
 */
const MAP = {
  robin:    { file: 'robin.png',    alt: 'robin-hero.png',    Svg: Leader },
  beastboy: { file: 'beastboy.png',                           Svg: Shifter },
  cyborg:   { file: 'cyborg.png',                             Svg: Machine },
  starfire: { file: 'starfire.png',                           Svg: Star },
  raven:    { file: 'raven.png',                              Svg: Sorceress },
  'cyborg-tech':  { file: 'cyborg-tech.png',  alt: 'cyborg.png',   Svg: Machine },
  // Split halves for the extending-neck gag (CyborgNeck) in the Journey section.
  'cyborg-body':  { file: 'cyborg-body.png',                       Svg: Machine },
  'cyborg-head':  { file: 'cyborg-head.png',                       Svg: Machine },
  // Beast Boy's shape-shift forms, stacked by BeastBoyStack in the Skills section.
  'beastboy-cat':     { file: 'beastboy-cat.png',                  Svg: Shifter },
  'beastboy-gorilla': { file: 'beastboy-gorilla.png',              Svg: Shifter },
  'beastboy-lion':    { file: 'beastboy-lion.png',                 Svg: Shifter },
  // About "serious mode" — prefers robin-serious.png, else the normal robin.png
  'robin-serious': { file: 'robin-serious.png', alt: 'robin.png', Svg: Leader },
  team:     { file: 'team.png',                              Svg: null },
}

// Cache probe results so we don't re-request the same image on every mount.
const probeCache = new Map()

function probe(src) {
  if (probeCache.has(src)) return probeCache.get(src)
  const p = new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(src)
    img.onerror = () => resolve(null)
    img.src = src
  })
  probeCache.set(src, p)
  return p
}

// Build the {png1x, png2x, webp1x, webp2x} set for a processed variant, or
// null if the 1x PNG (the required baseline) doesn't exist for it.
async function resolveProcessed(variant, stem) {
  const dir = `/characters-processed/${variant}`
  const png1x = `${dir}/${stem}.png`
  const ok = await probe(png1x)
  if (!ok) return null
  const [png2xOk, webp1xOk, webp2xOk] = await Promise.all([
    probe(`${dir}/${stem}@2x.png`),
    probe(`${dir}/${stem}.webp`),
    probe(`${dir}/${stem}@2x.webp`),
  ])
  return {
    png1x,
    png2x: png2xOk ? `${dir}/${stem}@2x.png` : null,
    webp1x: webp1xOk ? `${dir}/${stem}.webp` : null,
    webp2x: webp2xOk ? `${dir}/${stem}@2x.webp` : null,
  }
}

export default function Character({ id, variant = 'giant', className = '', style, alt = '', float = false, ...rest }) {
  const conf = MAP[id] || MAP.robin
  const [resolved, setResolved] = useState(null) // { kind: 'processed', ...} | { kind: 'legacy', src }

  useEffect(() => {
    let alive = true
    const candidates = [conf.file, conf.alt].filter(Boolean)
    ;(async () => {
      for (const f of candidates) {
        const stem = f.replace(/\.png$/i, '')
        // eslint-disable-next-line no-await-in-loop
        const processed = await resolveProcessed(variant, stem)
        if (processed && alive) {
          setResolved({ kind: 'processed', ...processed })
          return
        }
      }
      // Legacy fallback: original flat /characters/<file>, for ids/variants
      // that haven't been through the size-normalization pass yet.
      for (const f of candidates) {
        const legacy = `/characters/${f}`
        // eslint-disable-next-line no-await-in-loop
        const ok = await probe(legacy)
        if (ok && alive) {
          setResolved({ kind: 'legacy', src: legacy })
          return
        }
      }
    })()
    return () => { alive = false }
  }, [conf.file, conf.alt, variant])

  if (resolved) {
    const imgProps = {
      alt: alt || id,
      draggable: false,
      className: `${className} ${float ? 'floaty' : ''} select-none`,
      style: { objectFit: 'contain', width: '100%', height: '100%', ...style },
      ...rest,
    }

    if (resolved.kind === 'legacy') {
      return <img src={resolved.src} {...imgProps} />
    }

    const pngSrcSet = resolved.png2x ? `${resolved.png1x} 1x, ${resolved.png2x} 2x` : undefined
    const webpSrcSet = resolved.webp1x
      ? (resolved.webp2x ? `${resolved.webp1x} 1x, ${resolved.webp2x} 2x` : resolved.webp1x)
      : null

    return (
      <picture style={{ display: 'contents' }}>
        {webpSrcSet && <source type="image/webp" srcSet={webpSrcSet} />}
        <img src={resolved.png1x} srcSet={pngSrcSet} {...imgProps} />
      </picture>
    )
  }

  const Svg = conf.Svg
  if (Svg) return <Svg className={className} style={style} />

  // team stand-in: a little line-up of the five SVGs until team.png is added
  return (
    <div className={`flex items-end justify-center gap-1 ${className}`} style={style}>
      {[Leader, Shifter, Machine, Star, Sorceress].map((C, i) => (
        <C key={i} className="w-1/5" />
      ))}
    </div>
  )
}
