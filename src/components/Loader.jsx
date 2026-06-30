import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Loader({ onDone }) {
  const overlayRef = useRef()
  const logoRef = useRef()
  const numRef = useRef()
  const barRef = useRef()
  const railRef = useRef()

  useEffect(() => {
    const counter = { value: 0 }
    const tl = gsap.timeline({ onComplete: onDone })

    gsap.set(barRef.current, { scaleX: 0 })
    gsap.set([logoRef.current, numRef.current, railRef.current], { opacity: 0, y: 18 })

    tl.to([logoRef.current, numRef.current, railRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: 'power3.out',
    })
      .to(counter, {
        value: 100,
        duration: 1.9,
        ease: 'power2.inOut',
        onUpdate: () => {
          numRef.current.textContent = String(Math.round(counter.value)).padStart(2, '0')
        },
      }, '-=0.15')
      .to(barRef.current, {
        scaleX: 1,
        duration: 1.9,
        ease: 'power2.inOut',
      }, '<')
      .to(logoRef.current, {
        letterSpacing: '0.42em',
        opacity: 0.82,
        duration: 0.55,
        ease: 'power2.out',
      }, '-=0.25')
      .to([logoRef.current, numRef.current, railRef.current], {
        opacity: 0,
        y: -18,
        duration: 0.42,
        stagger: 0.04,
        ease: 'power2.in',
      }, '+=0.18')
      .to(overlayRef.current, {
        yPercent: -100,
        duration: 0.78,
        ease: 'power4.inOut',
      }, '-=0.06')

    return () => tl.kill()
  }, [onDone])

  return (
    <div ref={overlayRef} className="loading-overlay" style={{
      position: 'fixed', inset: 0, background: '#050505',
      zIndex: 9999, display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end', padding: '7vh 8vw',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)',
        backgroundSize: '46px 46px',
        opacity: 0.45,
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.08), transparent 32%), radial-gradient(circle at 50% 100%, rgba(255,255,255,0.08), transparent 38%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', marginBottom: '1.1rem' }}>
          <div ref={logoRef} style={{
            fontFamily: "Georgia, 'Times New Roman', 'Songti SC', 'STSong', serif", fontSize: 'clamp(2.2rem, 7vw, 6.5rem)',
            fontWeight: 900, lineHeight: 0.86, letterSpacing: '0.08em', color: '#fff',
          }}>
            LHX
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.58rem', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.44)', marginBottom: '0.5rem' }}>
              LOADING
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '0.35rem' }}>
              <span ref={numRef} style={{ fontSize: 'clamp(2rem, 6vw, 5.4rem)', fontWeight: 300, lineHeight: 0.9 }}>00</span>
              <span style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', color: 'rgba(255,255,255,0.55)' }}>%</span>
            </div>
          </div>
        </div>

        <div ref={railRef} style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.14)', overflow: 'hidden' }}>
          <div ref={barRef} style={{ width: '100%', height: '100%', background: '#fff', transformOrigin: 'left center' }} />
        </div>
      </div>
    </div>
  )
}
