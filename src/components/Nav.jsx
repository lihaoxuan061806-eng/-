import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
function scramble(el, text) {
  let f = 0
  const id = setInterval(() => {
    el.textContent = text.split('').map((c, i) =>
      f / 14 > i / text.length ? c : CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join('')
    if (++f > 14) { el.textContent = text; clearInterval(id) }
  }, 28)
}

export default function Nav({ scrollTo }) {
  const navRef = useRef()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, delay: 1.4, ease: 'power3.out' }
    )
  }, [])

  const links = [
    { label: 'Works', idx: 1 },
    { label: 'About', idx: 2 },
    { label: 'Contact', idx: 3 },
  ]

  return (
    <>
      <nav ref={navRef} style={{ opacity: 0 }}>
        <span className="logo">李皓轩 / LHX</span>
        <ul>
          {links.map(({ label, idx }) => (
            <li key={label}>
              <a href="#" onClick={e => { e.preventDefault(); scrollTo?.(idx) }}
                onMouseEnter={e => scramble(e.currentTarget, label)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <button className="hamburger-btn" onClick={() => setOpen(o => !o)} aria-label="菜单">
          <span className={open ? 'open' : ''} />
          <span className={open ? 'open' : ''} />
          <span className={open ? 'open' : ''} />
        </button>
      </nav>

      <div className={`side-menu${open ? ' side-menu--open' : ''}`}>
        <div className="side-menu-backdrop" onClick={() => setOpen(false)} />
        <div className="side-menu-panel">
          {['Top', 'Works', 'About', 'Contact'].map((label, i) => (
            <a key={label} href="#" className="side-menu-link"
              onClick={e => { e.preventDefault(); scrollTo?.(i); setOpen(false) }}
              onMouseEnter={e => scramble(e.currentTarget, label)}>
              {label}
            </a>
          ))}
          <div className="side-menu-info">
            <p>UI设计师 / 视觉设计师</p>
            <p>15652295539@qq.com</p>
          </div>
        </div>
      </div>
    </>
  )
}
