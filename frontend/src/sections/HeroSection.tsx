import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

const AnimatedTyping = () => {
  const words = useMemo(() => ["engineers.", "coders","developers.", "marketing.", "designers.","photographers." ], []);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    if (isWaiting) {
      const waitTimer = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(waitTimer);
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
        } else {
          setIsWaiting(true);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, isWaiting, currentWordIndex, words]);

  return (
    <span className="relative">
      <span className="font-dancing-script italic text-white font-medium">
        {currentText}
      </span>
      <span className="animate-pulse text-white ml-1">|</span>
    </span>
  );
};

const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative container px-4 pt-40 pb-20"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[#0A0A0A]" />

      <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Column - Text Content */}
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-normal mb-4 tracking-tight text-left">
            <span className="text-gray-200">
            Club with the best
            </span>
            <br />
            <span className="text-white font-medium">
              <AnimatedTyping />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-200 mb-8 text-left"
          >
            The Technical Society of IIIT Sonepat fosters a culture of learning, exploration, and creation. 
            Collaborate beyond the classroom. Where the most innovation happens.{" "}
            <span className="text-white">Join us and shape the future of tech at IIIT Sonepat.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 items-start"
          >
            <Button size="lg" className="button-gradient">
              Explore Our Clubs
            </Button>
          </motion.div>
        </div>

        {/* Right Column - 3D Model */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative h-[600px] lg:h-[700px]"
        >
          <iframe
            src="https://my.spline.design/robotfollowcursorforlandingpage-CPCuR8xEmwQIX4xO2zKGoqRv/"
            frameBorder="0"
            width="100%"
            height="100%"
            className="rounded-xl"
            title="3D Robot Model"
          />
        </motion.div>
      </div>

      {/* Dashboard Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative mx-auto max-w-5xl mt-20"
      >
        <div className="glass rounded-xl overflow-hidden">
          <Image
            src="/images/c32c6788-5e4a-4fee-afee-604b03113c7f.png"
            alt="Technical Society Dashboard"
            width={1200}
            height={600}
            className="w-full h-auto"
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
