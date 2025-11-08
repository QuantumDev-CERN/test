import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";

// --- FIXES ---
import { Suspense } from "react"; // 1. This import was missing
import { CameraWidget } from "./components/CameraWidget"; // 2. This import was missing
// ---------------

function App() {
  return (
    <>
      <Loader />
      <Leva hidden />
      <UI />
      <CameraWidget /> {/* This line (13) will now work */}
      <Loader />
      <Canvas shadows camera={{ position: [0.25, 0.25, 2], fov: 30 }}>
        <color attach="background" args={["#333"]} />
        <fog attach="fog" args={["#333", 10, 20]} />
        {/* <Stats /> */}
        <Suspense> {/* This line will now work */}
          <Experience />
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;