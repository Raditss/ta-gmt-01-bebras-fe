"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MonsterPartOptionType,
  MonsterPartType,
} from "@/components/features/question/dt-0/solver/types";
import { Stage } from "@pixi/react";
import { calculateCanvasSize } from "@/utils/helpers/canvas.helper";
import MainContainer from "./main-container";

interface MonsterCharacterProps {
  selections: Record<string, MonsterPartOptionType>;
  hovered: {
    category: MonsterPartType;
    value: string;
  } | null;
}

export default function MonsterCharacter({
  selections,
  hovered,
}: MonsterCharacterProps) {
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());

  const updateCanvasSize = useCallback(() => {
    setCanvasSize(calculateCanvasSize());
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [updateCanvasSize]);

  return (
    <Stage width={canvasSize.width} height={canvasSize.height}>
      <MainContainer
        canvasSize={canvasSize}
        selections={selections}
        hovered={hovered}
      />
    </Stage>
  );
}
