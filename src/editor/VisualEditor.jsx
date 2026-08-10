import { useEffect } from 'react'
import { EditorProvider, useEditor } from './EditorContext'
import Overlay from './Overlay'
import Inspector from './Inspector'
import Toolbar from './Toolbar'
import './editor.css'

// Global shortcuts: Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z or Ctrl+Y redo,
// Ctrl/Cmd+S save, Esc deselect / exit.
function Shortcuts() {
  const ed = useEditor()
  useEffect(() => {
    if (!ed.enabled) return
    const onKey = (e) => {
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        e.shiftKey ? ed.redo() : ed.undo()
      } else if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        ed.redo()
      } else if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault()
        ed.save()
      } else if (e.key === 'Escape') {
        if (ed.selectedId) ed.setSelectedId(null)
        else ed.setEnabled(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ed])
  return null
}

/**
 * VisualEditor — the whole Design Mode system. Mount once, near the root, and
 * pass the Lenis instance so smooth-scroll can be paused while editing.
 * Renders nothing visible until Design Mode is toggled on.
 */
export default function VisualEditor({ lenis }) {
  return (
    <EditorProvider lenis={lenis}>
      <Shortcuts />
      <Toolbar />
      <Overlay />
      <Inspector />
    </EditorProvider>
  )
}
