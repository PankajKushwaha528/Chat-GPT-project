import React, { useEffect, useState } from 'react'

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(() => {
    try {
      const stored = localStorage.getItem('theme')
      if (stored) return stored === 'light'
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
    } catch {
      return false
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('light', isLight)
    try { localStorage.setItem('theme', isLight ? 'light' : 'dark') } catch {}
  }, [isLight])

  return (
    <button
      aria-pressed={isLight}
      className="btn theme-toggle"
      onClick={() => setIsLight((v) => !v)}
      title="Toggle theme"
    >
      {isLight ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}

export default ThemeToggle
