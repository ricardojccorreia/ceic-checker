import { useState } from 'react'
import { BRAND, NAV, USEFUL_LINKS } from '../brand'

export default function Header({ current }: { current: string }) {
  const [open, setOpen] = useState(false) // dropdown "links úteis"
  const [menuOpen, setMenuOpen] = useState(false) // menu mobile

  const isActive = (href: string) => href === current || (href === '#/' && current === '')

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#/" aria-label={BRAND.name}>
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-dot" />
          </span>
          <span className="brand-text">
            <strong>CEIC</strong>
            <span>Check</span>
          </span>
        </a>

        <button
          className="menu-toggle"
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          ☰
        </button>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Navegação principal">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}

          <div
            className={`dropdown ${open ? 'open' : ''}`}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              type="button"
              className="dropdown-trigger"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              Links úteis <span className="caret">▾</span>
            </button>
            <div className="dropdown-menu">
              {USEFUL_LINKS.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label} <span className="ext" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
