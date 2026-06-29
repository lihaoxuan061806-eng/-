import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'

export default function Lightbox({ work, onClose }) {
  const overlayRef = useRef()
  const contentRef = useRef()

  useEffect(() => {
    document.body.dataset.lightbox = 'open'
    gsap.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' }
    )
    gsap.fromTo(contentRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'power3.out' }
    )

    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      delete document.body.dataset.lightbox
    }
  }, [])

  const handleClose = () => {
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.3, ease: 'power2.in',
      onComplete: onClose
    })
  }

  return createPortal(
    <div ref={overlayRef} onClick={handleClose} onWheel={e => e.stopPropagation()} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.95)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      overflowY: 'auto', padding: '5vh 5vw',
      backdropFilter: 'blur(8px)',
    }}>
      {/* Close button */}
      <button onClick={handleClose} style={{
        position: 'fixed', top: '2rem', right: '2rem',
        background: 'none', border: '1px solid rgba(255,255,255,0.2)',
        color: 'white', cursor: 'none', padding: '0.5rem 1rem',
        fontFamily: 'var(--font-sans)', fontSize: '0.65rem',
        letterSpacing: '0.18em', textTransform: 'uppercase',
        zIndex: 1001, transition: 'border-color 0.3s',
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'white'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
      >
        ESC / Close
      </button>

      {/* Image */}
      <div ref={contentRef} onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '100%' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p className="meta" style={{ marginBottom: '0.5rem' }}>{work.category} — {work.year}</p>
          <h2 className="display" style={{ fontSize: 'clamp(1.5rem, 3vw, 3rem)' }}>{work.title}</h2>
        </div>
        <img
          src={work.img}
          alt={work.title}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
    </div>
  , document.body)
}
