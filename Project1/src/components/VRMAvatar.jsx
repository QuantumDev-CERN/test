import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Face, Hand, Pose } from "kalidokit";
import { useControls } from "leva";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Euler, Object3D, Quaternion, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils.js";
import { useChat } from "../hooks/useChat"; // <-- CHANGED: Import the unified store
import { remapMixamoAnimationToVrm } from "../utils/remapMixamoAnimationToVrm";

const tmpVec3 = new Vector3();
const tmpQuat = new Quaternion();
const tmpEuler = new Euler();

export const VRMAvatar = ({ avatar, ...props }) => {
  const { scene, userData } = useGLTF(
    `models/${avatar}`,
    undefined,
    undefined,
    (loader) => {
      loader.register((parser) => {
        return new VRMLoaderPlugin(parser);
      });
    }
  );

  // --- Original animation loading ---
  const assetA = useFBX("models/animations/Swing Dancing.fbx");
  const assetB = useFBX("models/animations/Thriller Part 2.fbx");
  const assetC = useFBX("models/animations/Breathing Idle.fbx");

  const currentVrm = userData.vrm;

  const animationClipA = useMemo(() => {
    const clip = remapMixamoAnimationToVrm(currentVrm, assetA);
    clip.name = "Swing Dancing";
    return clip;
  }, [assetA, currentVrm]);

  const animationClipB = useMemo(() => {
    const clip = remapMixamoAnimationToVrm(currentVrm, assetB);
    clip.name = "Thriller Part 2";
    return clip;
  }, [assetB, currentVrm]);

  const animationClipC = useMemo(() => {
    const clip = remapMixamoAnimationToVrm(currentVrm, assetC);
    clip.name = "Idle";
    return clip;
  }, [assetC, currentVrm]);

  const { actions } = useAnimations(
    [animationClipA, animationClipB, animationClipC],
    currentVrm.scene
  );

  useEffect(() => {
    const vrm = userData.vrm;
    // ... (Original VRMUtils setup, no changes) ...
    VRMUtils.removeUnnecessaryVertices(scene);
    VRMUtils.combineSkeletons(scene);
    VRMUtils.combineMorphs(vrm);
    vrm.scene.traverse((obj) => {
      obj.frustumCulled = false;
    });
  }, [scene]);

  // --- Get state from our new unified store ---
  const { mode, videoElement, setResultsCallback } = useChat(); // <-- CHANGED

  // --- Rigging refs ---
  const riggedFace = useRef();
  const riggedPose = useRef();
  const riggedLeftHand = useRef();
  const riggedRightHand = useRef();

  // --- Results Callback (for MediaPipe) ---
  const resultsCallback = useCallback(
    (results) => {
      // <-- CHANGED: Guard clause
      // Only process results if we are in "mimic" mode
      if (useChat.getState().mode !== "mimic" || !videoElement || !currentVrm) {
        // Clear refs to prevent stale data
        riggedFace.current = null;
        riggedPose.current = null;
        riggedLeftHand.current = null;
        riggedRightHand.current = null;
        return;
      }

      // --- Original Kalidokit logic ---
      if (results.faceLandmarks) {
        riggedFace.current = Face.solve(results.faceLandmarks, {
          runtime: "mediapipe",
          video: videoElement,
          imageSize: { width: 640, height: 480 },
          smoothBlink: false,
          blinkSettings: [0.25, 0.75],
        });
      }
      if (results.za && results.poseLandmarks) {
        riggedPose.current = Pose.solve(results.za, results.poseLandmarks, {
          runtime: "mediapipe",
          video: videoElement,
        });
      }
      if (results.leftHandLandmarks) {
        riggedRightHand.current = Hand.solve(
          results.leftHandLandmarks,
          "Right"
        );
      }
      if (results.rightHandLandmarks) {
        riggedLeftHand.current = Hand.solve(results.rightHandLandmarks, "Left");
      }
    },
    [videoElement, currentVrm]
  );

  // --- Set the callback in the store ---
  useEffect(() => {
    setResultsCallback(resultsCallback);
  }, [resultsCallback, setResultsCallback]); // <-- CHANGED: Added setResultsCallback

  // --- Leva Controls (no change) ---
  const {
    aa,
    ih,
    ee,
    oh,
    ou,
    blinkLeft,
    blinkRight,
    angry,
    sad,
    happy,
    animation,
  } = useControls("VRM", {
    aa: { value: 0, min: 0, max: 1 },
    ih: { value: 0, min: 0, max: 1 },
    ee: { value: 0, min: 0, max: 1 },
    oh: { value: 0, min: 0, max: 1 },
    ou: { value: 0, min: 0, max: 1 },
    blinkLeft: { value: 0, min: 0, max: 1 },
    blinkRight: { value: 0, min: 0, max: 1 },
    angry: { value: 0, min: 0, max: 1 },
    sad: { value: 0, min: 0, max: 1 },
    happy: { value: 0, min: 0, max: 1 },
    animation: {
      options: ["None", "Idle", "Swing Dancing", "Thriller Part 2"],
      value: "Idle",
    },
  });

  // --- Animation playback ---
  useEffect(() => {
    // <-- CHANGED: This logic is now mode-dependent
    if (mode === "mimic") {
      // We are in mimic mode, use original logic
      if (animation === "None" || videoElement) {
        actions["Idle"]?.play(); // Default to idle
        return () => {
          actions["Idle"]?.stop();
        };
      }
      actions[animation]?.play();
      return () => {
        actions[animation]?.stop();
      };
    } else {
      // We are in "chat" mode. Just play Idle.
      // The ChatbotAvatar will be handling its own animations.
      actions["Idle"]?.play();
      return () => {
        actions["Idle"]?.stop();
      };
    }
  }, [actions, animation, videoElement, mode]); // <-- CHANGED: Added 'mode'

  // --- Helper Functions (no change) ---
  const lerpExpression = (name, value, lerpFactor) => {
    if (!userData.vrm) return;
    userData.vrm.expressionManager.setValue(
      name,
      lerp(userData.vrm.expressionManager.getValue(name), value, lerpFactor)
    );
  };

  const rotateBone = (
    boneName,
    value,
    slerpFactor,
    flip = {
      x: 1,
      y: 1,
      z: 1,
    }
  ) => {
    if (!userData.vrm) return;
    const bone = userData.vrm.humanoid.getNormalizedBoneNode(boneName);
    if (!bone) {
      return;
    }
    tmpEuler.set(value.x * flip.x, value.y * flip.y, value.z * flip.z);
    tmpQuat.setFromEuler(tmpEuler);
    bone.quaternion.slerp(tmpQuat, slerpFactor);
  };

  // --- Main Render Loop (useFrame) ---
  useFrame((_, delta) => {
    if (!userData.vrm) {
      return;
    }

    // <-- CHANGED: This is the main logic switch
    if (mode === "mimic" && videoElement) {
      // --- MIMIC MODE (Camera ON) ---
      // This is the original logic from your file's `else` block

      // Apply Leva emotion controls
      userData.vrm.expressionManager.setValue("angry", angry);
      userData.vrm.expressionManager.setValue("sad", sad);
      userData.vrm.expressionManager.setValue("happy", happy);

      // Apply rigging
      if (riggedFace.current) {
        [
          {
            name: "aa",
            value: riggedFace.current.mouth.shape.A,
          },
          {
            name: "ih",
            value: riggedFace.current.mouth.shape.I,
          },
          {
            name: "ee",
            value: riggedFace.current.mouth.shape.E,
          },
          {
            name: "oh",
            value: riggedFace.current.mouth.shape.O,
          },
          {
            name: "ou",
            value: riggedFace.current.mouth.shape.U,
          },
          {
            name: "blinkLeft",
            value: 1 - riggedFace.current.eye.l,
          },
          {
            name: "blinkRight",
            value: 1 - riggedFace.current.eye.r,
          },
        ].forEach((item) => {
          lerpExpression(item.name, item.value, delta * 12);
        });

        // Eyes
        if (lookAtTarget.current && riggedFace.current.pupil) {
          userData.vrm.lookAt.target = lookAtTarget.current;
          lookAtDestination.current.set(
            -2 * riggedFace.current.pupil.x,
            2 * riggedFace.current.pupil.y,
            0
          );
          lookAtTarget.current.position.lerp(
            lookAtDestination.current,
            delta * 5
          );
        }

        // Body
        if (riggedFace.current.head) {
          rotateBone("neck", riggedFace.current.head, delta * 5, {
            x: 0.7,
            y: 0.7,
            z: 0.7,
          });
        }
      }

      // <-- FIX: This logic must be INSIDE the mimic mode check
      if (riggedPose.current) {
        rotateBone("chest", riggedPose.current.Spine, delta * 5, {
          x: 0.3,
          y: 0.3,
          z: 0.3,
        });
        rotateBone("spine", riggedPose.current.Spine, delta * 5, {
          x: 0.3,
          y: 0.3,
          z: 0.3,
        });
        rotateBone("hips", riggedPose.current.Hips.rotation, delta * 5, {
          x: 0.7,
          y: 0.7,
          z: 0.7,
        });

        // LEFT ARM
        rotateBone("leftUpperArm", riggedPose.current.LeftUpperArm, delta * 5);
        rotateBone("leftLowerArm", riggedPose.current.LeftLowerArm, delta * 5);
        // RIGHT ARM
        rotateBone("rightUpperArm", riggedPose.current.RightUpperArm, delta * 5);
        rotateBone("rightLowerArm", riggedPose.current.RightLowerArm, delta * 5);
      }
      
      // --- FINGER & WRIST SOLUTION ---
      if (riggedLeftHand.current) {
        const amp = 3;
        const speed = delta * 2;
        const handMap = (data) => ({
          x: data.x * amp,
          y: -data.z,
          z: -data.y,
        });
        const wristMap = (data) => ({ x: data.z, y: data.y, z: -data.x });

        rotateBone("leftHand", wristMap(riggedLeftHand.current.LeftWrist), speed);
        // ... (all other left hand rotateBone calls) ...
        rotateBone("leftRingProximal", handMap(riggedLeftHand.current.LeftRingProximal), speed);
        rotateBone("leftRingIntermediate", handMap(riggedLeftHand.current.LeftRingIntermediate), speed);
        rotateBone("leftRingDistal", handMap(riggedLeftHand.current.LeftRingDistal), speed);
        rotateBone("leftIndexProximal", handMap(riggedLeftHand.current.LeftIndexProximal), speed);
        rotateBone("leftIndexIntermediate", handMap(riggedLeftHand.current.LeftIndexIntermediate), speed);
        rotateBone("leftIndexDistal", handMap(riggedLeftHand.current.LeftIndexDistal), speed);
        rotateBone("leftMiddleProximal", handMap(riggedLeftHand.current.LeftMiddleProximal), speed);
        rotateBone("leftMiddleIntermediate", handMap(riggedLeftHand.current.LeftMiddleIntermediate), speed);
        rotateBone("leftMiddleDistal", handMap(riggedLeftHand.current.LeftMiddleDistal), speed);
        rotateBone("leftThumbProximal", handMap(riggedLeftHand.current.LeftThumbProximal), speed);
        rotateBone("leftThumbMetacarpal", handMap(riggedLeftHand.current.LeftThumbIntermediate), speed);
        rotateBone("leftThumbDistal", handMap(riggedLeftHand.current.LeftThumbDistal), speed);
        rotateBone("leftLittleProximal", handMap(riggedLeftHand.current.LeftLittleProximal), speed);
        rotateBone("leftLittleIntermediate", handMap(riggedLeftHand.current.LeftLittleIntermediate), speed);
        rotateBone("leftLittleDistal", handMap(riggedLeftHand.current.LeftLittleDistal), speed);
      }

      if (riggedRightHand.current) {
        const amp = 3;
        const speed = delta * 2;
        const handMap = (data) => ({
          x: -data.x * amp,
          y: data.z,
          z: data.y,
        });
        const wristMap = (data) => ({ x: -data.z, y: -data.y, z: data.x });

        rotateBone("rightHand", wristMap(riggedRightHand.current.RightWrist), speed);
        // ... (all other right hand rotateBone calls) ...
        rotateBone("rightRingProximal", handMap(riggedRightHand.current.RightRingProximal), speed);
        rotateBone("rightRingIntermediate", handMap(riggedRightHand.current.RightRingIntermediate), speed);
        rotateBone("rightRingDistal", handMap(riggedRightHand.current.RightRingDistal), speed);
        rotateBone("rightIndexProximal", handMap(riggedRightHand.current.RightIndexProximal), speed);
        rotateBone("rightIndexIntermediate", handMap(riggedRightHand.current.RightIndexIntermediate), speed);
        rotateBone("rightIndexDistal", handMap(riggedRightHand.current.RightIndexDistal), speed);
        rotateBone("rightMiddleProximal", handMap(riggedRightHand.current.RightMiddleProximal), speed);
        rotateBone("rightMiddleIntermediate", handMap(riggedRightHand.current.RightMiddleIntermediate), speed);
        rotateBone("rightMiddleDistal", handMap(riggedRightHand.current.RightMiddleDistal), speed);
        rotateBone("rightThumbProximal", handMap(riggedRightHand.current.RightThumbProximal), speed);
        rotateBone("rightThumbMetacarpal", handMap(riggedRightHand.current.RightThumbIntermediate), speed);
        rotateBone("rightThumbDistal", handMap(riggedRightHand.current.RightThumbDistal), speed);
        rotateBone("rightLittleProximal", handMap(riggedRightHand.current.RightLittleProximal), speed);
        rotateBone("rightLittleIntermediate", handMap(riggedRightHand.current.RightLittleIntermediate), speed);
        rotateBone("rightLittleDistal", handMap(riggedRightHand.current.RightLittleDistal), speed);
      }
    } else {
      // --- CHAT MODE (or Mimic mode, camera off) ---
      // This is the original logic from your file's `if (!videoElement)` block
      // We use the Leva controls as a fallback.
      userData.vrm.expressionManager.setValue("angry", angry);
      userData.vrm.expressionManager.setValue("sad", sad);
      userData.vrm.expressionManager.setValue("happy", happy);

      [
        {
          name: "aa",
          value: aa,
        },
        {
          name: "ih",
          value: ih,
        },
        {
          name: "ee",
          value: ee,
        },
        {
          name: "oh",
          value: oh,
        },
        {
          name: "ou",
          value: ou,
        },
        {
          name: "blinkLeft",
          value: blinkLeft,
        },
        {
          name: "blinkRight",
          value: blinkRight,
        },
      ].forEach((item) => {
        lerpExpression(item.name, item.value, delta * 12);
      });
    }

    // This updates the VRM model in ALL modes
    userData.vrm.update(delta);
  });

  // --- LookAt setup (no change) ---
  const lookAtDestination = useRef(new Vector3(0, 0, 0));
  const camera = useThree((state) => state.camera);
  const lookAtTarget = useRef();
  useEffect(() => {
    lookAtTarget.current = new Object3D();
    camera.add(lookAtTarget.current);
  }, [camera]);

  // --- Return JSX (no change) ---
  return (
    <group {...props}>
      <primitive
        object={scene}
        rotation-y={avatar !== "3636451243928341470.vrm" ? Math.PI : 0}
      />
    </group>
  );
};