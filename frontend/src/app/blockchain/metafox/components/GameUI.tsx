'use client';

import { useEffect, useState } from 'react';

interface GameUIProps {
  showHelp: boolean;
  onCloseHelp: () => void;
}

const GameUI: React.FC<GameUIProps> = ({ showHelp, onCloseHelp }) => {
  const [helpOpacity, setHelpOpacity] = useState(0);

  useEffect(() => {
    setHelpOpacity(showHelp ? 1 : 0);
  }, [showHelp]);

  return (
    <>
      {/* Title */}
      <h1 className="absolute top-4 left-4 text-white font-nickname text-4xl leading-tight z-10 pointer-events-none">
        <span className="text-lg">( Not so Fantastic )</span>
        <br />
      </h1>

      {/* Help Panel */}
      <div 
        className="absolute left-8 bottom-8 bg-ghostwhite text-gray-800 rounded-full w-56 h-28 p-6 font-sans text-center text-xl font-semibold flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out z-20"
        style={{ opacity: helpOpacity }}
      >
        <div className="flex flex-col items-center justify-center space-y-1">
          <p>WALK: Arrows</p>
          <p>RUN: Arrows + Ctrl</p>
          <p>LOOK AROUND: Space</p>
          <p className="text-green-500">CHECKPOINTS: Walk near the glowing points</p>
        </div>
        
        <button
          onClick={onCloseHelp}
          className="absolute -right-2 -top-2 w-7 h-7 bg-gray-300 text-gray-800 text-xl leading-7 rounded-full hover:bg-gray-400 hover:text-white cursor-pointer transition-colors"
        >
          ✕
        </button>
      </div>
    </>
  );
};

export default GameUI;
