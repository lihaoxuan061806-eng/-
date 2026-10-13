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
    <div ref={overlayRef} className="loading-overlay">
      <div className="loading-atmosphere" aria-hidden="true" />

      <header className="loading-topline">
        <span className="loading-brand">李皓轩 <i>/</i> DESIGN PORTFOLIO</span>
        <span className="loading-edition">SELECTED WORKS <i>2026</i></span>
      </header>

      <main className="loading-center">
        <span className="loading-kicker">VISUAL DESIGNER</span>
        <div ref={logoRef} className="loading-logo">LHX</div>
        <span className="loading-caption">A PORTFOLIO BY LI HAOXUAN</span>
      </main>

      <div ref={railRef} className="loading-progress">
        <div className="loading-progress-labels">
          <span>LOADING EXPERIENCE</span>
          <span className="loading-percentage"><span ref={numRef}>00</span><i>%</i></span>
        </div>
        <div className="loading-track">
          <div ref={barRef} className="loading-fill" />
        </div>
      </div>
    </div>
  )
}
