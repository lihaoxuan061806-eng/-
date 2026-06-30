import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text3D, Center } from '@react-three/drei'
import LocalChromeMaterial from './LocalChromeMaterial'

function LHXText() {
  const meshRef = useRef()
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.5
  })
  return (
    <Center ref={meshRef}>
      <Text3D
        font="/helvetiker_bold.typeface.json"
        size={1.8}
        height={0.5}
        curveSegments={32}
        bevelEnabled
        bevelThickness={0.05}
        bevelSize={0.03}
        bevelSegments={8}
      >
        LHX
        <LocalChromeMaterial />
      </Text3D>
    </Center>
  )
}

export default function LHX3D() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[0, 3, 7]} intensity={1.6} />
        <directionalLight position={[-5, 2, 4]} intensity={0.8} color="#ffffff" />
        <pointLight position={[0, 1.5, 4]} intensity={1.1} distance={10} />
        <LHXText />
      </Canvas>
    </div>
  )
}



