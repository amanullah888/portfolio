import { Leader, Shifter, Machine, Star, Sorceress } from './Characters'
import { PROCESSED, LEGACY } from '../data/assetManifest'

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
 * Which files exist for each id/variant is resolved from a build-time manifest
 * (src/data/assetManifest.js, produced by scripts/gen_asset_manifest.mjs), so we
 * render a <picture> with only the files that actually exist and let the BROWSER
 * download exactly one format + size. (The old runtime approach probed every
 * candidate URL with `new Image()`, which downloaded all four png/webp/@2x files
 * per character just to test existence — the whole point of <picture> defeated,
 * and megabytes wasted.) Falls back to the original flat /characters/<file> when
 * a processed variant is missing, then to a hand-drawn SVG stand-in so the site
 * never breaks with missing art.
 *
 * Pass `priority` for above-the-fold art (the hero) so it loads eagerly with
 * high fetch priority; everything else lazy-loads as it scrolls into view.
 */
const MAP = {
  robin:    { file: 'robin.png',    alt: 'robin-hero.png', label: 'Robin',    Svg: Leader },
  beastboy: { file: 'beastboy.png',                        label: 'Beast Boy', Svg: Shifter },
  cyborg:   { file: 'cyborg.png',                          label: 'Cyborg',    Svg: Machine },
  starfire: { file: 'starfire.png',                        label: 'Starfire',  Svg: Star },
  raven:    { file: 'raven.png',                           label: 'Raven',     Svg: Sorceress },
  'cyborg-tech':  { file: 'cyborg-tech.png',  alt: 'cyborg.png', label: 'Cyborg', Svg: Machine },
  // Split halves for the extending-neck gag (CyborgNeck) in the Journey section.
  'cyborg-body':  { file: 'cyborg-body.png', label: 'Cyborg', Svg: Machine },
  'cyborg-head':  { file: 'cyborg-head.png', label: 'Cyborg', Svg: Machine },
  // Beast Boy's shape-shift forms, stacked by BeastBoyStack in the Skills section.
  'beastboy-cat':     { file: 'beastboy-cat.png',     label: 'Beast Boy (cat)',     Svg: Shifter },
  'beastboy-gorilla': { file: 'beastboy-gorilla.png', label: 'Beast Boy (gorilla)', Svg: Shifter },
  'beastboy-lion':    { file: 'beastboy-lion.png',    label: 'Beast Boy (lion)',    Svg: Shifter },
  // About "serious mode" — prefers robin-serious.png, else the normal robin.png
  'robin-serious': { file: 'robin-serious.png', alt: 'robin.png', label: 'Robin', Svg: Leader },
  team:     { file: 'team.png', label: 'The Titans', Svg: null },
}

// Resolve the best available asset set for an id/variant from the manifest.
// Synchronous — no network probing.
function resolveAsset(conf, variant) {
  const candidates = [conf.file, conf.alt].filter(Boolean)
  for (const f of candidates) {
    const stem = f.replace(/\.png$/i, '')
    const p = PROCESSED[`${variant}/${stem}`]
    if (p) return { kind: 'processed', ...p }
  }
  for (const f of candidates) {
    if (LEGACY[f]) return { kind: 'legacy', src: LEGACY[f] }
  }
  return null
}

export default function Character({
  id,
  variant = 'giant',
  className = '',
  style,
  alt,
  float = false,
  priority = false,
  ...rest
}) {
  const conf = MAP[id] || MAP.robin
  const resolved = resolveAsset(conf, variant)

  if (resolved) {
    const imgProps = {
      alt: alt ?? conf.label ?? id,
      draggable: false,
      loading: priority ? 'eager' : 'lazy',
      decoding: 'async',
      // lowercase attribute name: React 18 passes it straight through to the DOM
      // (the camelCase `fetchPriority` prop is only mapped in React 19).
      ...(priority ? { fetchpriority: 'high' } : {}),
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
