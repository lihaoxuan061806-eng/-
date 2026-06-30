import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text3D, Center } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import WorkDetail from './WorkDetail'
import Beams from './Beams'
import LocalChromeMaterial from './LocalChromeMaterial'

const works = [
  { id: 1, title: 'APP 设计', cat: 'APP DESIGN', year: '2026', bg: '#1a0505', img: '/work-1.jpg', mockup: '/mockup.png', tags: ['页面落地', 'UI图标', '界面规范'],
    screens: [
      { label: '国际市场', bg: '#6b1a1a' },
      { label: 'Beijing China', bg: '#2a1a0a' },
      { label: 'Mount Fuji', bg: '#0a1a2a' },
      { label: 'London · Andes · Istanbul', bg: '#1a1a2a' },
      { label: 'Ao Nang Thailand', bg: '#0a2a1a' },
      { label: 'Standard Ticket', bg: '#1a0a0a' },
      { label: 'Rome · Tokyo', bg: '#0a0a1a' },
    ]
  },
  { id: 2, title: '品牌设计', cat: 'BRAND DESIGN', year: '2025', bg: '#0a0a14', img: '/work-2.jpg', mockup: '/brand-mockup.png', tags: ['品牌Logo', '品牌延展', '品牌规范'] },
  { id: 3, title: '活动宣传设计', cat: 'PUBLICITY DESIGN', year: '2025', bg: '#0a0d0a', img: '/h5-publicity.png', mockup: '/h5-publicity-mockup.png', tags: ['H5设计', '海报设计', '场景建模'] },
  { id: 4, title: 'IP 设计', cat: 'IP DESIGN', year: '2025', bg: '#0f0a0f', img: '/ip-design.png', mockup: '/ip-mockup.png', tags: ['形象设计', '营销海报', '人物周边'] },
]

const N = works.length

function LHXCenter() {
  const groupRef = useRef()
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4
  })
  return (
    <group ref={groupRef} position={[0.15, 0, 0]}>
      <Center>
        <Text3D font="/helvetiker_bold.typeface.json" size={0.82} height={0.22}
          bevelEnabled bevelThickness={0.01} bevelSize={0.008} bevelSegments={3}>
          LHX
          <LocalChromeMaterial />
        </Text3D>
      </Center>
    </group>
  )
}

function getCardStyle(i, activeIdx) {
  const diff = ((i - activeIdx + N) % N)
  const d = diff > N / 2 ? diff - N : diff
  const configs = {
    '-2': { x: -1050, z: -320, ry: 58,  scale: 0.48, opacity: 0 },
    '-1': { x: -680,  z: -200, ry: 46,  scale: 0.58, opacity: 0.6 },
    '0':  { x: 0,     z: 0,   ry: 0,   scale: 1,    opacity: 1 },
    '1':  { x: 680,   z: -200, ry: -46, scale: 0.58, opacity: 0.6 },
    '2':  { x: 1050,  z: -320, ry: -58, scale: 0.48, opacity: 0 },
  }
  return configs[Math.max(-2, Math.min(2, d)).toString()] || configs['-2']
}

function WorkPanel({ w, i, activeIdx, onOpen }) {
  const mockupRef = useRef()
  const panelRef = useRef()
  const isActive = i === activeIdx
  const { x, z, ry, scale, opacity } = getCardStyle(i, activeIdx)
  const mockupWidth = w.id === 3 ? '88%' : '55%'
  const activePanelShadow = '0 26px 120px rgba(0,0,0,0.82), 0 0 120px rgba(255,255,255,0.18), 0 0 44px rgba(255,255,255,0.14), inset 0 1.5px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.1)'
  const hoverPanelShadow = '0 42px 190px rgba(0,0,0,0.96), 0 22px 90px rgba(0,0,0,0.86), 0 0 150px rgba(255,255,255,0.24), 0 0 0 1px rgba(255,255,255,0.2), inset 0 2px 0 rgba(255,255,255,0.58), inset 0 -18px 50px rgba(0,0,0,0.72)'
  const inactivePanelShadow = '0 0 30px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.25)'

  useEffect(() => {
    if (mockupRef.current) gsap.set(mockupRef.current, { opacity: 0, scale: 0.6, xPercent: -50, yPercent: -50 })
  }, [])

  const handleEnter = () => {
    if (!isActive) return
    gsap.to(panelRef.current, { scale: 1.04, boxShadow: hoverPanelShadow, duration: 0.45, ease: 'power2.out' })
    panelRef.current.querySelector('.panel-overlay').style.opacity = '1'
    if (mockupRef.current) gsap.to(mockupRef.current, { opacity: 1, scale: 1, xPercent: -50, yPercent: -50, duration: 1.2, delay: 0.3, ease: 'back.out(1.2)' })
  }
  const handleLeave = () => {
    gsap.to(panelRef.current, { scale: 1, boxShadow: isActive ? activePanelShadow : inactivePanelShadow, duration: 0.45, ease: 'power2.out' })
    panelRef.current.querySelector('.panel-overlay').style.opacity = '0'
    if (mockupRef.current) {
      gsap.killTweensOf(mockupRef.current)
      gsap.to(mockupRef.current, { opacity: 0, scale: 0.6, xPercent: -50, yPercent: -50, duration: 0.4, ease: 'power2.in' })
    }
  }

  return (
    <div style={{
      position: 'absolute', width: 760, height: 460, marginLeft: -380, marginTop: -230,
      transform: `translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${scale})`,
      opacity, transition: 'transform 1s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.8s',
      transformStyle: 'preserve-3d',
    }}>
      <div ref={panelRef} onClick={() => isActive && onOpen(w)}
        onMouseEnter={handleEnter} onMouseLeave={handleLeave}
        style={{
          width: '100%', height: '100%', position: 'relative',
          cursor: isActive ? 'none' : 'default',
          borderRadius: '14px', overflow: 'hidden',
          background: w.img ? 'rgba(10,10,15,0.5)' : 'rgba(10,10,20,0.25)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          border: isActive ? '1.5px solid rgba(255,255,255,0.55)' : '1px solid rgba(255,255,255,0.18)',
          boxShadow: isActive ? activePanelShadow : inactivePanelShadow,
          transition: 'box-shadow 0.6s, border-color 0.6s',
        }}>
        {w.img
          ? <img src={w.img} alt={w.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', background: w.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: '5rem', fontWeight: 900, color: 'rgba(255,255,255,0.05)' }}>
              {String(w.id).padStart(2, '0')}
            </div>
        }
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, transparent 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '14px', boxShadow: 'inset 0 0 30px 8px rgba(0,0,0,0.78), inset 0 -48px 70px rgba(0,0,0,0.38)' }} />
        <div className="panel-overlay" style={{ position: 'absolute', inset: 0, opacity: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.24) 0%, rgba(0,0,0,0.42) 52%, rgba(0,0,0,0.72) 100%), radial-gradient(ellipse at center, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.3) 52%, rgba(0,0,0,0.66) 100%)', transition: 'opacity 0.4s ease', pointerEvents: 'none' }} />
      </div>
      {w.mockup && (
        <img ref={mockupRef} src={w.mockup} alt="mockup" style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'scale(0.6)',
          width: mockupWidth, height: 'auto', pointerEvents: 'none', opacity: 0,
          filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.7))',
        }} />
      )}
    </div>
  )
}

export default function WorksCarousel({ activeIdx, onSelect, onPhaseChange }) {
  const work = works[activeIdx]
  const [selected, setSelected] = useState(null)
  const [phase, setPhase] = useState(0)
  const lhxCanvasRef = useRef()

  const advancePhase = (p) => {
    setPhase(p)
    onPhaseChange?.(p)
  }

  const rippleRef = useRef()
  const ripple2Ref = useRef()
  const ripple3Ref = useRef()

  useEffect(() => {
    if (phase !== 0) return
    const canvas = lhxCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let startTime = 0
    let finished = false

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const drawPathProgress = (points, progress) => {
      if (!points.length || progress <= 0) return
      const closed = [...points, points[0]]
      const segments = []
      let total = 0
      for (let i = 0; i < closed.length - 1; i++) {
        const a = closed[i]
        const b = closed[i + 1]
        const length = Math.hypot(b[0] - a[0], b[1] - a[1])
        segments.push({ a, b, length })
        total += length
      }
      let remaining = total * Math.min(progress, 1)
      ctx.beginPath()
      ctx.moveTo(closed[0][0], closed[0][1])
      for (const segment of segments) {
        if (remaining <= 0) break
        const drawLength = Math.min(remaining, segment.length)
        const ratio = segment.length === 0 ? 0 : drawLength / segment.length
        ctx.lineTo(
          segment.a[0] + (segment.b[0] - segment.a[0]) * ratio,
          segment.a[1] + (segment.b[1] - segment.a[1]) * ratio,
        )
        remaining -= drawLength
      }
      ctx.stroke()
    }

    const tracePath = (points) => {
      ctx.beginPath()
      points.forEach(([x, y], index) => index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
      ctx.closePath()
    }

    const drawFullPath = (points) => {
      tracePath(points)
      ctx.stroke()
    }

    const fillFullPath = (points) => {
      tracePath(points)
      ctx.fill()
    }

    const draw = (now = 0) => {
      if (!startTime) startTime = now
      const elapsed = (now - startTime) / 1000
      const W = canvas.width
      const H = canvas.height
      const cx = W / 2
      const cy = H / 2
      const drawDuration = 4.6
      const progress = Math.min(elapsed / drawDuration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const pulse = Math.sin(elapsed * 2.4) * 0.08
      const scale = Math.min(W / 920, H / 520, 0.92)
      const originX = cx - 292 * scale
      const originY = cy - 90 * scale
      const letterPaths = [
        [[0, 0], [44, 0], [44, 138], [126, 138], [126, 180], [0, 180]],
        [[170, 0], [214, 0], [214, 70], [298, 70], [298, 0], [342, 0], [342, 180], [298, 180], [298, 110], [214, 110], [214, 180], [170, 180]],
        [[388, 0], [438, 0], [486, 70], [534, 0], [584, 0], [516, 90], [584, 180], [534, 180], [486, 110], [438, 180], [388, 180], [456, 90]],
      ]

      ctx.clearRect(0, 0, W, H)
      ctx.save()
      ctx.translate(originX, originY)
      ctx.scale(scale, scale)
      ctx.lineWidth = 3.2
      ctx.lineJoin = 'miter'
      ctx.lineCap = 'square'
      ctx.strokeStyle = `rgba(255,255,255,${0.28 + eased * 0.58 + pulse})`
      ctx.shadowColor = `rgba(255,255,255,${0.12 + eased * 0.18})`
      ctx.shadowBlur = 18
      letterPaths.forEach((points, index) => {
        const localProgress = Math.max(0, Math.min((eased * 1.2) - index * 0.12, 1))
        drawPathProgress(points, localProgress)
      })
      if (progress > 0.82) {
        ctx.globalAlpha = ((progress - 0.82) / 0.18) * 0.16
        letterPaths.forEach(drawFullPath)
      }
      if (progress > 0.94) {
        ctx.globalAlpha = Math.min((progress - 0.94) / 0.06, 1)
        ctx.shadowColor = 'rgba(255,255,255,0.36)'
        ctx.shadowBlur = 24
        const metalFill = ctx.createLinearGradient(originX, originY, originX + 584 * scale, originY + 180 * scale)
        metalFill.addColorStop(0, '#f7f8f8')
        metalFill.addColorStop(0.18, '#8c9196')
        metalFill.addColorStop(0.34, '#f1f3f4')
        metalFill.addColorStop(0.5, '#32363b')
        metalFill.addColorStop(0.68, '#dfe3e6')
        metalFill.addColorStop(0.86, '#777d83')
        metalFill.addColorStop(1, '#f7f8f8')
        ctx.fillStyle = metalFill
        letterPaths.forEach(fillFullPath)
      }
      ctx.restore()

      const guideAlpha = Math.min(eased, 1) * 0.08
      ctx.strokeStyle = `rgba(255,255,255,${guideAlpha})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cx - 390 * scale, cy)
      ctx.lineTo(cx + 390 * scale, cy)
      ctx.moveTo(cx, cy - 250 * scale)
      ctx.lineTo(cx, cy + 250 * scale)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(cx, cy, 250 * scale, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * eased)
      ctx.strokeStyle = `rgba(255,255,255,${0.05 + eased * 0.1})`
      ctx.stroke()

      raf = requestAnimationFrame(draw)
      if (!finished && elapsed > 6.1) {
        finished = true
        cancelAnimationFrame(raf)
        gsap.to(canvas, {
          opacity: 0, duration: 0.8, ease: 'power2.in',
          onStart: () => {
            if (rippleRef.current) {
              gsap.fromTo(rippleRef.current, { scale: 0, opacity: 1 }, { scale: 10, opacity: 0, duration: 2, ease: 'power2.out' })
              gsap.fromTo(ripple2Ref.current, { scale: 0, opacity: 0.7 }, { scale: 8, opacity: 0, duration: 2.4, delay: 0.2, ease: 'power2.out' })
              gsap.fromTo(ripple3Ref.current, { scale: 0, opacity: 0.4 }, { scale: 6, opacity: 0, duration: 2.8, delay: 0.45, ease: 'power2.out' })
            }
          },
          onComplete: () => advancePhase(1)
        })
      }
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 1) return
    const onWheel = (e) => {
      if (e.deltaY > 0) advancePhase(2)
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [phase])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000' }}>
      <div className="works-beams-backdrop">
        <Beams
          beamWidth={1.85}
          beamHeight={18}
          beamNumber={14}
          lightColor="#f2f2f2"
          speed={1.45}
          noiseIntensity={1.35}
          scale={0.18}
          rotation={-22}
        />
      </div>
      <canvas ref={lhxCanvasRef} style={{
        position: 'absolute', inset: 0, zIndex: 10,
        width: '100%', height: '100%',
        display: phase === 0 ? 'block' : 'none',
        pointerEvents: 'none',
      }} />

      {[rippleRef, ripple2Ref, ripple3Ref].map((ref, i) => (
        <div key={i} ref={ref} style={{
          position: 'absolute', zIndex: 11, pointerEvents: 'none',
          left: '50%', top: '50%',
          width: 120, height: 120,
          marginLeft: -60, marginTop: -60,
          borderRadius: '50%',
          border: `${1.5 - i * 0.4}px solid rgba(255,255,255,${0.6 - i * 0.15})`,
          opacity: 0, transform: 'scale(0)',
        }} />
      ))}

      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 30%, rgba(0,0,0,0.88) 100%)' }} />

      {phase >= 1 && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, opacity: 1, transition: 'opacity 1s ease' }}>
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.75} />
            <directionalLight position={[0, 3, 6]} intensity={1.6} />
            <directionalLight position={[-4, 2, 4]} intensity={0.8} color="#ffffff" />
            <pointLight position={[0, 1.2, 3.5]} intensity={1.1} distance={8} />
            <LHXCenter />
          </Canvas>
        </div>
      )}

      {phase === 1 && (
        <div style={{
          position: 'absolute', bottom: '4rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 5, pointerEvents: 'none', textAlign: 'center',
          animation: 'fadeUpDown 1.5s ease-in-out infinite',
        }}>
          <p className="meta" style={{ color: 'rgba(255,255,255,0.4)' }}>SCROLL TO EXPLORE</p>
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.2)', margin: '0.5rem auto 0' }} />
        </div>
      )}

      {phase >= 2 && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 800, height: 500,
            background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(255,255,255,0.07) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
        </div>
      )}

      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        perspective: '1400px', perspectiveOrigin: '50% 55%',
        opacity: phase >= 2 ? 1 : 0,
        transition: 'opacity 1s ease',
        pointerEvents: phase >= 2 ? 'auto' : 'none',
      }}>
        <div style={{ width: 0, height: 0, transformStyle: 'preserve-3d' }}>
          {works.map((w, i) => (
            <WorkPanel key={w.id} w={w} i={i} activeIdx={activeIdx} onOpen={setSelected} />
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, rgba(255,255,255,0.03) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 2 }} />

      {phase >= 2 && (
        <div style={{ position: 'absolute', bottom: '3rem', left: '8vw', pointerEvents: 'none', zIndex: 3 }}>
          <p className="meta" style={{ marginBottom: '0.5rem' }}>{work.cat} {work.year}</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem,3vw,3rem)', fontWeight: 900 }}>{work.title}</h2>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
            {work.tags.map(t => (
              <span key={t} style={{ fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.25rem 0.6rem', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)' }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      {phase >= 2 && (
        <div style={{ position: 'absolute', bottom: '3.2rem', right: '8vw', display: 'flex', gap: '0.5rem', alignItems: 'center', zIndex: 3 }}>
          {works.map((_, i) => (
            <div key={i} style={{ width: i === activeIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }} />
          ))}
        </div>
      )}

      {selected && <WorkDetail work={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}








