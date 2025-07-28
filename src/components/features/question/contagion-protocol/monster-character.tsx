import { useCallback, useEffect, useState } from 'react';
import { calculateCanvasSize } from '@/utils/helpers/canvas.helper';
import { Stage } from '@pixi/react';
import MonsterContainer from '@/components/features/question/contagion-protocol/monster-container';
import {
  ContagionProtocolMonsterAttributeType,
  ContagionProtocolTreeAttributeType
} from '@/models/contagion-protocol/contagion-protocol.model.type';

interface MonsterCharacterProps {
  selections: Record<
    ContagionProtocolTreeAttributeType,
    ContagionProtocolMonsterAttributeType
  >;
}

const MonsterCharacter = ({ selections }: MonsterCharacterProps) => {
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
      <MonsterContainer canvasSize={canvasSize} selections={selections} />
    </Stage>
  );
};

export default MonsterCharacter;
