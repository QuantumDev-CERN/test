import { Button } from "../components/ui/button";
// Using public path for images in Next.js
const starsBg = "/assets/stars.png";
const gridLines = "/assets/grid-lines.png";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimate, useInView } from "framer-motion";

export const CallToAction = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [contentScope, animate] = useAnimate();
  
  // Handle mouse move to update the light position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };
  
  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    setMousePosition({ x: 50, y: 50 }); // Center position
  };
  
  // Apply entrance animation when component comes into view
  useEffect(() => {
    if (isInView) {
      animate(
        contentScope.current,
        { opacity: 1, y: 0 },
        { duration: 0.8, ease: "easeOut" }
      );
    }
  }, [isInView, animate, contentScope]);
  
  // Default position for light effect
  useEffect(() => {
    setMousePosition({ x: 50, y: 50 });
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div 
          ref={containerRef}
          className="border border-white/15 rounded-xl overflow-hidden relative"
          style={{
            backgroundImage: `url(${starsBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid overlay with radial gradient mask - Now following mouse position */}
          <div 
            className="absolute inset-0 bg-[rgb(28,86,26)] bg-blend-overlay transition-[mask-position] duration-200 ease-out"
            style={{
              backgroundImage: `url(${gridLines})`,
              maskImage: `radial-gradient(80% 80% at ${mousePosition.x}% ${mousePosition.y}%, black, transparent)`,
            }}
          ></div>
          
          {/* Content with entrance animation */}
          <motion.div 
            ref={contentScope}
            initial={{ opacity: 0, y: 40 }}
            className="relative py-24 px-4 z-10 flex flex-col items-center"
          >
            <h2 className="text-5xl md:text-6xl max-w-md mx-auto tracking-tighter text-center font-medium text-white">
              Empowering Innovation at IIIT Sonepat.
            </h2>
            <p className="text-center md:text-xl max-w-md mx-auto text-lg text-white/70 mt-5 tracking-tight">
              The Technical Society of IIIT Sonepat unites all technical clubs under one vision — fostering innovation, collaboration, and excellence in technology. 
              From coding and design to robotics and AI — this is where every idea finds a place to grow.
            </p>
            <div className="mt-12">
              <Button>
                Explore the Society
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
