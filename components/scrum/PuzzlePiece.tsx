import React from "react";
import { motion } from "framer-motion";

interface PuzzlePieceProps {
  title: string;
  color: string;
  index: number;
  isExploded: boolean;
}

const getPuzzlePath = (index: number): string => {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const hasTop = row > 0;
  const hasBottom = row < 2;
  const hasLeft = col > 0;
  const hasRight = col < 2;

  // Size parameters
  const size = 192; // Base size
  const tabSize = 30; // Tab size
  const radius = 20; // Corner radius
  const inset = 0; // No inset needed for this style

  let path = `M ${radius},0`; // Start with top-left rounded corner

  // Top edge
  if (hasTop) {
    path += ` h ${(size - tabSize) / 2 - radius}`; // Line to tab
    path += ` q ${tabSize / 4},0 ${tabSize / 4},-${tabSize / 2}`; // Tab curve in
    path += ` h ${tabSize / 2}`; // Tab top
    path += ` q ${tabSize / 4},${tabSize / 2} ${tabSize / 4},${tabSize / 2}`; // Tab curve out
    path += ` h ${(size - tabSize) / 2 - radius}`; // Line to corner
  } else {
    path += ` h ${size - radius * 2}`; // Straight line
  }
  path += ` q ${radius},0 ${radius},${radius}`; // Top-right corner

  // Right edge
  if (hasRight) {
    path += ` v ${(size - tabSize) / 2 - radius}`;
    path += ` q 0,${tabSize / 4} ${tabSize / 2},${tabSize / 4}`;
    path += ` v ${tabSize / 2}`;
    path += ` q -${tabSize / 2},0 -${tabSize / 2},${tabSize / 4}`;
    path += ` v ${(size - tabSize) / 2 - radius}`;
  } else {
    path += ` v ${size - radius * 2}`;
  }
  path += ` q 0,${radius} -${radius},${radius}`; // Bottom-right corner

  // Bottom edge
  if (hasBottom) {
    path += ` h -${(size - tabSize) / 2 - radius}`;
    path += ` q -${tabSize / 4},0 -${tabSize / 4},${tabSize / 2}`;
    path += ` h -${tabSize / 2}`;
    path += ` q -${tabSize / 4},-${tabSize / 2} -${tabSize / 4},-${
      tabSize / 2
    }`;
    path += ` h -${(size - tabSize) / 2 - radius}`;
  } else {
    path += ` h -${size - radius * 2}`;
  }
  path += ` q -${radius},0 -${radius},-${radius}`; // Bottom-left corner

  // Left edge
  if (hasLeft) {
    path += ` v -${(size - tabSize) / 2 - radius}`;
    path += ` q 0,-${tabSize / 4} -${tabSize / 2},-${tabSize / 4}`;
    path += ` v -${tabSize / 2}`;
    path += ` q ${tabSize / 2},0 ${tabSize / 2},-${tabSize / 4}`;
    path += ` v -${(size - tabSize) / 2 - radius}`;
  } else {
    path += ` v -${size - radius * 2}`;
  }
  path += ` q 0,-${radius} ${radius},-${radius}`; // Back to start

  path += " Z"; // Close the path
  return path;
};

const pieceVariants = {
  initial: {
    scale: 0,
    opacity: 0,
    x: -100,
    y: -100,
    rotate: -180,
  },
  animate: (index: number) => ({
    scale: 1,
    opacity: 1,
    x: (index % 3) * 200,
    y: Math.floor(index / 3) * 200,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 20,
      delay: index * 0.3,
      duration: 0.8,
    },
  }),
  explode: (index: number) => ({
    x: Math.random() * 800 - 400,
    y: Math.random() * 800 - 400,
    rotate: Math.random() * 360,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  }),
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  title,
  color,
  index,
  isExploded,
}) => {
  return (
    <motion.div
      className="absolute w-48 h-48 cursor-pointer"
      variants={pieceVariants}
      initial="initial"
      animate={isExploded ? "explode" : "animate"}
      exit="exit"
      custom={index}
    >
      <div className="relative w-full h-full">
        <svg
          width="192"
          height="192"
          viewBox="0 0 192 192"
          className={`w-full h-full ${color} filter drop-shadow-lg`}
        >
          <path
            d={getPuzzlePath(index)}
            className="transition-transform hover:scale-105"
          />
          <foreignObject x="20" y="20" width="152" height="152">
            <div className="w-full h-full flex items-center justify-center">
              <h3 className="text-white text-center font-bold text-lg px-2">
                {title}
              </h3>
            </div>
          </foreignObject>
        </svg>
      </div>
    </motion.div>
  );
};
