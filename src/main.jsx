import React from 'react'
import ReactDOM from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'
import { ContentProvider } from './data/contentStore'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* reducedMotion="user" makes every framer-motion animation honour the OS
        "reduce motion" setting — transform/layout animations are skipped for
        those users (Lenis smooth-scroll and the CSS keyframes already do the
        same), while everyone else gets the full animated experience. */}
    <MotionConfig reducedMotion="user">
      {/* ContentProvider layers saved copy edits over the defaults so every
          section can read text via useContent(). */}
      <ContentProvider>
        <App />
      </ContentProvider>
    </MotionConfig>
  </React.StrictMode>,
)
