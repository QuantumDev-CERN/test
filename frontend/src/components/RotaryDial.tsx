import React, { useState, useRef } from "react";

const RotaryDial = () => {
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const dialSize = 220;
  const numbers = [7, 6, 5, 4, 3, 2, 1, 0, 9, 8];

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    setIsAnimating(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const deltaY = startY.current - e.clientY;
    const newRotation = Math.min(Math.max(deltaY * 2, -150), 0);
    setRotation(newRotation);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    setIsAnimating(true);
    setRotation(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startY.current = e.touches[0].clientY;
    setIsAnimating(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const deltaY = startY.current - e.touches[0].clientY;
    const newRotation = Math.min(Math.max(deltaY * 2, -150), 0);
    setRotation(newRotation);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    setIsAnimating(true);
    setRotation(0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("isafwansayeed@gmail.com");
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative rounded-full bg-slate-700 shadow-lg cursor-pointer select-none flex items-center justify-center touch-none"
        style={{
          width: dialSize,
          height: dialSize,
          transform: `rotate(${rotation}deg)`,
          transition: isAnimating
            ? "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
            : "none",
          touchAction: "none",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full bg-red-600 z-10" />
        <div className="absolute left-5 transform w-20 h-5 bg-gray-600 rounded-lg" />

        {numbers.map((num, index) => {
          const angle = index * 36 - 90;
          const radius = dialSize / 2 - 35;
          return (
            <div
              key={num}
              className="absolute text-gray-100 text-xl font-bold w-[30px] h-[30px] flex items-center justify-center"
              style={{
                transform: `
                  rotate(${angle}deg) 
                  translate(${radius}px) 
                  rotate(${-angle}deg)
                `,
              }}
            >
              {num}
            </div>
          );
        })}
      </div>

      <div
        className="flex items-center gap-2.5 cursor-pointer mt-4 p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
        onClick={handleCopy}
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {hasCopied ? (
            <path d="M20 6L9 17l-5-5" stroke="#4CAF50" />
          ) : (
            <path
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              stroke="#ecf0f1"
            />
          )}
        </svg>
        <span className="text-gray-100 text-base font-bold">
          technicalsociety@iiitsonepat.ac.in
        </span>
      </div>
    </div>
  );
};

export default RotaryDial;
