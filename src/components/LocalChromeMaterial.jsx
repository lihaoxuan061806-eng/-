import { useMemo } from 'react'
import * as THREE from 'three'

function drawChromeFace(face) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  const base = ctx.createLinearGradient(0, 0, 512, 512)
  base.addColorStop(0, '#030405')
  base.addColorStop(0.2, '#16191d')
  base.addColorStop(0.38, '#050607')
  base.addColorStop(0.58, '#252a30')
  base.addColorStop(0.78, '#070809')
  base.addColorStop(1, '#000000')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 512, 512)

  const haze = ctx.createRadialGradient(256, 220, 20, 256, 220, 360)
  haze.addColorStop(0, 'rgba(255,255,255,0.2)')
  haze.addColorStop(0.34, 'rgba(120,130,140,0.12)')
  haze.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = haze
  ctx.fillRect(0, 0, 512, 512)

  const bandOffset = face * 54
  const highlight = ctx.createLinearGradient(-120 + bandOffset, 470, 620 + bandOffset, 35)
  highlight.addColorStop(0, 'rgba(255,255,255,0)')
  highlight.addColorStop(0.35, 'rgba(255,255,255,0)')
  highlight.addColorStop(0.43, 'rgba(255,255,255,0.92)')
  highlight.addColorStop(0.48, 'rgba(255,255,255,0.16)')
  highlight.addColorStop(0.53, 'rgba(255,255,255,0.7)')
  highlight.addColorStop(0.6, 'rgba(255,255,255,0)')
  highlight.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = highlight
  ctx.fillRect(0, 0, 512, 512)

  const blade = ctx.createLinearGradient(60 - bandOffset, 0, 410 - bandOffset, 512)
  blade.addColorStop(0, 'rgba(255,255,255,0)')
  blade.addColorStop(0.42, 'rgba(255,255,255,0)')
  blade.addColorStop(0.49, 'rgba(210,218,224,0.5)')
  blade.addColorStop(0.54, 'rgba(255,255,255,0.08)')
  blade.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = blade
  ctx.fillRect(0, 0, 512, 512)

  const darkSlice = ctx.createLinearGradient(0, 150 + face * 12, 512, 300 - face * 8)
  darkSlice.addColorStop(0, 'rgba(0,0,0,0)')
  darkSlice.addColorStop(0.42, 'rgba(0,0,0,0.78)')
  darkSlice.addColorStop(0.56, 'rgba(0,0,0,0.1)')
  darkSlice.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = darkSlice
  ctx.fillRect(0, 0, 512, 512)

  if (face === 0 || face === 2 || face === 4) {
    const colorReflection = ctx.createLinearGradient(160, 120, 360, 420)
    colorReflection.addColorStop(0, 'rgba(140,18,30,0)')
    colorReflection.addColorStop(0.28, 'rgba(150,20,36,0.32)')
    colorReflection.addColorStop(0.5, 'rgba(255,190,35,0.24)')
    colorReflection.addColorStop(0.72, 'rgba(35,70,92,0.28)')
    colorReflection.addColorStop(1, 'rgba(20,30,40,0)')
    ctx.fillStyle = colorReflection
    ctx.fillRect(90, 40, 330, 430)
  }

  const vignette = ctx.createRadialGradient(256, 256, 140, 256, 256, 380)
  vignette.addColorStop(0, 'rgba(0,0,0,0)')
  vignette.addColorStop(1, 'rgba(0,0,0,0.72)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, 512, 512)

  return canvas
}

export default function LocalChromeMaterial() {
  const envMap = useMemo(() => {
    const texture = new THREE.CubeTexture([0, 1, 2, 3, 4, 5].map(drawChromeFace))
    texture.colorSpace = THREE.SRGBColorSpace
    texture.mapping = THREE.CubeReflectionMapping
    texture.needsUpdate = true
    return texture
  }, [])

  return (
    <meshPhysicalMaterial
      color="#111316"
      metalness={1}
      roughness={0.055}
      envMap={envMap}
      envMapIntensity={3.2}
      clearcoat={1}
      clearcoatRoughness={0.045}
      reflectivity={1}
    />
  )
}
