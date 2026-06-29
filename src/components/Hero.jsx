import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import ParticleBackground from './ParticleBackground'
import { motion } from 'motion/react'

gsap.registerPlugin(useGSAP)


export default function Hero({ loaded = false }) {
  const metaRef = useRef()
  const descRef = useRef()

  useGSAP(() => {
    gsap.fromTo([metaRef.current, descRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 0.9, stagger: 0.1, delay: 2.2, ease: 'power3.out' }
    )
  })

  return (
    <section className="panel" style={{ width: '100vw', height: '100vh', alignItems: 'flex-end', paddingBottom: '12vh', position: 'relative' }}>
      <ParticleBackground />
      <div style={{ width: '100%', position: 'relative', zIndex: 1 }}>
        <p className="meta" ref={metaRef} style={{ marginBottom: '2rem', opacity: 0 }}>
          UI Designer · Visual Designer · Portfolio 2026
        </p>
        <div style={{ lineHeight: 0.85 }}>
          {loaded && <motion.img
            src="/li-haoxuan-logo.png"
            alt="LI HAOXUAN"
            initial={{ filter: 'blur(10px)', opacity: 0, y: -50 }}
            animate={{ filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'], opacity: [0, 0.5, 1], y: [-50, 5, 0] }}
            transition={{ duration: 0.8, times: [0, 0.5, 1], delay: 0.12, ease: t => t }}
            className="hero-name-logo"
            style={{
              display: 'block', width: 'clamp(28rem, 58vw, 84rem)', maxWidth: '78vw',
              height: 'auto', objectFit: 'contain', objectPosition: 'left center',
              filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.16))',
            }}
          />}
        </div>
        <p ref={descRef} style={{
          position: 'absolute', right: '8vw', bottom: '14vh',
          maxWidth: '260px', fontSize: '0.78rem', lineHeight: 1.85,
          color: 'var(--gray-light)', fontWeight: 300, opacity: 0
        }}>
          武汉理工大学 · UI设计师 · 视觉设计师<br />
          原创作品 50+ · Figma / Ps / Ai / Ae / C4d / Aigc
        </p>
      </div>
    </section>
  )
}


