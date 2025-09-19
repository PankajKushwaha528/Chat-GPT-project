import React from 'react'
import ThemeToggle from './ThemeToggle'

const Header = () => {
  return (
    <div className="app-header">
      <div className="app-header__inner">
        <ThemeToggle />
      </div>
    </div>
  )
}

export default Header
