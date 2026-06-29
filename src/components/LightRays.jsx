import { useRef, useEffect, useState } from 'react'
import { Renderer, Program, Triangle, Mesh } from 'ogl'
import './LightRays.css'

const hexToRgb = hex => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m ? [parseInt(m[1],16)/255, parseInt(m[2],16)/255, parseInt(m[3],16)/255] : [1,1,1]
}

const getAnchorAndDir = (origin, w, h) => {
  const o = 0.2
  switch (origin) {
    case 'top-left':    return { anchor:[0,-o*h],          dir:[0,1] }
    case 'top-right':   return { anchor:[w,-o*h],           dir:[0,1] }
    case 'left':        return { anchor:[-o*w,0.5*h],       dir:[1,0] }
    case 'right':       return { anchor:[(1+o)*w,0.5*h],    dir:[-1,0] }
    case 'bottom-left': return { anchor:[0,(1+o)*h],        dir:[0,-1] }
    case 'bottom-center':return{ anchor:[0.5*w,(1+o)*h],    dir:[0,-1] }
    case 'bottom-right':return { anchor:[w,(1+o)*h],        dir:[0,-1] }
    default:            return { anchor:[0.5*w,-o*h],       dir:[0,1] }
  }
}

const vert = `attribute vec2 position;varying vec2 vUv;void main(){vUv=position*0.5+0.5;gl_Position=vec4(position,0.0,1.0);}`

const frag = `precision highp float;
uniform float iTime;uniform vec2 iResolution;uniform vec2 rayPos;uniform vec2 rayDir;
uniform vec3 raysColor;uniform float raysSpeed;uniform float lightSpread;uniform float rayLength;
uniform float pulsating;uniform float fadeDistance;uniform float saturation;uniform vec2 mousePos;
uniform float mouseInfluence;uniform float noiseAmount;uniform float distortion;varying vec2 vUv;

float noise(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}

float rayStrength(vec2 src,vec2 dir,vec2 coord,float sA,float sB,float spd){
  vec2 d=coord-src;vec2 n=normalize(d);float c=dot(n,dir);
  float dc=c+distortion*sin(iTime*2.0+length(d)*0.01)*0.2;
  float sp=pow(max(dc,0.0),1.0/max(lightSpread,0.001));
  float dist=length(d);float md=iResolution.x*rayLength;
  float lf=clamp((md-dist)/md,0.0,1.0);
  float ff=clamp((iResolution.x*fadeDistance-dist)/(iResolution.x*fadeDistance),0.5,1.0);
  float pulse=pulsating>0.5?(0.8+0.2*sin(iTime*spd*3.0)):1.0;
  float bs=clamp((0.45+0.15*sin(dc*sA+iTime*spd))+(0.3+0.2*cos(-dc*sB+iTime*spd)),0.0,1.0);
  return bs*lf*ff*sp*pulse;
}

void main(){
  vec2 coord=vec2(gl_FragCoord.x,iResolution.y-gl_FragCoord.y);
  vec2 fd=rayDir;
  if(mouseInfluence>0.0){vec2 mp=mousePos*iResolution.xy;fd=normalize(mix(rayDir,normalize(mp-rayPos),mouseInfluence));}
  vec4 r1=vec4(1.0)*rayStrength(rayPos,fd,coord,36.2214,21.11349,1.5*raysSpeed);
  vec4 r2=vec4(1.0)*rayStrength(rayPos,fd,coord,22.3991,18.0234,1.1*raysSpeed);
  gl_FragColor=r1*0.5+r2*0.4;
  if(noiseAmount>0.0){float n=noise(coord*0.01+iTime*0.1);gl_FragColor.rgb*=(1.0-noiseAmount+noiseAmount*n);}
  float br=1.0-(coord.y/iResolution.y);
  gl_FragColor.x*=0.1+br*0.8;gl_FragColor.y*=0.3+br*0.6;gl_FragColor.z*=0.5+br*0.5;
  if(saturation!=1.0){float g=dot(gl_FragColor.rgb,vec3(0.299,0.587,0.114));gl_FragColor.rgb=mix(vec3(g),gl_FragColor.rgb,saturation);}
  gl_FragColor.rgb*=raysColor;
}`

export default function LightRays({
  raysOrigin='top-center', raysColor='#ffffff', raysSpeed=1,
  lightSpread=1, rayLength=2, pulsating=false, fadeDistance=1.0,
  saturation=1.0, followMouse=true, mouseInfluence=0.1,
  noiseAmount=0.0, distortion=0.0, className=''
}) {
  const containerRef = useRef(null)
  const uniformsRef = useRef(null)
  const rendererRef = useRef(null)
  const mouseRef = useRef({x:0.5,y:0.5})
  const smoothMouseRef = useRef({x:0.5,y:0.5})
  const rafRef = useRef(null)
  const meshRef = useRef(null)
  const cleanupRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {threshold:0.1})
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || !containerRef.current) return
    cleanupRef.current?.()

    const renderer = new Renderer({ dpr: Math.min(devicePixelRatio,2), alpha: true })
    rendererRef.current = renderer
    const gl = renderer.gl
    gl.canvas.style.width = gl.canvas.style.height = '100%'
    while (containerRef.current.firstChild) containerRef.current.removeChild(containerRef.current.firstChild)
    containerRef.current.appendChild(gl.canvas)

    const uniforms = {
      iTime:{value:0}, iResolution:{value:[1,1]}, rayPos:{value:[0,0]}, rayDir:{value:[0,1]},
      raysColor:{value:hexToRgb(raysColor)}, raysSpeed:{value:raysSpeed}, lightSpread:{value:lightSpread},
      rayLength:{value:rayLength}, pulsating:{value:pulsating?1:0}, fadeDistance:{value:fadeDistance},
      saturation:{value:saturation}, mousePos:{value:[0.5,0.5]}, mouseInfluence:{value:mouseInfluence},
      noiseAmount:{value:noiseAmount}, distortion:{value:distortion}
    }
    uniformsRef.current = uniforms

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program: new Program(gl,{vertex:vert,fragment:frag,uniforms}) })
    meshRef.current = mesh

    const resize = () => {
      if (!containerRef.current) return
      const {clientWidth:w,clientHeight:h} = containerRef.current
      renderer.setSize(w,h)
      const dpr = renderer.dpr
      uniforms.iResolution.value = [w*dpr, h*dpr]
      const {anchor,dir} = getAnchorAndDir(raysOrigin, w*dpr, h*dpr)
      uniforms.rayPos.value = anchor; uniforms.rayDir.value = dir
    }
    window.addEventListener('resize', resize)
    resize()

    const loop = t => {
      if (!rendererRef.current) return
      uniforms.iTime.value = t * 0.001
      if (followMouse) {
        const s = 0.92
        smoothMouseRef.current.x = smoothMouseRef.current.x*s + mouseRef.current.x*(1-s)
        smoothMouseRef.current.y = smoothMouseRef.current.y*s + mouseRef.current.y*(1-s)
        uniforms.mousePos.value = [smoothMouseRef.current.x, smoothMouseRef.current.y]
      }
      renderer.render({scene:mesh})
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    cleanupRef.current = () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      try { renderer.gl.getExtension('WEBGL_lose_context')?.loseContext() } catch {}
      rendererRef.current = uniformsRef.current = meshRef.current = null
    }
    return () => { cleanupRef.current?.(); cleanupRef.current = null }
  }, [visible, raysOrigin, raysColor, raysSpeed, lightSpread, rayLength, pulsating, fadeDistance, saturation, followMouse, mouseInfluence, noiseAmount, distortion])

  useEffect(() => {
    if (!followMouse) return
    const onMove = e => {
      if (!containerRef.current) return
      const r = containerRef.current.getBoundingClientRect()
      mouseRef.current = { x:(e.clientX-r.left)/r.width, y:(e.clientY-r.top)/r.height }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [followMouse])

  return <div ref={containerRef} className={`light-rays-container ${className}`.trim()} />
}
