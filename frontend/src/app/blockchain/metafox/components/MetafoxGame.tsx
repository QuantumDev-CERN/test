'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GameUI from './GameUI';
import CheckpointLabel from './CheckpointLabel';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MetafoxGameProps {}

const MetafoxGame: React.FC<MetafoxGameProps> = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  
  // Animation actions
  const walkActionRef = useRef<THREE.AnimationAction | null>(null);
  const lookAroundActionRef = useRef<THREE.AnimationAction | null>(null);
  const runActionRef = useRef<THREE.AnimationAction | null>(null);
  
  // Checkpoint refs
  const checkpoint1Ref = useRef<THREE.Mesh | null>(null);
  const checkpoint2Ref = useRef<THREE.Mesh | null>(null);
  const checkpoint1RingRef = useRef<THREE.Mesh | null>(null);
  const checkpoint2RingRef = useRef<THREE.Mesh | null>(null);
  
  // Game state
  const [showHelp, setShowHelp] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [checkpoint1Position] = useState<THREE.Vector3>(new THREE.Vector3(-15, 3, -10));
  const [checkpoint2Position] = useState<THREE.Vector3>(new THREE.Vector3(15, 3, -10));

  useEffect(() => {
    if (!mountRef.current) return;
    
    const mountElement = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00aaff);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(2, 8, 12);
    cameraRef.current = camera;
    setCameraReady(true);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountElement.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Load Fox model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/models/Fox/glTF/Fox.gltf',
      (gltf) => {
        const model = gltf.scene.children[0];
        model.scale.set(0.025, 0.025, 0.025);
        scene.add(model);
        modelRef.current = model;

        // Setup animations
        const mixer = new THREE.AnimationMixer(model);
        mixerRef.current = mixer;
        
        walkActionRef.current = mixer.clipAction(gltf.animations[1]);
        lookAroundActionRef.current = mixer.clipAction(gltf.animations[0]);
        runActionRef.current = mixer.clipAction(gltf.animations[2]);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    // Ground setup
    const textureLoader = new THREE.TextureLoader();
    const groundTexture = textureLoader.load('/textures/ground.png');
    groundTexture.magFilter = THREE.NearestFilter;
    groundTexture.repeat.set(64, 64);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(160, 160),
      new THREE.MeshStandardMaterial({
        map: groundTexture,
        emissive: 0x222222,
        emissiveIntensity: 0.3,
      })
    );
    ground.receiveShadow = true;
    ground.rotation.x = -Math.PI * 0.5;
    scene.add(ground);

    // Checkpoint 1: Install Metamask
    const checkpoint1Geometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16);
    const checkpoint1Material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 1.5
    });
    const checkpoint1 = new THREE.Mesh(checkpoint1Geometry, checkpoint1Material);
    checkpoint1.position.set(-15, 0.1, -10);
    checkpoint1.receiveShadow = true;
    scene.add(checkpoint1);
    checkpoint1Ref.current = checkpoint1;

    // Checkpoint 1 Text Ring
    const checkpoint1RingGeometry = new THREE.TorusGeometry(2, 0.1, 8, 16);
    const checkpoint1RingMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 2.0
    });
    const checkpoint1Ring = new THREE.Mesh(checkpoint1RingGeometry, checkpoint1RingMaterial);
    checkpoint1Ring.position.set(-15, 0.5, -10);
    checkpoint1Ring.rotation.x = -Math.PI * 0.5;
    scene.add(checkpoint1Ring);
    checkpoint1RingRef.current = checkpoint1Ring;

    // Checkpoint 2: Make test transaction
    const checkpoint2Geometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16);
    const checkpoint2Material = new THREE.MeshStandardMaterial({
      color: 0xff4400,
      emissive: 0xff4400,
      emissiveIntensity: 1.5
    });
    const checkpoint2 = new THREE.Mesh(checkpoint2Geometry, checkpoint2Material);
    checkpoint2.position.set(15, 0.1, -10);
    checkpoint2.receiveShadow = true;
    scene.add(checkpoint2);
    checkpoint2Ref.current = checkpoint2;

    // Checkpoint 2 Text Ring
    const checkpoint2RingGeometry = new THREE.TorusGeometry(2, 0.1, 8, 16);
    const checkpoint2RingMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4400,
      emissive: 0xff4400,
      emissiveIntensity: 2.0
    });
    const checkpoint2Ring = new THREE.Mesh(checkpoint2RingGeometry, checkpoint2RingMaterial);
    checkpoint2Ring.position.set(15, 0.5, -10);
    checkpoint2Ring.rotation.x = -Math.PI * 0.5;
    scene.add(checkpoint2Ring);
    checkpoint2RingRef.current = checkpoint2Ring;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.castShadow = false;
    directionalLight.position.set(-5, 5, 5);
    scene.add(directionalLight);

    // Fog
    const fog = new THREE.Fog("#00aaff", 10, 40);
    scene.fog = fog;

    // Animation loop
    const clock = new THREE.Clock();
    let previousTime = 0;
    const cameraOffset = new THREE.Vector3(-4.0, 4.0, 7.0);
    const modelPosition = new THREE.Vector3();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;

      // Update mixer
      if (mixerRef.current) {
        mixerRef.current.update(deltaTime);
      }

      if (modelRef.current) {
        modelRef.current.getWorldPosition(modelPosition);
      }

      // Animate checkpoints
      if (checkpoint1RingRef.current) {
        checkpoint1RingRef.current.rotation.z += 0.02;
        checkpoint1RingRef.current.position.y = 0.5 + Math.sin(elapsedTime * 2) * 0.2;
      }
      
      if (checkpoint2RingRef.current) {
        checkpoint2RingRef.current.rotation.z -= 0.02;
        checkpoint2RingRef.current.position.y = 0.5 + Math.sin(elapsedTime * 2 + Math.PI) * 0.2;
      }

      // Update camera
      camera.position.copy(modelPosition).add(cameraOffset);
      camera.lookAt(modelPosition);

      // Render
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountElement && renderer.domElement) {
        mountElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Movement controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modelRef.current || !walkActionRef.current || !runActionRef.current) return;

      const isRunning = e.ctrlKey;
      const walkingSpeed = 0.1;
      const runningSpeed = 0.3;
      const speed = isRunning ? runningSpeed : walkingSpeed;

      // UP
      if (e.key === "ArrowUp") {
        if (modelRef.current.rotation.y !== Math.PI) {
          modelRef.current.rotation.y = Math.PI;
        }
        modelRef.current.position.z -= speed;
        
        if (isRunning) {
          walkActionRef.current.stop();
          runActionRef.current.play();
        } else {
          runActionRef.current.stop();
          walkActionRef.current.play();
        }
      }
      // DOWN
      else if (e.key === "ArrowDown") {
        if (modelRef.current.rotation.y !== 0) {
          modelRef.current.rotation.y = 0;
        }
        modelRef.current.position.z += speed;
        
        if (isRunning) {
          walkActionRef.current.stop();
          runActionRef.current.play();
        } else {
          runActionRef.current.stop();
          walkActionRef.current.play();
        }
      }
      // RIGHT
      else if (e.key === "ArrowRight") {
        if (modelRef.current.rotation.y !== Math.PI / 2) {
          modelRef.current.rotation.y = Math.PI / 2;
        }
        modelRef.current.position.x += speed;
        
        if (isRunning) {
          walkActionRef.current.stop();
          runActionRef.current.play();
        } else {
          runActionRef.current.stop();
          walkActionRef.current.play();
        }
      }
      // LEFT
      else if (e.key === "ArrowLeft") {
        if (modelRef.current.rotation.y !== -Math.PI / 2) {
          modelRef.current.rotation.y = -Math.PI / 2;
        }
        modelRef.current.position.x -= speed;
        
        if (isRunning) {
          walkActionRef.current.stop();
          runActionRef.current.play();
        } else {
          runActionRef.current.stop();
          walkActionRef.current.play();
        }
      }
      // LOOK AROUND
      else if (e.key === " ") {
        if (lookAroundActionRef.current) {
          lookAroundActionRef.current.play();
        }
      }
      // HELP
      else if (e.key === "i" || e.key === "I") {
        setShowHelp(!showHelp);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!walkActionRef.current || !runActionRef.current || !lookAroundActionRef.current) return;

      if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "ArrowLeft") {
        walkActionRef.current.stop();
        runActionRef.current.stop();
      } else if (e.key === " ") {
        lookAroundActionRef.current.stop();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [showHelp]);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      <GameUI showHelp={showHelp} onCloseHelp={() => setShowHelp(false)} />
      {cameraReady && cameraRef.current && (
        <>
          <CheckpointLabel 
            id="checkpoint1-label"
            position={checkpoint1Position}
            camera={cameraRef.current}
            text="Install Metamask"
            subtext="Checkpoint"
            color="#00ff00"
            modelPosition={modelRef.current?.position}
          />
          <CheckpointLabel 
            id="checkpoint2-label"
            position={checkpoint2Position}
            camera={cameraRef.current}
            text="Make Test Transaction"
            subtext="Checkpoint"
            color="#ff4400"
            modelPosition={modelRef.current?.position}
          />
        </>
      )}
    </div>
  );
};

export default MetafoxGame;
