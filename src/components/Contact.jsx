import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import LightRays from './LightRays'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function DotMatrix({ labels }) {
  const canvasRef = useRef()
  const dotsRef = useRef([])
  const rafRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const DOT_R = 1.5
    const CELL = 8

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
      initDots()
    }

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    const initDots = () => {
      const cols = Math.floor(W() / CELL)
      const rows = Math.floor(H() / CELL)
      const dots = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * CELL + CELL / 2
          const y = r * CELL + CELL / 2
          dots.push({ x, y, ox: x, oy: y, tx: x, ty: y })
        }
      }
      dotsRef.current = dots
    }

    const getTextPixels = (text) => {
      const w = W(), h = H()
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const c = off.getContext('2d')
      c.fillStyle = '#fff'
      c.font = `900 ${Math.min(h * 0.6, 130)}px Arial, sans-serif`
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.fillText(text, w / 2, h / 2)
      const data = c.getImageData(0, 0, w, h).data
      const pts = []
      for (let y = 0; y < h; y += CELL) {
        for (let x = 0; x < w; x += CELL) {
          const i = (y * w + x) * 4
          if (data[i + 3] > 128) pts.push({ x: x + CELL / 2, y: y + CELL / 2 })
        }
      }
      return pts
    }

    const animateTo = (text) => {
      const pts = getTextPixels(text)
      const dots = dotsRef.current
      dots.forEach((d, i) => {
        const target = pts[i % pts.length]
        gsap.to(d, { tx: target.x, ty: target.y, duration: 0.8, ease: 'power3.out', overwrite: true })
      })
    }

    const animateBack = () => {
      dotsRef.current.forEach(d => {
        gsap.to(d, { tx: d.ox, ty: d.oy, duration: 0.6, ease: 'power2.inOut', overwrite: true })
      })
    }

    const mouse = { x: -9999, y: -9999 }
    const REPEL_R = 55
    const REPEL_STRENGTH = 45

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onMouseLeaveCanvas = () => { mouse.x = -9999; mouse.y = -9999 }
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeaveCanvas)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      dotsRef.current.forEach(d => {
        d.x += (d.tx - d.x) * 0.1
        d.y += (d.ty - d.y) * 0.1

        const dx = d.x - mouse.x
        const dy = d.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        let rx = 0, ry = 0
        if (dist < REPEL_R && dist > 0) {
          const t = 1 - dist / REPEL_R
          const force = t * t * REPEL_STRENGTH
          // radial push
          rx = (dx / dist) * force
          ry = (dy / dist) * force
          // tangential twist (perpendicular, scaled by distance from center)
          const twist = force * 0.35
          rx += (-dy / dist) * twist
          ry += (dx / dist) * twist
        }

        const alpha = 0.45 + (dist < REPEL_R ? (1 - dist / REPEL_R) * 0.55 : 0)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.beginPath()
        ctx.arc(d.x + rx, d.y + ry, DOT_R, 0, Math.PI * 2)
        ctx.fill()
      })
      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    // expose methods via canvas dataset trick
    canvas._animateTo = animateTo
    canvas._animateBack = animateBack

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeaveCanvas)
    }
  }, [])

  return (
    <div style={{ width: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '220px', display: 'block' }} />
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 'clamp(2rem, 6vw, 6rem)',
        paddingTop: '2rem', flexWrap: 'wrap',
      }}>
        {labels.map(({ label, value, href }) => (
          <div key={label}
            onMouseEnter={() => canvasRef.current?._animateTo(label.toUpperCase())}
            onMouseLeave={() => canvasRef.current?._animateBack()}
            style={{ textAlign: 'center', cursor: 'default' }}
          >
            <p className="meta" style={{ marginBottom: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>{label}</p>
            {href
              ? <a href={href} style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>{value}</a>
              : <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)' }}>{value}</p>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Contact() {
  const topRef = useRef()
  const heroRef = useRef()
  const reflectRef = useRef()
  const glowRef = useRef()
  const r4 = useRef(), r5 = useRef(), r6 = useRef()

  const heroSectionRef = useRef()

  useGSAP(() => {
    gsap.set([topRef.current, heroRef.current, r4.current, r5.current, r6.current], { y: 50, opacity: 0 })
    gsap.set(reflectRef.current, { opacity: 0 })
    gsap.set(glowRef.current, { opacity: 0, scale: 0.8 })

    const tl = gsap.timeline({ delay: 0.2 })
    tl.to(glowRef.current, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' })
      .to(topRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.8')
      .to(heroRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
      .to(reflectRef.current, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .to([r4.current, r5.current, r6.current], { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }, '-=0.3')

    const st = { trigger: heroSectionRef.current, scroller: '.page-container', start: 'top top', end: 'bottom top', scrub: true }
    gsap.to(heroRef.current,    { y: -80, ease: 'none', scrollTrigger: st })
    gsap.to(reflectRef.current, { y:  60, ease: 'none', scrollTrigger: st })
    gsap.to(glowRef.current,    { scale: 0.6, opacity: 0, ease: 'none', scrollTrigger: st })
    gsap.to(topRef.current,     { y: -40, opacity: 0, ease: 'none', scrollTrigger: st })
  }, [])

  const channels = [
    { label: 'Email', value: '15652295539@qq.com', href: 'mailto:15652295539@qq.com' },
    { label: 'WeChat', value: 'Lhx70147014', href: null },
    { label: 'Phone', value: '+86 150 7230 0778', href: 'tel:+8615072300778' },
  ]

  return (
    <div style={{ width: '100vw', minHeight: '160vh', background: '#000' }}>

      <div ref={heroSectionRef} style={{
        width: '100%', height: '100vh', position: 'relative',
        background: 'radial-gradient(ellipse 80% 50% at 50% 55%, #3a3a3a 0%, #1a1a1a 35%, #000 70%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          lightSpread={0.6}
          rayLength={1.8}
          fadeDistance={0.9}
          raysSpeed={0.8}
          mouseInfluence={0.08}
          saturation={0.3}
        />
        <p ref={topRef} style={{
          position: 'absolute', top: '2.5rem',
          fontSize: '0.6rem', letterSpacing: '0.25em',
          color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
        }}>Let's Work Together</p>

        <div ref={glowRef} style={{
          position: 'absolute', width: '60vw', height: '18vh',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.18) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', lineHeight: 1, userSelect: 'none' }}>
          <div ref={heroRef} style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3rem, 9vw, 10rem)',
            fontWeight: 900, fontStyle: 'italic',
            letterSpacing: '-0.03em',
            color: '#fff',
            whiteSpace: 'nowrap', textTransform: 'uppercase',
            textShadow: '0 0 80px rgba(255,255,255,0.15)',
          }}>
            GET IN TOUCH.
          </div>
          <div ref={reflectRef} style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3rem, 9vw, 10rem)',
            fontWeight: 900, fontStyle: 'italic',
            letterSpacing: '-0.03em',
            color: 'rgba(255,255,255,0.3)',
            whiteSpace: 'nowrap', textTransform: 'uppercase',
            transform: 'scaleY(-1)', marginTop: '2px',
            maskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 60%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 60%)',
          }}>
            GET IN TOUCH.
          </div>
        </div>

        <a href="mailto:15652295539@qq.com" style={{
          position: 'absolute', bottom: '3.5rem',
          fontSize: '0.65rem', letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase',
          textDecoration: 'none', transition: 'color .3s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
        >
          15652295539@qq.com ↓        </a>
      </div>

      <div style={{ padding: '8vh 8vw 8vh' }}>
        <div ref={r4} style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '4rem', marginBottom: '6rem' }}>
          <p className="meta" style={{ marginBottom: '2rem' }}>Contact Channels</p>
          <DotMatrix labels={channels} />
        </div>

        <div ref={r5} style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '3rem', marginBottom: '4rem' }}>
          <p className="meta" style={{ marginBottom: '2rem' }}>Availability</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            {[
              { title: '接受项目类型', desc: 'APP UI设计 · 品牌视觉 · 活动宣传 · IP形象设计' },
              { title: '工作方式', desc: '远程协作 / 武汉本地 · 支持长期合作与短期项目' },
              { title: '响应时间', desc: '工作日 24 小时内回复，紧急项目可加急处理' },
              { title: '当前状态', desc: '开放接单中 · 欢迎洽谈合作' },
            ].map(({ title, desc }) => (
              <div key={title} className="availability-card">
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' }}>{title}</h3>
                <p style={{ fontSize: '0.7rem', color: 'var(--gray)', lineHeight: 2 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div ref={r6} style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>李皓轩 · UI & Brand Designer</p>
          <p className="meta">武汉 · 2026</p>
        </div>
      </div>
    </div>
  )
}



