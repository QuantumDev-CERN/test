import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import svgList from "../constants/icons";

const SVGS_PER_ROW = 5;
const ROW_HEIGHT = 64;

interface TechIconProps {
  svg: string;
  index: number;
}

const TechIcon = React.memo(function TechIcon({ svg, index }: TechIconProps) {
  return (
    <motion.div
      className="relative w-8 h-8 sm:w-12 sm:h-12"
      whileHover={{ scale: 1.2, rotate: 10, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.8, rotate: -10, transition: { duration: 0.2 } }}
      style={{ willChange: "transform" }}
    >
      <Image
        src={svg}
        alt={`Tech Icon ${index + 1}`}
        width={64}
        height={64}
        className="w-full h-full object-contain drop-shadow-md"
        style={{ willChange: "transform" }}
      />
    </motion.div>
  );
});

TechIcon.displayName = "TechIcon";

export default function AnimatedCoding() {
  const doubledSvgList = useMemo(() => [...svgList, ...svgList], []);
  const rows = useMemo(() => Math.ceil(svgList.length / SVGS_PER_ROW), []);
  const contentHeight = rows * ROW_HEIGHT;
  const animationDuration = contentHeight / 12;

  return (
    <div
      className="w-full h-[276px] flex justify-center items-center overflow-hidden bg-transparent"
      style={{ willChange: "transform" }}
    >
      <motion.div
        className="grid w-full max-w-[360px] h-full grid-cols-5 gap-4"
        initial={{ y: 0 }}
        animate={{ y: -contentHeight }}
        transition={{
          duration: animationDuration,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ willChange: "transform" }}
      >
        {doubledSvgList.map((svg, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center w-full h-full"
          >
            <TechIcon svg={svg} index={idx} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
