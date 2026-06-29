import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import Lenis from 'lenis'
import Hero from './components/Hero'
import Works from './components/Works'
import About from './components/About'
import Contact from './components/Contact'
import Loader from './components/Loader'
import GooeyNav from './components/GooeyNav'

const pages = ['Home', 'Works', 'About', 'Contact']
const navItems = [
  { label: 'Home' },
  { label: 'Works' },
  { label: 'About' },
  { label: 'Contact' },
]

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(null)
  const cursorRef = useRef()
  const followerRef = useRef()
  const pageRef = useRef()

  const lenisRef = useRef()

  useEffect(() => {
    const onMove = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1 })
      gsap.to(followerRef.current, { x: e.clientX, y: e.clientY, duration: 0.25 })
      const el = e.target.closest('a, button, [data-hover]')
      if (el) {
        gsap.to(cursorRef.current, { scale: 3, mixBlendMode: 'difference', duration: 0.3 })
        gsap.to(followerRef.current, { scale: 1.8, opacity: 0.6, duration: 0.3 })
      } else {
        gsap.to(cursorRef.current, { scale: 1, duration: 0.3 })
        gsap.to(followerRef.current, { scale: 1, opacity: 1, duration: 0.3 })
      }
    }
    window.addEventListener('mousemove', onMove)

    // Lenis smooth scroll on page container
    const lenis = new Lenis({ wrapper: pageRef.current, lerp: 0.08, smoothWheel: true })
    lenisRef.current = lenis
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)

    return () => {
      window.removeEventListener('mousemove', onMove)
      lenis.destroy()
    }
  }, [])

  const navigate = (idx) => {
    if (idx === current) return
    gsap.to(pageRef.current, {
      opacity: 0, scale: 0.82, z: -300, rotationX: 4, filter: 'blur(12px)',
      duration: 0.55, ease: 'power3.in',
      onComplete: () => {
        setPrev(current)
        setCurrent(idx)
        if (pageRef.current) pageRef.current.scrollTop = 0
        lenisRef.current?.scrollTo(0, { immediate: true })
        lenisRef.current?.destroy()
        const lenis = new Lenis({ wrapper: pageRef.current, lerp: 0.08, smoothWheel: true })
        lenisRef.current = lenis
        const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }
        requestAnimationFrame(raf)
        gsap.fromTo(pageRef.current,
          { opacity: 0, scale: 1.18, z: 200, rotationX: -4, filter: 'blur(12px)' },
          { opacity: 1, scale: 1, z: 0, rotationX: 0, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out' }
        )
      }
    })
  }

  const renderPage = () => {
    switch (current) {
      case 0: return <Hero loaded={loaded} />
      case 1: return <Works />
      case 2: return <About />
      case 3: return <Contact />
      default: return <Hero />
    }
  }

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-follower" ref={followerRef} />

      {/* Nav */}
      <nav>
        <span className="logo">李皓轩 / LHX</span>
        <GooeyNav items={navItems} activeIndex={current} onSelect={navigate} />
      </nav>

      {/* Page container */}
      <div ref={pageRef} className="page-container">
        {renderPage()}
      </div>
    </>
  )
}
