import {
  CameraControls,
  Gltf,
  useTexture,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import { useEffect, useRef } from "react";

// <-- CHANGED: Import our two different avatar components
import { VRMAvatar } from "./VRMAvatar"; // This is the "Mimic" one (Project 1)
import { ChatbotAvatar } from "./ChatbotAvatar"; // This is the "Chat" one (Project 2)

// <-- CHANGED: Import the unified store
import { useChat } from "../hooks/useChat";

const SceneBackground = () => {
  const { scene } = useThree();
  const texture = useTexture("images/wawasensei-white.png"); // Path from your repo
  scene.background = texture;
  return null;
};

export const Experience = () => {
  const controls = useRef();

  // --- THIS IS THE "BRAIN" OF THE SWITCHER ---
  const { mode } = useChat(); // <-- CHANGED: Get the current mode
  // ------------------------------------------

  useEffect(() => {
    if (controls.current) {
      // Sets the initial camera position
      controls.current.setLookAt(0, 0.999, 3, 0, 0.999, 0, false);
    }
  }, []);

  // This Leva control is for the "Mimic" avatar (VRMAvatar)
  const { avatar } = useControls("VRM", {
    avatar: {
      value: "3859814441197244330.vrm", // Default model for mimic mode
      options: [
        "262410318834873893.vrm",
        "3859814441197244330.vrm",
        "3636451243928341470.vrm",
        "8087383217573817818.vrm",
      ],
    },
  });

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
        {/* We use the 'mode' to conditionally render the correct avatar */}
        
        {mode === "mimic" && (
          // We are in "Mimic Mode" (Camera On)
          // Render Project 1's avatar with its specific logic
          <VRMAvatar avatar={avatar} position-y={2} />
        )}
        
        {mode === "chat" && (
          // We are in "Chat Mode" (Camera Off)
          // Render Project 2's avatar with its specific logic
          // You may need to adjust this position-y to get the height right.
          <ChatbotAvatar position-y={1.25} />
        )}
        
        {/* --- END OF SWITCH --- */}


        {/* This Gltf (railings) now stays at the group's base Y-level */}
        {/* This is the original 'animations.glb' from Project 1 (the railings) */}
        {/* This is correct because we renamed Project 2's file. */}
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