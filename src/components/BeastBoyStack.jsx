import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Character from './Character'

/*
 * Beast Boy's shape-shift line-up, stacked vertically to fill the left column
 * of the Skills section.
 *
 * Each form sits under the previous one and pops in as it scrolls into view, so
 * the tall empty lane beside the skills grid is filled with the whole roster
 * instead of a single small character parked at the bottom.
 *
 * Only forms whose art has been through the size pipeline are shown, so a
 * missing animal is silently skipped rather than rendering a placeholder.
 */

const FORMS = [
  { id: 'beastboy', label: 'BEAST BOY', color: '#4fd84f' },
  { id: 'beastboy-cat', label: 'KITTY!', color: '#7ec8ff' },
  { id: 'beastboy-gorilla', label: 'GORILLA!', color: '#ffd21e' },
  { id: 'beastboy-lion', label: 'ROAAAR!', color: '#ff8f3e' },
]

function probe(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })
}

export default function BeastBoyStack({ className = '' }) {
  const [forms, setForms] = useState([FORMS[0]])

  useEffect(() => {
    let alive = true
    ;(async () => {
      const ok = await Promise.all(
        FORMS.map((f) =>
          f.id === 'beastboy' ? true : probe(`/characters-processed/giant/${f.id}.png`),
        ),
      )
      if (alive) setForms(FORMS.filter((_, i) => ok[i]))
    })()
    return () => { alive = false }
  }, [])

  return (
    // The stack STRETCHES to the height its parent hands it (the Skills grid
    // defines that height) and splits it into equal slots — one per form. Beast
    // Boy lands in the top slot, the lion in the bottom slot, and every form
    // scales to fit its slot, so the line-up can never run past the grid it sits
    // beside no matter how tall the roster or the viewport gets.
    <div className={`flex flex-col ${className}`}>
      {forms.map((f) => (
        <motion.div
          key={f.id}
          initial={{ opacity: 0, scale: 0.7, x: -30, rotate: -8 }}
          whileInView={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, margin: '-12%' }}
          transition={{ type: 'spring', stiffness: 180, damping: 16 }}
          className="flex-1 min-h-0 flex flex-col items-center justify-center gap-1"
        >
          {/* min-h-0 lets this box actually shrink to its flex slot; the image
              is capped at 100% of that slot (never its intrinsic 800x1067), so
              it fits instead of blowing the column out. */}
          <div className="flex-1 min-h-0 w-full flex items-center justify-center">
            <Character
              id={f.id}
              variant="giant"
              style={{ width: 'auto', height: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>
          <span
            className="shrink-0 font-impact text-stroke-thin text-lg md:text-xl -rotate-2"
            style={{ color: f.color }}
          >
            {f.label}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
