import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Face, Hand, Pose } from "kalidokit";
import { useControls } from "leva"; // We keep this import
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Euler, Object3D, Quaternion, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils.js";
import { useChat } from "../hooks/useChat"; // Changed from useVideoRecognition
import { remapMixamoAnimationToVrm } from "../utils/remapMixamoAnimationToVrm";

const tmpVec3 = new Vector3();
const tmpQuat = new Quaternion();
const tmpEuler = new Euler();

// <-- NOTE: We remove 'avatar' from the props, as this component now manages it.
export const VRMAvatar = ({ ...props }) => {

  // --- THIS IS THE FIX (Part 1) ---
  // We moved the Leva controls from Experience.jsx into this component.
  // This hook will now only run when mode === "mimic".
  const {
    avatar,
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
    avatar: {
      value: "3859814441197244330.vrm",
      options: [
        "262410318834873893.vrm",
        "3859814441197244330.vrm",
        "3636451243928341470.vrm",
        "8087383217573817818.vrm",
      ],
    },
    // The rest of the controls from the original file
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
  // ---------------------------------

  const { scene, userData } = useGLTF(
    `models/${avatar}`, // <-- This now uses the 'avatar' from the hook above
    undefined,
    undefined,
    (loader) => {
      loader.register((parser) => {
        return new VRMLoaderPlugin(parser);
      });
    }
  );

  const assetA = useFBX("models/animations/Swing Dancing.fbx");
  const assetB = useFBX("models/animations/Thriller Part 2.fbx");
  const assetC = useFBX("models/animations/Breathing Idle.fbx");

  const currentVrm = userData.vrm;

  const animationClipA = useMemo(() => {
    if (!currentVrm) return null;
    const clip = remapMixamoAnimationToVrm(currentVrm, assetA);
    clip.name = "Swing Dancing";
    return clip;
  }, [assetA, currentVrm]);

  const animationClipB = useMemo(() => {
    if (!currentVrm) return null;
    const clip = remapMixamoAnimationToVrm(currentVrm, assetB);
    clip.name = "Thriller Part 2";
    return clip;
  }, [assetB, currentVrm]);

  const animationClipC = useMemo(() => {
    if (!currentVrm) return null;
    const clip = remapMixamoAnimationToVrm(currentVrm, assetC);
    clip.name = "Idle";
    return clip;
  }, [assetC, currentVrm]);

  const { actions } = useAnimations(
    [animationClipA, animationClipB, animationClipC].filter(Boolean),
    currentVrm?.scene
  );

  useEffect(() => {
    if (!currentVrm) return;
    const vrm = currentVrm;
    VRMUtils.removeUnnecessaryVertices(scene);
    VRMUtils.combineSkeletons(scene);
    VRMUtils.combineMorphs(vrm);

    vrm.scene.traverse((obj) => {
      obj.frustumCulled = false;
    });
  }, [scene, currentVrm]);

  // --- Use the new unified useChat hook ---
  const { mode, videoElement, setResultsCallback } = useChat();

  const riggedFace = useRef();
  const riggedPose = useRef();
  const riggedLeftHand = useRef();
  const riggedRightHand = useRef();

  const resultsCallback = useCallback(
    (results) => {
      // Guard clause: only run if in "mimic" mode
      if (useChat.getState().mode !== "mimic" || !videoElement || !currentVrm) {
        riggedFace.current = null;
        riggedPose.current = null;
        riggedLeftHand.current = null;
        riggedRightHand.current = null;
        return;
      }
      
      // ... (rest of Kalidokit logic is unchanged) ...
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

  useEffect(() => {
    setResultsCallback(resultsCallback);
  }, [resultsCallback, setResultsCallback]);


  useEffect(() => {
    // Only control animations from Leva if in mimic mode
    if (mode === 'mimic') {
      if (animation === "None" || videoElement) {
        actions["Idle"]?.play();
        return () => { actions["Idle"]?.stop(); };
      }
      actions[animation]?.play();
      return () => { actions[animation]?.stop(); };
    }
  }, [actions, animation, videoElement, mode]);

  const lerpExpression = (name, value, lerpFactor) => {
    if (!currentVrm) return;
    currentVrm.expressionManager.setValue(
      name,
      lerp(currentVrm.expressionManager.getValue(name), value, lerpFactor)
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
    if (!currentVrm) return;
    const bone = currentVrm.humanoid.getNormalizedBoneNode(boneName);
    if (!bone) { return; }
    tmpEuler.set(value.x * flip.x, value.y * flip.y, value.z * flip.z);
    tmpQuat.setFromEuler(tmpEuler);
    bone.quaternion.slerp(tmpQuat, slerpFactor);
  };

  useFrame((_, delta) => {
    if (!currentVrm) {
      return;
    }

    // --- This is the key logic ---
    // Only run rigging if in "mimic" mode
    if (mode === "mimic" && videoElement) {
      // --- MIMIC MODE (PROJECT 1 LOGIC) ---
      currentVrm.expressionManager.setValue("angry", angry);
      currentVrm.expressionManager.setValue("sad", sad);
      currentVrm.expressionManager.setValue("happy", happy);

      if (riggedFace.current) {
        // ... (Face rigging)
        [
          { name: "aa", value: riggedFace.current.mouth.shape.A },
          { name: "ih", value: riggedFace.current.mouth.shape.I },
          { name: "ee", value: riggedFace.current.mouth.shape.E },
          { name: "oh", value: riggedFace.current.mouth.shape.O },
          { name: "ou", value: riggedFace.current.mouth.shape.U },
          { name: "blinkLeft", value: 1 - riggedFace.current.eye.l },
          { name: "blinkRight", value: 1 - riggedFace.current.eye.r },
        ].forEach((item) => {
          lerpExpression(item.name, item.value, delta * 12);
        });

        if (lookAtTarget.current && riggedFace.current.pupil) {
          currentVrm.lookAt.target = lookAtTarget.current;
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
        if (riggedFace.current.head) {
          rotateBone("neck", riggedFace.current.head, delta * 5, {
            x: 0.7, y: 0.7, z: 0.7,
          });
        }
      }
      if (riggedPose.current) {
        // ... (Pose rigging)
        rotateBone("chest", riggedPose.current.Spine, delta * 5, { x: 0.3, y: 0.3, z: 0.3 });
        rotateBone("spine", riggedPose.current.Spine, delta * 5, { x: 0.3, y: 0.3, z: 0.3 });
        rotateBone("hips", riggedPose.current.Hips.rotation, delta * 5, { x: 0.7, y: 0.7, z: 0.7 });
        rotateBone("leftUpperArm", riggedPose.current.LeftUpperArm, delta * 5);
        rotateBone("leftLowerArm", riggedPose.current.LeftLowerArm, delta * 5);
        rotateBone("rightUpperArm", riggedPose.current.RightUpperArm, delta * 5);
        rotateBone("rightLowerArm", riggedPose.current.RightLowerArm, delta * 5);
      }
      if (riggedLeftHand.current) {
        // ... (Left hand rigging)
        const amp = 3, speed = delta * 2;
        const handMap = (data) => ({ x: data.x * amp, y: -data.z, z: -data.y });
        const wristMap = (data) => ({ x: data.z, y: data.y, z: -data.x });
        rotateBone("leftHand", wristMap(riggedLeftHand.current.LeftWrist), speed);
        // ... all other left hand bones
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
        // ... (Right hand rigging)
        const amp = 3, speed = delta * 2;
        const handMap = (data) => ({ x: -data.x * amp, y: data.z, z: data.y });
        const wristMap = (data) => ({ x: -data.z, y: -data.y, z: data.x });
        rotateBone("rightHand", wristMap(riggedRightHand.current.RightWrist), speed);
        // ... all other right hand bones
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
      // --- FALLBACK / CHAT MODE IDLE ---
      // If we are in "chat" mode, this component is visible but
      // the ChatbotAvatar is NOT. So we just use Leva controls.
      currentVrm.expressionManager.setValue("angry", angry);
      currentVrm.expressionManager.setValue("sad", sad);
      currentVrm.expressionManager.setValue("happy", happy);
      [
        { name: "aa", value: aa },
        { name: "ih", value: ih },
        { name: "ee", value: ee },
        { name: "oh", value: oh },
        { name: "ou", value: ou },
        { name: "blinkLeft", value: blinkLeft },
        { name: "blinkRight", value: blinkRight },
      ].forEach((item) => {
        lerpExpression(item.name, item.value, delta * 12);
      });
    }

    currentVrm.update(delta);
  });
  
  const lookAtDestination = useRef(new Vector3(0, 0, 0));
  const camera = useThree((state) => state.camera);
  const lookAtTarget = useRef();
  useEffect(() => {
    lookAtTarget.current = new Object3D();
    camera.add(lookAtTarget.current);
  }, [camera]);

  if (!currentVrm) {
    return null;
  }

  return (
    <group {...props}>
      <primitive
        object={scene}
        rotation-y={avatar !== "3636451243928341470.vrm" ? Math.PI : 0}
      />
    </group>
  );
};