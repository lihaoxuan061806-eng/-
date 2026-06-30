import { useMemo } from 'react'
import * as THREE from 'three'

export default function LocalChromeMaterial() {
  const matcap = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    const center = 128

    const base = ctx.createRadialGradient(center, center, 8, center, center, 138)
    base.addColorStop(0, '#ffffff')
    base.addColorStop(0.2, '#d7dbe0')
    base.addColorStop(0.38, '#6b7076')
    base.addColorStop(0.5, '#111316')
    base.addColorStop(0.64, '#edf1f4')
    base.addColorStop(0.82, '#8d9297')
    base.addColorStop(1, '#090a0c')
    ctx.fillStyle = base
    ctx.fillRect(0, 0, 256, 256)

    const topGlint = ctx.createLinearGradient(40, 16, 226, 104)
    topGlint.addColorStop(0, 'rgba(255,255,255,0)')
    topGlint.addColorStop(0.34, 'rgba(255,255,255,0.92)')
    topGlint.addColorStop(0.44, 'rgba(255,255,255,0.16)')
    topGlint.addColorStop(0.56, 'rgba(255,255,255,0.78)')
    topGlint.addColorStop(0.68, 'rgba(255,255,255,0.08)')
    topGlint.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = topGlint
    ctx.fillRect(0, 0, 256, 130)

    const darkBand = ctx.createLinearGradient(22, 226, 232, 62)
    darkBand.addColorStop(0, 'rgba(0,0,0,0.7)')
    darkBand.addColorStop(0.28, 'rgba(0,0,0,0.05)')
    darkBand.addColorStop(0.45, 'rgba(0,0,0,0.68)')
    darkBand.addColorStop(0.6, 'rgba(0,0,0,0)')
    darkBand.addColorStop(0.76, 'rgba(0,0,0,0.52)')
    darkBand.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = darkBand
    ctx.fillRect(0, 0, 256, 256)

    const silverSweep = ctx.createLinearGradient(0, 170, 256, 88)
    silverSweep.addColorStop(0, 'rgba(255,255,255,0)')
    silverSweep.addColorStop(0.22, 'rgba(255,255,255,0.72)')
    silverSweep.addColorStop(0.32, 'rgba(255,255,255,0.06)')
    silverSweep.addColorStop(0.5, 'rgba(255,255,255,0.52)')
    silverSweep.addColorStop(0.62, 'rgba(255,255,255,0)')
    silverSweep.addColorStop(0.82, 'rgba(255,255,255,0.42)')
    silverSweep.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = silverSweep
    ctx.fillRect(0, 0, 256, 256)

    const edge = ctx.createRadialGradient(center, center, 86, center, center, 140)
    edge.addColorStop(0, 'rgba(0,0,0,0)')
    edge.addColorStop(1, 'rgba(0,0,0,0.78)')
    ctx.fillStyle = edge
    ctx.fillRect(0, 0, 256, 256)

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
    return texture
  }, [])

  return <meshMatcapMaterial matcap={matcap} color="#bfc3c7" />
}

