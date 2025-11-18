import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Text, Float, Instance, Instances, Trail } from '@react-three/drei';
import * as THREE from 'three';

const GlassMaterial = () => (
  <MeshTransmissionMaterial
    backside
    samples={8}
    resolution={512}
    transmission={1}
    roughness={0.1}
    thickness={0.35}
    ior={1.5}
    chromaticAberration={0.2}
    anisotropy={0.3}
    distortion={0.2}
    distortionScale={0.3}
    temporalDistortion={0.1}
    color="#cceeff"
    attenuationDistance={0.5}
    attenuationColor="#ffffff"
  />
);

const FloatingText = ({ children, position, fontSize = 1, color = "white", opacity = 1 }: any) => (
  <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
    <Text
      position={position}
      fontSize={fontSize}
      font="https://fonts.gstatic.com/s/rajdhani/v15/L1XY2NB6T7h3VwC-sp1t.woff"
      color={color}
      anchorX="center"
      anchorY="middle"
      fillOpacity={opacity}
    >
      {children}
      {/* Emissive material makes text glow with Bloom */}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
    </Text>
  </Float>
);

const RingGate = ({ position, rotation, scale = 1, color = "#00ffff" }: any) => {
    const ref = useRef<THREE.Group>(null);
    useFrame((state) => {
        if(ref.current) {
            ref.current.rotation.z += 0.01;
        }
    });
    return (
        <group ref={ref} position={position} rotation={rotation} scale={scale}>
            <mesh>
            <torusGeometry args={[4, 0.05, 16, 100]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} toneMapped={false} />
            </mesh>
            <mesh rotation={[0,0, Math.PI/4]}>
            <torusGeometry args={[4.2, 0.02, 16, 100]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} toneMapped={false} />
            </mesh>
        </group>
    )
};

const ParticleStream = () => {
    const count = 400;
    const mesh = useRef<THREE.InstancedMesh>(null);
    
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const z = Math.random() * -100 + 20; // Long trail
            const x = (Math.random() - 0.5) * 30;
            const y = (Math.random() - 0.5) * 30;
            const speed = Math.random() * 0.2 + 0.1;
            temp.push({ x, y, z, speed });
        }
        return temp;
    }, []);

    const dummy = new THREE.Object3D();

    useFrame((state) => {
        if (!mesh.current) return;
        
        particles.forEach((particle, i) => {
            // Move particles towards camera or away depending on effect desire. 
            // Let's have them float slowly
            particle.z += particle.speed; 
            if (particle.z > 20) particle.z = -80; // Reset loop

            dummy.position.set(particle.x, particle.y, particle.z);
            dummy.scale.setScalar(0.05);
            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
        </instancedMesh>
    )
}

export const TheConstruct: React.FC = () => {
  const shardCount = 120;
  const shards = useMemo(() => {
    const temp = [];
    for (let i = 0; i < shardCount; i++) {
      const z = -i * 0.6 + 5; 
      const r = 6 + Math.random() * 8;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      temp.push({ position: [x, y, z], rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0], scale: 0.2 + Math.random() * 0.8 });
    }
    return temp;
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if(groupRef.current) {
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      
      <ParticleStream />

      {/* --- SECTION 1: ENTRY --- */}
      <FloatingText position={[0, 1.5, 8]} fontSize={0.4} color="#88ccff">INITIALIZING NEURAL LINK...</FloatingText>
      <FloatingText position={[0, 0, 4]} fontSize={1.2}>WELCOME PILOT</FloatingText>
      
      <RingGate position={[0, 0, 0]} rotation={[0, 0, 0]} color="#00ffff" />
      
      {/* --- SECTION 2: THE DATA TUNNEL --- */}
      <Instances range={shardCount}>
        <octahedronGeometry args={[1, 0]} />
        <GlassMaterial />
        {shards.map((data, i) => (
          <Instance
            key={i}
            position={new THREE.Vector3(...data.position as [number,number,number])}
            rotation={new THREE.Euler(...data.rotation as [number,number,number])}
            scale={data.scale}
          />
        ))}
      </Instances>

      {/* --- SPATIAL UI ELEMENTS --- */}
      
      <group position={[-4, 2, -8]}>
        <FloatingText fontSize={1.2} color="#00ffff">REALITY.SYS</FloatingText>
        <FloatingText position={[0, -0.8, 0]} fontSize={0.4} color="#aaaaaa">Reconstructing physical paradigms</FloatingText>
      </group>

      <group position={[4, -2, -18]}>
        <FloatingText fontSize={1.2} color="#ff00aa">NEURAL.NET</FloatingText>
        <FloatingText position={[0, -0.8, 0]} fontSize={0.4} color="#aaaaaa">Direct interface connected</FloatingText>
      </group>

      <RingGate position={[0, 0, -15]} rotation={[0, 0, Math.PI/3]} color="#ff00aa" />
      
      <group position={[-3, 0, -25]}>
         <FloatingText fontSize={2} color="white">SPEED</FloatingText>
      </group>
      
      <RingGate position={[0, 0, -30]} rotation={[0, 0, -Math.PI/3]} color="#00ffff" />

      {/* --- SECTION 3: THE CORE --- */}
      <group position={[0, 20, -45]}>
         {/* The "Brain" */}
         <mesh>
            <icosahedronGeometry args={[3, 2]} />
            <meshStandardMaterial color="#ffffff" wireframe />
         </mesh>
         <mesh>
            <sphereGeometry args={[2.5, 32, 32]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={5} toneMapped={false} />
         </mesh>
         <mesh rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[6, 0.05, 64, 100]} />
            <meshBasicMaterial color="#ffffff" />
         </mesh>
         <FloatingText position={[0, -5, 0]} fontSize={1.5}>SYSTEM CORE</FloatingText>
      </group>

    </group>
  );
};