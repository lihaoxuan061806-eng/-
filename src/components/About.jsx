import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function useFlyIn(ref, delay = 0) {
  useGSAP(() => {
    if (!ref.current) return
    gsap.set(ref.current, { y: 50, opacity: 0 })
    gsap.to(ref.current, { y: 0, opacity: 1, duration: 0.9, delay: 0.2 + delay, ease: 'power3.out' })
  }, { dependencies: [] })
}

const philosophyItems = [
  { num: '01', title: '以用户为中心', desc: '设计的本质是解决问题。每一个视觉决策都应服务于用户体验，而非单纯的美学追求。' },
  { num: '02', title: '克制与留白', desc: '好的设计懂得取舍。留白不是空白，而是呼吸感与节奏感的体现，让视觉焦点更加突出。' },
  { num: '03', title: '细节决定品质', desc: '从字间距到色彩层次，每一个微小的细节都在无声地传递品牌的专业度与温度。' },
]

// SVG noise filter for film grain
const NoiseFilter = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
      <feBlend in="SourceGraphic" mode="multiply" />
    </filter>
  </svg>
)

export default function About() {
  const r1 = useRef(), r2 = useRef(), r3 = useRef(), r4 = useRef(), r6 = useRef()
  const philoRef = useRef()
  const philoItemRefs = useRef([])
  useFlyIn(r1, 0)
  useFlyIn(r3, 0.1)
  useFlyIn(r2, 0.55)
  useFlyIn(r4, 0.3)
  useFlyIn(r6, 0.5)

  useGSAP(() => {
    const items = philoItemRefs.current.filter(Boolean)
    gsap.set(items, { y: 40, opacity: 0 })
    gsap.to(items, {
      y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: philoRef.current, scroller: '.page-container', start: 'top 80%', once: true },
    })
  }, { dependencies: [] })

  return (
    <div style={{ width: '100vw', minHeight: '180vh' }}>
      <NoiseFilter />

      {/* Hero — full viewport, photo bg + overlapping panels */}
      <div ref={r1} style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>

        {/* Full-bleed photo */}
        <img src="/照片.png" alt="李皓轩" style={{
          position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          height: '100%', width: 'auto',
          objectFit: 'cover', objectPosition: 'top',
          filter: 'grayscale(100%) contrast(1.05)',
          zIndex: 0,
        }} />
        {/* grain overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.07\'/%3E%3C/svg%3E")',
          backgroundSize: '180px 180px', mixBlendMode: 'overlay', opacity: 0.5,
        }} />

        {/* LEFT panel: white shape — aspect-ratio safe using px-independent clip */}
        <div ref={r2} style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '40%', zIndex: 2,
          background: '#fff',
          clipPath: 'polygon(0 0, 75% 0, 75% 15%, 100% 15%, 100% 75%, 75% 75%, 75% 100%, 0 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 6% 0 8vw',
          boxShadow: '6px 0 0 #fff',
        }}>
          <p className="meta" style={{ color: 'rgba(0,0,0,0.58)', marginBottom: '1.5rem' }}>About Me</p>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4.5vw, 5.5rem)',
            fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.03em',
            color: '#000', marginBottom: '1.5rem',
          }}>
            李皓轩<br />
            <span style={{ fontSize: '0.45em', fontWeight: 400, letterSpacing: '0.08em', color: 'rgba(0,0,0,0.58)' }}>LI HAOXUAN</span>
          </h2>
          <p style={{ fontSize: '0.65rem', color: 'rgba(0,0,0,0.56)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2rem' }}>
            UI Designer · Visual Designer · Portfolio 2026
          </p>
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.16)', paddingTop: '1.5rem' }}>
            {[['学校','武汉理工大学'],['原创作品','50+'],['出生','2006-06-18']].map(([k,v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '0.58rem', color: 'rgba(0,0,0,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{k}</span>
                <span style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.86)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT dark info panel */}
        <div ref={r3} style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: '22%', zIndex: 2,
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(8px)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 2.5vw',
        }}>
          <p className="meta" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', letterSpacing: '0.2em' }}>ABSTRACT</p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.9, marginBottom: '2rem' }}>
            专注于品牌视觉、APP UI与IP形象设计，致力于将用户体验与美学价值融为一体。
          </p>
          {[
            { label: 'APP DESIGN', sub: '2026 · 页面落地 · UI图标', thumb: '/thumb-app-design.png' },
            { label: 'BRAND DESIGN', sub: '2025 · 品牌Logo · 延展', thumb: '/thumb-brand-design.png' },
            { label: 'IP DESIGN', sub: '2025 · 形象设计 · 周边', thumb: '/thumb-ip-design.png' },
          ].map(({ label, sub, thumb }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ width: 32, height: 32, borderRadius: '2px', flexShrink: 0, overflow: 'hidden', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <img src={thumb} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: '#fff', textTransform: 'uppercase' }}>{label}</p>
                <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem' }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Design Philosophy */}
      <div ref={philoRef} style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '4rem', marginBottom: '6rem', padding: '4rem 8vw 0' }}>
        <p className="meta" style={{ marginBottom: '2rem', color: 'rgba(255,255,255,0.25)' }}>Design Philosophy</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
          {philosophyItems.map(({ num, title, desc }, i) => (
            <div key={num} ref={el => philoItemRefs.current[i] = el} className="philosophy-card">
              <p className="meta" style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.25)' }}>{num}</p>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.8rem', color: '#fff' }}>{title}</h3>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', lineHeight: 2 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Awards */}
      <div ref={r6} style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '3rem', marginBottom: '4rem', padding: '3rem 8vw 0' }}>
        <p className="meta" style={{ marginBottom: '2rem', color: 'rgba(255,255,255,0.25)' }}>Awards & Recognition</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0' }}>
          {[
            { year: '2025', title: '全国大学生广告艺术大赛', award: '省级优秀奖' },
            { year: '2025', title: '武汉理工大学设计展', award: '优秀作品展示' },
            { year: '2024', title: '品牌设计实战项目', award: '客户满意度 98%' },
            { year: '2024', title: '移动端UI设计专项', award: '完成 12+ 项目' },
          ].map(({ year, title, award }) => (
            <div key={title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <p className="meta" style={{ marginBottom: '0.3rem', color: 'rgba(255,255,255,0.25)' }}>{year}</p>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>{title}</p>
              </div>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>{award}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>武汉理工大学 · 视觉传达设计</p>
        <p className="meta" style={{ color: 'rgba(255,255,255,0.25)' }}>2006 — Present</p>
      </div>
    </div>
  )
}


