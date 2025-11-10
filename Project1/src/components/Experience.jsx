import {
  CameraControls,
  Gltf,
  useTexture,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
// <-- We no longer import 'useControls' from leva here
import { useEffect, useRef } from "react";

// <-- Import our TWO different avatar components
import { VRMAvatar } from "./VRMAvatar"; 
import { ChatbotAvatar } from "./ChatbotAvatar"; 

// <-- Import the unified store
import { useChat } from "../hooks/useChat";

const SceneBackground = () => {
  const { scene } = useThree();
  const texture = useTexture("images/wawasensei-white.png"); 
  scene.background = texture;
  return null;
};

export const Experience = () => {
  const controls = useRef();

  // --- THIS IS THE "BRAIN" OF THE SWITCHER ---
  const { mode } = useChat(); // Get the current mode
  // ------------------------------------------

  useEffect(() => {
    if (controls.current) {
      // Use the original working setLookAt
      controls.current.setLookAt(0, 0.999, 3, 0, 0.999, 0, false);
    }
  }, []);

  // --- THIS IS THE FIX (Part 2) ---
  // We have REMOVED the useControls("VRM", ...) hook from this file.
  // It now lives inside VRMAvatar.jsx.
  // We have also REMOVED the broken useFrame camera logic.
  // -----------------------

  return (
    <>
      <CameraControls
        ref={controls}
        maxPolarAngle={Math.PI / 2}
        minDistance={1}
        maxDistance={10}
      />

      <SceneBackground />

      <directionalLight intensity={2} position={[10, 10, 5]} />
      <directionalLight intensity={1} position={[-10, 10, 5]} />

      {/* Stage model */}
      <Gltf src="models/sound-stage-final.glb" position-y={-1.25} />

      {/* This group is now positioned at the stage's base level (-1.25). */}
      <group position-y={-2.5}>
        
        {/* --- THIS IS THE KEY SWITCH --- */}
        
        {mode === "mimic" && (
          // We no longer pass the 'avatar' prop.
          // VRMAvatar now handles its own controls.
          <VRMAvatar position-y={2} />
        )}
        
        {mode === "chat" && (
          // ChatbotAvatar renders with its own controls.
          // The position-y={2} is from our previous fix.
          <ChatbotAvatar position-y={2} />
        )}
        
        {/* --- END OF SWITCH --- */}


        {/* This Gltf (railings) now stays at the group's base Y-level */}
        <Gltf
          src="models/animations.glb"
          position-z={-1.4}
          position-x={-0.5}
          scale={0.65}
        />
      </group>

      <EffectComposer>
        <Bloom mipmapBlur intensity={0.7} />
      </EffectComposer>
    </>
  );
};