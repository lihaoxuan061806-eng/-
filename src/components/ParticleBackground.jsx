import { useEffect, useRef } from 'react'

const R = Math.PI * (1 + Math.sqrt(5))

function buildGlobe(count, radius) {
  return Array.from({ length: count }, (_, i) => {
    const phi = Math.acos(1 - 2 * (i + 0.5) / count)
    const theta = R * i
    return { x: radius * Math.sin(phi) * Math.cos(theta), y: radius * Math.sin(phi) * Math.sin(theta), z: radius * Math.cos(phi) }
  })
}

function buildTetra(count, radius) {
  // 4 faces of a tetrahedron, distribute points evenly
  const verts = [
    [0, -1, -1/Math.sqrt(2)], [0, 1, -1/Math.sqrt(2)],
    [-1, 0, 1/Math.sqrt(2)], [1, 0, 1/Math.sqrt(2)],
  ].map(([x,y,z]) => { const l = Math.sqrt(x*x+y*y+z*z); return [x/l*radius, y/l*radius, z/l*radius] })
  const faces = [[0,1,2],[0,1,3],[0,2,3],[1,2,3]]
  return Array.from({ length: count }, (_, i) => {
    const face = faces[i % 4]
    const t = Math.random(), s = Math.random() * (1 - t)
    const u = 1 - t - s
    const [a,b,c] = face
    return {
      x: verts[a][0]*t + verts[b][0]*s + verts[c][0]*u,
      y: verts[a][1]*t + verts[b][1]*s + verts[c][1]*u,
      z: verts[a][2]*t + verts[b][2]*s + verts[c][2]*u,
    }
  })
}

function buildCube(count, radius) {
  const faces = [
    [1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]
  ]
  return Array.from({ length: count }, (_, i) => {
    const [nx,ny,nz] = faces[i % 6]
    const u = (Math.random()-0.5)*2*radius
    const v = (Math.random()-0.5)*2*radius
    // tangent vectors
    const tx = ny !== 0 || nz !== 0 ? 1 : 0
    const ty = nx !== 0 ? 1 : 0
    const tz = 0
    const bx = ny*tz - nz*ty, by = nz*tx - nx*tz, bz = nx*ty - ny*tx
    return {
      x: nx*radius + tx*u + bx*v,
      y: ny*radius + ty*u + by*v,
      z: nz*radius + tz*u + bz*v,
    }
  })
}

export default function ParticleBackground() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    let mouseX = w/2, mouseY = h/2, camX = 0, camY = 0

    const count = 8000
    const RADIUS = Math.min(w, h) * 0.32
    const RADII = [RADIUS, RADIUS, Math.min(w, h) * 0.22]  // globe, tetra, cube

    const particles = Array.from({ length: count }, () => ({
      x: (Math.random()-0.5)*w*1.5,
      y: (Math.random()-0.5)*h*1.5,
      z: Math.random()*800+100,
      r: Math.random()*0.8+0.3,
    }))

    // shapes[0]=globe, [1]=tetra, [2]=cube
    const shapes = [buildGlobe(count, RADII[0]), buildTetra(count, RADII[1]), buildCube(count, RADII[2])]

    // state: 0=stars, 1=globe, 2=tetra, 3=cube
    let state = 0
    let shapeIdx = -1       // which shape is active (-1=none)
    const progress = new Float32Array(count)  // 0→1 lerp to current shape
    let angle = 0

    // from/to positions for current transition
    let fromPos = null  // null means from star positions

    const nextState = () => {
      state = (state + 1) % 4
      if (state === 0) {
        // back to stars: lerp from current shape back to star
        fromPos = shapes[shapeIdx].map(p => ({ ...p }))
        shapeIdx = -1
        for (let i = 0; i < count; i++) progress[i] = 0
      } else {
        const newIdx = state - 1
        fromPos = shapeIdx >= 0 ? shapes[shapeIdx].map(p => {
          // apply current rotation to get actual rendered pos
          const cosY = Math.cos(angle), sinY = Math.sin(angle)
          const cosX = Math.cos(0.4), sinX = Math.sin(0.4)
          const rx = p.x*cosY + p.z*sinY
          const ry0 = p.y, rz0 = -p.x*sinY + p.z*cosY
          return { x: rx, y: ry0*cosX - rz0*sinX, z: ry0*sinX + rz0*cosX }
        }) : null
        shapeIdx = newIdx
        for (let i = 0; i < count; i++) progress[i] = 0
      }
    }

    canvas.style.pointerEvents = 'auto'
    canvas.addEventListener('click', nextState)
    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY })

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const cx = w/2, cy = h/2
      camX += ((mouseX-w/2)*0.04 - camX)*0.05
      camY += ((mouseY-h/2)*0.02 - camY)*0.05
      if (shapeIdx >= 0) angle += 0.006

      const cosY = Math.cos(angle), sinY = Math.sin(angle)
      const cosX = Math.cos(0.4), sinX = Math.sin(0.4)

      for (let i = 0; i < count; i++) {
        const p = particles[i]
        if (progress[i] < 1) progress[i] = Math.min(1, progress[i] + 0.014)
        const t = progress[i]
        const e = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2

        // star coords
        if (shapeIdx < 0 && fromPos === null) p.z -= 0.15
        else if (shapeIdx < 0) p.z -= 0.15 * e  // dispersing back
        else p.z -= 0.15 * (1 - e)
        if (p.z <= 0) p.z = 900

        const ss = 600/p.z
        const starSx = (p.x - camX*(800/p.z))*ss + cx
        const starSy = (p.y - camY*(800/p.z))*ss + cy

        let tsx, tsy, tsz = 600
        if (shapeIdx >= 0) {
          const g = shapes[shapeIdx][i]
          const rx = g.x*cosY + g.z*sinY
          const ry0 = g.y, rz0 = -g.x*sinY + g.z*cosY
          const ry = ry0*cosX - rz0*sinX
          const rz = ry0*sinX + rz0*cosX + 600
          const gs = 600/rz
          tsx = rx*gs + cx; tsy = ry*gs + cy; tsz = rz
        } else if (fromPos) {
          // dispersing: target is star pos
          tsx = starSx; tsy = starSy
        }

        let sx, sy, size, alpha
        if (shapeIdx >= 0) {
          const gs = 600/tsz
          sx = starSx + (tsx - starSx)*e
          sy = starSy + (tsy - starSy)*e
          size = Math.max(0.1, p.r*ss + (p.r*gs*0.5 - p.r*ss)*e)
          const brightness = e < 1 ? 220 : 255
          const a = e < 1 ? Math.min(1,(900-p.z)/400)*0.9 : 0.9
          ctx.beginPath()
          ctx.arc(sx, sy, size, 0, Math.PI*2)
          ctx.fillStyle = `rgba(${brightness},${brightness},${brightness},${a})`
          ctx.fill()
          continue
        } else if (fromPos) {
          // from shape back to stars
          const fp = fromPos[i]
          const frx = fp.x*cosY + fp.z*sinY
          const fry0 = fp.y, frz0 = -fp.x*sinY + fp.z*cosY
          const fry = fry0*cosX - frz0*sinX
          const frz = fry0*sinX + frz0*cosX + 600
          const fgs = 600/frz
          const fsx = frx*fgs + cx, fsy = fry*fgs + cy
          sx = fsx + (starSx - fsx)*e
          sy = fsy + (starSy - fsy)*e
          size = Math.max(0.1, p.r*fgs*0.5 + (p.r*ss - p.r*fgs*0.5)*e)
          alpha = 0.7 + (Math.min(1,(900-p.z)/400)*0.9 - 0.7)*e
          if (e >= 1) fromPos = null
        } else {
          sx = starSx; sy = starSy
          size = Math.max(0.1, p.r*ss)
          alpha = Math.min(1,(900-p.z)/400)*0.9
        }

        ctx.beginPath()
        ctx.arc(sx, sy, size, 0, Math.PI*2)
        ctx.fillStyle = `rgba(220,220,220,${alpha})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('click', nextState)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, zIndex:0, width:'100%', height:'100%' }} />
}
