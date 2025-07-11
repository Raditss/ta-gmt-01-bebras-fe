'use client';

import { useCallback, useEffect, useState } from 'react';
import { MonsterPartType } from '@/components/features/question/dt/monster-part.type';
import { Stage } from '@pixi/react';
import { calculateCanvasSize } from '@/utils/helpers/canvas.helper';
import MonsterContainer from './monster-container';

interface MonsterCharacterProps {
  selections: Record<string, string>;
  hovered: {
    category: MonsterPartType;
    value: string;
  } | null;
}

export default function MonsterCharacter({
  selections,
  hovered
}: MonsterCharacterProps) {
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());

  const updateCanvasSize = useCallback(() => {
    setCanvasSize(calculateCanvasSize());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  return (
    <Stage
      width={canvasSize.width}
      height={canvasSize.height}
      options={{
        backgroundAlpha: 0,
        antialias: true
      }}
    >
      <MonsterContainer
        canvasSize={canvasSize}
        selections={selections}
        hovered={hovered}
      />
    </Stage>
  );
}
