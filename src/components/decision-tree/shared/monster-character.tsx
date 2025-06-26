"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MonsterPartOptionType,
  MonsterPartType,
} from "@/components/solvers/decision-tree/types";
import { Stage } from "@pixi/react";
import { calculateCanvasSize } from "@/helpers/common";
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
  console.log("🔍 selections: ", selections);
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());

  const updateCanvasSize = useCallback(() => {
    setCanvasSize(calculateCanvasSize());
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [updateCanvasSize]);

  console.log("🔍", selections, hovered);

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
