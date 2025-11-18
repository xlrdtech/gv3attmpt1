import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ScrollControls, useScroll, PerspectiveCamera, Stars, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { TheConstruct } from './IceCrystal';

// The "Rail" the camera flies along
const CameraRig = () => {
  const scroll = useScroll();
  const { camera, mouse } = useThree();
  
  // Define a cinematic path through the world
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 15),    // Start: Far out
      new THREE.Vector3(0, 0, 0),     // Entering the gate
      new THREE.Vector3(-2, 2, -10),  // Curving left inside high
      new THREE.Vector3(3, -2, -20),  // Curving right low
      new THREE.Vector3(0, 0, -35),   // Deep inside
      new THREE.Vector3(0, 15, -45),  // Looking up at the core
      new THREE.Vector3(0, 0, -60),   // The end
    ], false, 'catmullrom', 0.5);
  }, []);

  const targetVector = useRef(new THREE.Vector3(0,0,0));

  useFrame((state, delta) => {
    const t = scroll?.offset ?? 0;
    
    // 1. Path Movement (The Rail)
    // We clamp t to 0-1 just in case, though scroll.offset is usually normalized
    const safeT = Math.min(Math.max(t, 0), 1);
    
    const point = curve.getPointAt(safeT);
    const lookAtPoint = curve.getPointAt(Math.min(safeT + 0.05, 1));
    
    // 2. Mouse Parallax (The "Human" feel)
    // We add a slight offset based on mouse position to make it feel interactive
    // Soften the parallax effect for stability
    const parallaxX = mouse.x * 1.5;
    const parallaxY = mouse.y * 1.5;

    const finalPosition = new THREE.Vector3(
        point.x + parallaxX,
        point.y + parallaxY,
        point.z
    );

    // Smoothly interpolate current camera position
    camera.position.lerp(finalPosition, 0.08);
    
    // Handle rotation/lookAt
    targetVector.current.lerp(lookAtPoint, 0.08);
    camera.lookAt(targetVector.current);

    // 3. Camera Shake (Turbulence)
    const shake = Math.sin(state.clock.elapsedTime * 3) * 0.02;
    camera.rotation.z = parallaxX * 0.05 + shake; // Bank the camera on turns
  });

  return null;
};

export const Scene: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10 bg-[#050505]">
      <Canvas
        gl={{ 
          powerPreference: "high-performance",
          antialias: false,
          stencil: true,
          depth: true,
          alpha: false
        }}
        dpr={[1, 1.5]}
      >
        <PerspectiveCamera makeDefault fov={50} near={0.1} far={200} />
        
        <color attach="background" args={['#020204']} />
        <fog attach="fog" args={['#020204', 10, 50]} />

        <ScrollControls pages={8} damping={0.3}>
          <CameraRig />
          <TheConstruct />
        </ScrollControls>
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={20} color="#00ffff" distance={40} decay={2} />
        <pointLight position={[-10, -10, -10]} intensity={20} color="#ff00aa" distance={40} decay={2} />
        
        {/* Subtle fill light from bottom for drama */}
        <pointLight position={[0, -20, -20]} intensity={10} color="#ffffff" />

        <Environment preset="city" />
        <Stars radius={80} depth={60} count={8000} factor={4} saturation={0} fade speed={0.5} />

        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={1.1} 
            intensity={1.2} 
            levels={9} 
            mipmapBlur 
          />
          <ChromaticAberration 
            offset={[0.002, 0.002]} 
          />
          <Noise opacity={0.08} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};