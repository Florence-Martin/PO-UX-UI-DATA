import React from "react";
import { PuzzlePiece } from "./PuzzlePiece";
import { ScrumPiece } from "@/data/scrumData";
import { AnimatePresence } from "framer-motion";

interface PuzzleBoardProps {
  pieces: ScrumPiece[];
  isExploded: boolean;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  pieces,
  isExploded,
}) => {
  return (
    <div className="relative w-[600px] h-[600px]">
      <AnimatePresence>
        {pieces.map((piece, index) => (
          <PuzzlePiece
            key={piece.title}
            title={piece.title}
            color={piece.color}
            index={index}
            isExploded={isExploded}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
