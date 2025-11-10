import {
  CameraControls,
  Gltf,
  useTexture,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

import { useEffect, useRef } from "react";


import { VRMAvatar } from "./VRMAvatar"; 
import { ChatbotAvatar } from "./ChatbotAvatar"; 


import { useChat } from "../hooks/useChat";

const SceneBackground = () => {
  const { scene } = useThree();
  const texture = useTexture("images/wawasensei-white.png"); 
  scene.background = texture;
  return null;
};

export const Experience = () => {
  const controls = useRef();


  const { mode } = useChat(); 


  useEffect(() => {
    if (controls.current) {
   
      controls.current.setLookAt(0, 0.999, 3, 0, 0.999, 0, false);
    }
  }, []);



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

      
      <Gltf src="models/sound-stage-final.glb" position-y={-1.25} />

    
      <group position-y={-2.5}>
        
        
        
        {mode === "mimic" && (

          <VRMAvatar position-y={2} />
        )}
        
        {mode === "chat" && (

          <ChatbotAvatar position-y={2} />
        )}
        

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