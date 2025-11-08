import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Face, Hand, Pose } from "kalidokit";
import { useControls } from "leva";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Euler, Object3D, Quaternion, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils.js";
import { useVideoRecognition } from "../hooks/useVideoRecognition";
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
    console.log("VRM loaded:", vrm);
    // calling these functions greatly improves the performance
    VRMUtils.removeUnnecessaryVertices(scene);
    VRMUtils.combineSkeletons(scene);
    VRMUtils.combineMorphs(vrm);

    // Disable frustum culling
    vrm.scene.traverse((obj) => {
      obj.frustumCulled = false;
    });
  }, [scene]);

  const setResultsCallback = useVideoRecognition(
    (state) => state.setResultsCallback
  );
  const videoElement = useVideoRecognition((state) => state.videoElement);
  const riggedFace = useRef();
  const riggedPose = useRef();
  const riggedLeftHand = useRef();
  const riggedRightHand = useRef();

  const resultsCallback = useCallback(
    (results) => {
      if (!videoElement || !currentVrm) {
        return;
      }
      if (results.faceLandmarks) {
        riggedFace.current = Face.solve(results.faceLandmarks, {
          runtime: "mediapipe", // `mediapipe` or `tfjs`
          video: videoElement,
          imageSize: { width: 640, height: 480 },
          smoothBlink: false, // smooth left and right eye blink delays
          blinkSettings: [0.25, 0.75], // adjust upper and lower bound blink sensitivity
        });
      }
      if (results.za && results.poseLandmarks) {
        riggedPose.current = Pose.solve(results.za, results.poseLandmarks, {
          runtime: "mediapipe",
          video: videoElement,
        });
      }

      // Switched left and right (Mirror effect)
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
  }, [resultsCallback]);

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

  useEffect(() => {
    if (animation === "None" || videoElement) {
      return;
    }
    actions[animation]?.play();
    return () => {
      actions[animation]?.stop();
    };
  }, [actions, animation, videoElement]);

  const lerpExpression = (name, value, lerpFactor) => {
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
    const bone = userData.vrm.humanoid.getNormalizedBoneNode(boneName);
    if (!bone) {
      console.warn(
        `Bone ${boneName} not found in VRM humanoid. Check the bone name.`
      );
      console.log("userData.vrm.humanoid.bones", userData.vrm.humanoid);
      return;
    }

    tmpEuler.set(value.x * flip.x, value.y * flip.y, value.z * flip.z);
    tmpQuat.setFromEuler(tmpEuler);
    bone.quaternion.slerp(tmpQuat, slerpFactor);
  };

useFrame((_, delta) => {
  if (!userData.vrm) {
    return;
  }
  userData.vrm.expressionManager.setValue("angry", angry);
  userData.vrm.expressionManager.setValue("sad", sad);
  userData.vrm.expressionManager.setValue("happy", happy);

  if (!videoElement) {
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
  } else {
    // This is the fix for your 'pupil' error
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
  }

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

    // --- FINGER & WRIST SOLUTION ---
    if (riggedLeftHand.current) {
      const amp = 3; // Amplification for "subtle" wiggle
      const speed = delta * 2; // "CALM" speed

      // --- MAPPING 1: FOR ALL FINGERS (inc. THUMB) ---
      // User reported "fingers are right" and "thumb is inverted"
      // This means they should ALL use the same map!
      const handMap = (data) => ({
        x: data.x * amp,
        y: -data.z , // <-- INVERTED BEND (Proven correct for fingers)
        z: -data.y,
      });

      // --- MAPPING 2: WRIST TEST 1 (Find the Bend) ---
      const wristMap = (data) => ({ x: data.z, y: data.y, z:  -data.x })

      // --- APPLY WRIST MAP ---
      rotateBone(
        "leftHand",
        wristMap(riggedLeftHand.current.LeftWrist),
        speed
      );

      // --- APPLY HAND MAP (Fingers + Thumb) ---
      // Ring
      rotateBone(
        "leftRingProximal",
        handMap(riggedLeftHand.current.LeftRingProximal),
        speed
      );
      rotateBone(
        "leftRingIntermediate",
        handMap(riggedLeftHand.current.LeftRingIntermediate),
        speed
      );
      rotateBone(
        "leftRingDistal",
        handMap(riggedLeftHand.current.LeftRingDistal),
        speed
      );
      // Index
      rotateBone(
        "leftIndexProximal",
        handMap(riggedLeftHand.current.LeftIndexProximal),
        speed
      );
      rotateBone(
        "leftIndexIntermediate",
        handMap(riggedLeftHand.current.LeftIndexIntermediate),
        speed
      );
      rotateBone(
        "leftIndexDistal",
        handMap(riggedLeftHand.current.LeftIndexDistal),
        speed
      );
      // Middle
      rotateBone(
        "leftMiddleProximal",
        handMap(riggedLeftHand.current.LeftMiddleProximal),
        speed
      );
      rotateBone(
        "leftMiddleIntermediate",
        handMap(riggedLeftHand.current.LeftMiddleIntermediate),
        speed
      );
      rotateBone(
        "leftMiddleDistal",
        handMap(riggedLeftHand.current.LeftMiddleDistal),
        speed
      );
      // Thumb
      rotateBone(
        "leftThumbProximal",
        handMap(riggedLeftHand.current.LeftThumbProximal),
        speed
      );
      rotateBone(
        "leftThumbMetacarpal",
        handMap(riggedLeftHand.current.LeftThumbIntermediate),
        speed
      );
      rotateBone(
        "leftThumbDistal",
        handMap(riggedLeftHand.current.LeftThumbDistal),
        speed
      );
      // Little
      rotateBone(
        "leftLittleProximal",
        handMap(riggedLeftHand.current.LeftLittleProximal),
        speed
      );
      rotateBone(
        "leftLittleIntermediate",
        handMap(riggedLeftHand.current.LeftLittleIntermediate),
        speed
      );
      rotateBone(
        "leftLittleDistal",
        handMap(riggedLeftHand.current.LeftLittleDistal),
        speed
      );
    }

    if (riggedRightHand.current) {
      // (Applying the same logic to the right hand)
      const amp = 3;
      const speed = delta * 2;
      const handMap = (data) => ({
        x: -data.x * amp,
        y: data.z, // <-- INVERTED BEND (Proven correct for fingers)
        z: data.y,
      });
      const wristMap =  (data) => ({ x: -data.z, y: -data.y, z:  data.x })
      



      // --- APPLY WRIST MAP ---
      rotateBone(
        "rightHand",
        wristMap(riggedRightHand.current.RightWrist),
        speed
      );

      // --- APPLY HAND MAP (Fingers + Thumb) ---
      // Right Ring
      rotateBone(
        "rightRingProximal",
        handMap(riggedRightHand.current.RightRingProximal),
        speed
      );
      rotateBone(
        "rightRingIntermediate",
        handMap(riggedRightHand.current.RightRingIntermediate),
        speed
      );
      rotateBone(
        "rightRingDistal",
        handMap(riggedRightHand.current.RightRingDistal),
        speed
      );
      // Right Index
      rotateBone(
        "rightIndexProximal",
        handMap(riggedRightHand.current.RightIndexProximal),
        speed
      );
      rotateBone(
        "rightIndexIntermediate",
        handMap(riggedRightHand.current.RightIndexIntermediate),
        speed
      );
      rotateBone(
        "rightIndexDistal",
        handMap(riggedRightHand.current.RightIndexDistal),
        speed
      );
      // Right Middle
      rotateBone(
        "rightMiddleProximal",
        handMap(riggedRightHand.current.RightMiddleProximal),
        speed
      );
      rotateBone(
        "rightMiddleIntermediate",
        handMap(riggedRightHand.current.RightMiddleIntermediate),
        speed
      );
      rotateBone(
        "rightMiddleDistal",
        handMap(riggedRightHand.current.RightMiddleDistal),
        speed
      );
      // Right Thumb
      rotateBone(
        "rightThumbProximal",
        handMap(riggedRightHand.current.RightThumbProximal),
        speed
      );
      rotateBone(
        "rightThumbMetacarpal",
        handMap(riggedRightHand.current.RightThumbIntermediate),
        speed
      );
      rotateBone(
        "rightThumbDistal",
        handMap(riggedRightHand.current.RightThumbDistal),
        speed
      );
      // Right Little
      rotateBone(
        "rightLittleProximal",
        handMap(riggedRightHand.current.RightLittleProximal),
        speed
      );
      rotateBone(
        "rightLittleIntermediate",
        handMap(riggedRightHand.current.RightLittleIntermediate),
        speed
      );
      rotateBone(
        "rightLittleDistal",
        handMap(riggedRightHand.current.RightLittleDistal),
        speed
      );
    }
  }

  userData.vrm.update(delta);
});
  const lookAtDestination = useRef(new Vector3(0, 0, 0));
  const camera = useThree((state) => state.camera);
  const lookAtTarget = useRef();
  useEffect(() => {
    lookAtTarget.current = new Object3D();
    camera.add(lookAtTarget.current);
  }, [camera]);

  return (
    <group {...props}>
      <primitive
        object={scene}
        rotation-y={avatar !== "3636451243928341470.vrm" ? Math.PI : 0}
      />
    </group>
  );
};