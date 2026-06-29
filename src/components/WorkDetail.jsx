import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'

function ScreenCard({ src, index }) {
  const ref = useRef()
  return (
    <div ref={ref}
      onMouseEnter={() => gsap.to(ref.current, { y: -14, scale: 1.04, duration: 0.4, ease: 'power2.out' })}
      onMouseLeave={() => gsap.to(ref.current, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' })}
      style={{ borderRadius: '8px', overflow: 'hidden', cursor: 'none', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <img src={src} alt={`screen-${index}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
    </div>
  )
}

export default function WorkDetail({ work, onClose }) {
  const overlayRef = useRef()
  const headerRef = useRef()
  const imgRef = useRef()
  const tagsRef = useRef()
  const screensRef = useRef()

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
    gsap.fromTo(headerRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: 'power3.out' })
    gsap.fromTo(imgRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.35, ease: 'power3.out' })
    if (tagsRef.current) {
      gsap.fromTo(Array.from(tagsRef.current.children), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.6, stagger: 0.07, ease: 'power2.out' })
    }
    if (screensRef.current) {
      gsap.fromTo(Array.from(screensRef.current.children), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.75, stagger: 0.06, ease: 'power3.out' })
    }

    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [])

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: onClose })
  }

  return createPortal(
    <div ref={overlayRef} onWheel={e => e.stopPropagation()} style={{
      position: 'fixed', inset: 0, zIndex: 1000, background: '#000', overflowY: 'auto',
    }}>
      <div ref={headerRef} style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.8rem 8vw', borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)'
      }}>
        <div>
          <p className="meta" style={{ marginBottom: '0.3rem' }}>{work.cat} — {work.year}</p>
          <h2 className="display" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2.2rem)' }}>{work.title}</h2>
        </div>
        <button onClick={handleClose} style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.2)',
          color: 'white', cursor: 'none', padding: '0.5rem 1.2rem',
          fontFamily: 'var(--font-sans)', fontSize: '0.6rem',
          letterSpacing: '0.18em', textTransform: 'uppercase', transition: 'border-color 0.3s',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'white'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
        >← Back</button>
      </div>

      <div style={{ padding: '6vh 8vw 10vh', maxWidth: '1100px', margin: '0 auto' }}>
        <div ref={imgRef} style={{ overflow: 'hidden', borderRadius: '8px' }}
          onMouseEnter={e => gsap.to(e.currentTarget.querySelector('img, div'), { y: -12, scale: 1.03, duration: 0.5, ease: 'power2.out' })}
          onMouseLeave={e => gsap.to(e.currentTarget.querySelector('img, div'), { y: 0, scale: 1, duration: 0.5, ease: 'power2.out' })}
        >
          {work.img
            ? <img src={work.img} alt={work.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
            : <div style={{
                width: '100%', aspectRatio: '16/9', background: work.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-serif)', fontSize: '8rem',
                color: 'rgba(255,255,255,0.04)', fontWeight: 900
              }}>{String(work.id).padStart(2, '0')}</div>
          }
        </div>

        <div ref={tagsRef} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          {work.tags.map(t => (
            <span key={t} style={{
              fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '0.3rem 0.7rem', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.5)'
            }}>{t}</span>
          ))}
        </div>

        {work.id === 1 && (
          <div ref={screensRef} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem', marginTop: '3rem',
          }}>
            {Array.from({length: 13}, (_, i) => (
              <ScreenCard key={i} src={`/work-1-${i+1}.png`} index={i+1} />
            ))}
          </div>
        )}
      </div>
    </div>
  , document.body)
}
