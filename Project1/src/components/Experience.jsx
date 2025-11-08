import {
  CameraControls,
  Gltf, // Removed 'Environment' since it's commented out
  useTexture,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { VRMAvatar } from "./VRMAvatar";

const SceneBackground = () => {
  const { scene } = useThree();
  const texture = useTexture("images/wawasensei-white.png"); // Path from your repo
  scene.background = texture;
  return null;
};

export const Experience = () => {
  const controls = useRef();

  useEffect(() => {
    if (controls.current) {
      // Sets the initial camera position
      controls.current.setLookAt(0, 0.999, 3, 0, 0.999, 0, false);
    }
  }, []);

  const { avatar } = useControls("VRM", {
    avatar: {
      value: "3859814441197244330.vrm",
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

      {/* This group is now positioned at the stage's base level (-1.25).
      */}
      <group position-y={-2.5}>
        {/* We add position-y ONLY to the avatar.
          This lifts it 0.35 units UP from the group's base.
          (Calculated as -0.9 [old good Y] - (-1.25) [new group Y] = 0.35)
          You can tweak this value (e.g., 0.3, 0.4) to get the perfect height.
        */}
        <VRMAvatar avatar={avatar} position-y={2} />

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