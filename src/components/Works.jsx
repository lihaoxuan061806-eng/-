import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import WorkDetail from './WorkDetail'
import WorksCarousel from './WorksCarousel'

const works = [
  { id: 1, title: 'APP 设计', cat: 'APP DESIGN', year: '2026', bg: '#1a0505', img: '/work-1.png', mockup: '/mockup.png', tags: ['页面落地', 'UI图标', '界面规范'],
    screens: [
      { label: '国际市场', bg: '#6b1a1a' },
      { label: 'Beijing China', bg: '#2a1a0a' },
      { label: 'Mount Fuji', bg: '#0a1a2a' },
      { label: 'London · Andes', bg: '#1a1a2a' },
      { label: 'Ao Nang Thailand', bg: '#0a2a1a' },
      { label: 'Standard Ticket', bg: '#1a0a0a' },
      { label: 'Rome · Tokyo', bg: '#0a0a1a' },
    ]
  },
  { id: 2, title: '品牌设计', cat: 'BRAND DESIGN', year: '2025', bg: '#0a0a14', img: '/work-2.png', mockup: '/brand-mockup.png', tags: ['品牌Logo', '品牌延展', '品牌规范'] },
  { id: 3, title: '活动宣传设计', cat: 'PUBLICITY DESIGN', year: '2025', bg: '#0a0d0a', tags: ['H5设计', '海报设计', '场景建模'] },
  { id: 4, title: 'IP 设计', cat: 'IP DESIGN', year: '2025', bg: '#0f0a0f', img: '/ip-design.png', mockup: '/ip-mockup.png', tags: ['形象设计', '营销海报', '人物周边'] },
]

function WorkCard({ work, onClick, delay }) {
  const cardRef = useRef()
  const imgRef = useRef()
  const mockupRef = useRef()
  const animated = useRef(false)

  useEffect(() => {
    gsap.set(cardRef.current, { y: 60, opacity: 0 })
    if (mockupRef.current) gsap.set(mockupRef.current, { opacity: 0, scale: 0.6 })

    const check = () => {
      if (animated.current || !cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      if (rect.left < window.innerWidth * 0.95) {
        animated.current = true
        gsap.to(cardRef.current, { y: 0, opacity: 1, duration: 0.9, delay, ease: 'power3.out' })
      }
      if (imgRef.current) {
        const centerX = rect.left + rect.width / 2
        const progress = (centerX - window.innerWidth / 2) / window.innerWidth
        gsap.to(imgRef.current, { x: progress * -25, duration: 0.8, ease: 'power2.out' })
      }
    }
    window.addEventListener('wheel', check, { passive: true })
    check()
    return () => window.removeEventListener('wheel', check)
  }, [delay])

  const handleEnter = (e) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
    e.currentTarget.style.transform = 'scale(1.03)'
    e.currentTarget.querySelector('.card-overlay').style.opacity = '1'
    if (mockupRef.current) {
      gsap.to(mockupRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' })
    }
  }

  const handleLeave = (e) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
    e.currentTarget.style.transform = 'scale(1)'
    e.currentTarget.querySelector('.card-overlay').style.opacity = '0'
    if (mockupRef.current) {
      gsap.to(mockupRef.current, { opacity: 0, scale: 0.6, duration: 0.4, ease: 'power2.in' })
    }
  }

  return (
    <div ref={cardRef} onClick={() => onClick(work)} style={{
      cursor: 'none', position: 'relative', overflow: 'hidden',
      aspectRatio: '16/9', background: work.bg,
      border: '1px solid rgba(255,255,255,0.06)',
      transition: 'border-color 0.3s, transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
    }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div ref={imgRef} style={{ width: '112%', height: '112%', position: 'absolute', top: '-6%', left: '-6%' }}>
          {work.img
            ? <img src={work.img} alt={work.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: '4rem', fontWeight: 900, color: 'rgba(255,255,255,0.04)' }}>
                {String(work.id).padStart(2, '0')}
              </div>
          }
        </div>
        <div className="card-overlay" style={{
          position: 'absolute', inset: 0, opacity: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)',
          transition: 'opacity 0.4s ease',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '1.4rem',
        }}>
          <p className="meta" style={{ marginBottom: '0.3rem' }}>{work.cat} — {work.year}</p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700 }}>{work.title}</p>
          <p className="meta" style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.4)' }}>点击查看详情 →</p>
        </div>
      </div>

      {/* Floating mockup — only for APP design card */}
      {work.mockup && (
        <img ref={mockupRef} src={work.mockup} alt="mockup" style={{
          position: 'absolute', left: '50%', top: '10%',
          transform: 'translate(-50%, -50%)',
          width: '55%', height: 'auto', zIndex: 10,
          pointerEvents: 'none', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.7))',
        }} />
      )}
    </div>
  )
}

export default function Works() {
  const [selected, setSelected] = useState(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [carouselPhase, setCarouselPhase] = useState(0)
  const titleRef = useRef()
  const heroRef = useRef()
  const cooldown = useRef(false)
  const seenAll = useRef(false)
  const seenSet = useRef(new Set([0]))

  useEffect(() => {
    const onWheel = (e) => {
      if (carouselPhase < 2) return
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        if (rect.bottom <= 0) return
        if (rect.top >= 0) {
          if (seenAll.current && e.deltaY > 0) return
          e.preventDefault()
          if (cooldown.current) return
          cooldown.current = true
          setTimeout(() => { cooldown.current = false }, 700)
          setActiveIdx(i => {
            const next = (i + (e.deltaY > 0 ? 1 : -1) + 4) % 4
            seenSet.current.add(next)
            if (seenSet.current.size >= 4) seenAll.current = true
            return next
          })
        }
      }
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [carouselPhase])

  useEffect(() => {
    gsap.set(titleRef.current, { opacity: 0, y: 30 })
    const check = () => {
      const rect = titleRef.current?.getBoundingClientRect()
      if (rect && rect.top < window.innerHeight * 0.9) {
        gsap.to(titleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        window.removeEventListener('scroll', check)
      }
    }
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  return (
    <>
      <div ref={heroRef} style={{
        width: '100vw', height: '100vh', position: 'relative',
        background: '#000', overflow: 'hidden',
      }}>
        <WorksCarousel activeIdx={activeIdx} onSelect={setActiveIdx} onPhaseChange={setCarouselPhase} />
      </div>
      {selected && <WorkDetail work={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
