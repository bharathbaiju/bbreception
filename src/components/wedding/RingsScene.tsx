import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";

const GOLD = "#cda45e";
const GOLD_LIGHT = "#f0dfb0";

function Ring({
  radius,
  tube,
  rotation,
  color,
  speed,
}: {
  radius: number;
  tube: number;
  rotation: [number, number, number];
  color: string;
  speed: number;
}) {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.rotation.y += delta * speed;
    mesh.rotation.x += delta * speed * 0.35;
  });

  return (
    <mesh ref={ref} rotation={rotation}>
      <torusGeometry args={[radius, tube, 48, 160]} />
      <meshStandardMaterial color={color} metalness={0.9} roughness={0.28} />
    </mesh>
  );
}

function Rig({ bob, children }: { bob: boolean; children: React.ReactNode }) {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    g.position.y = bob ? Math.sin(clock.elapsedTime * 0.6) * 0.12 : 0;
  });

  return <group ref={group}>{children}</group>;
}

/** The actual WebGL scene — kept in its own module so it code-splits away
 * from the main bundle and only downloads once mounted. */
export default function RingsScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.4], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.4} color="#fff3da" />
      <directionalLight position={[3, 2, 3]} intensity={3.2} color="#ffe3ac" />
      <directionalLight position={[-3, -1, 2]} intensity={1.8} color="#fff7e6" />
      <pointLight position={[0, -2, 2]} intensity={12} decay={0} color={GOLD} />
      <Rig bob={!reducedMotion}>
        <Ring
          radius={1.05}
          tube={0.11}
          rotation={[0.35, 0, 0.1]}
          color={GOLD}
          speed={reducedMotion ? 0 : 0.28}
        />
        <Ring
          radius={0.92}
          tube={0.09}
          rotation={[-0.25, 0.6, -0.15]}
          color={GOLD_LIGHT}
          speed={reducedMotion ? 0 : -0.22}
        />
      </Rig>
    </Canvas>
  );
}
