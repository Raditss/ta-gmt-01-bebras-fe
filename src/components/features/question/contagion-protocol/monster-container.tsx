import { PropsWithChildren } from 'react';
import { Container } from '@pixi/react';
import {
  MonsterArm,
  MonsterBody,
  MonsterEye,
  MonsterLeg,
  MonsterMouth
} from '@/components/features/question/anomaly-monster/monster-parts';
import {
  ContagionProtocolMonsterAttributeType,
  ContagionProtocolMonsterColorType,
  ContagionProtocolTreeAttributeEnum,
  ContagionProtocolTreeAttributeType
} from '@/models/contagion-protocol/contagion-protocol.model.type';
import { useMonsterSprite } from '@/components/features/question/contagion-protocol/useMonsterSprite';

interface IMainContainerProps {
  canvasSize: { width: number; height: number };
  selections: Record<
    ContagionProtocolTreeAttributeType,
    ContagionProtocolMonsterAttributeType
  >;
}

const MonsterContainer = ({
  canvasSize,
  selections,
  children
}: PropsWithChildren<IMainContainerProps>) => {
  const { isLoading, getTexture, getStaticTexture } = useMonsterSprite();

  const centerX = canvasSize.width / 2;
  const centerY = canvasSize.height / 2;

  const scaleFactor = Math.min(canvasSize.width, canvasSize.height) / 300;

  return (
    <Container>
      {isLoading ? (
        children
      ) : (
        <>
          <MonsterLeg
            texture={getStaticTexture(
              `Leg_${selections[ContagionProtocolTreeAttributeEnum.COLOR]}_Paddle.png`
            )}
            x={centerX + 40 * scaleFactor}
            y={centerY + 50 * scaleFactor}
            scaleX={0.4 * scaleFactor}
            scaleY={0.4 * scaleFactor}
          />
          <MonsterLeg
            texture={getStaticTexture(
              `Leg_${selections[ContagionProtocolTreeAttributeEnum.COLOR]}_Paddle.png`
            )}
            x={centerX - 40 * scaleFactor}
            y={centerY + 50 * scaleFactor}
            scaleX={-0.4 * scaleFactor}
            scaleY={0.4 * scaleFactor}
          />

          <MonsterArm
            texture={getStaticTexture(
              `Arm_${selections[ContagionProtocolTreeAttributeEnum.COLOR]}_Grabbie.png`
            )}
            x={centerX - 95 * scaleFactor}
            y={centerY + 50 * scaleFactor}
            scaleX={-0.25 * scaleFactor}
            scaleY={0.25 * scaleFactor}
          />
          <MonsterArm
            texture={getStaticTexture(
              `Arm_${selections[ContagionProtocolTreeAttributeEnum.COLOR]}_Grabbie.png`
            )}
            x={centerX + 95 * scaleFactor}
            y={centerY + 50 * scaleFactor}
            scaleX={0.25 * scaleFactor}
            scaleY={0.25 * scaleFactor}
          />

          <MonsterBody
            texture={getTexture(
              ContagionProtocolTreeAttributeEnum.BODY,
              selections[ContagionProtocolTreeAttributeEnum.BODY],
              selections[
                ContagionProtocolTreeAttributeEnum.COLOR
              ] as ContagionProtocolMonsterColorType
            )}
            x={centerX}
            y={centerY}
            scaleX={0.5 * scaleFactor}
            scaleY={0.5 * scaleFactor}
          />

          <MonsterEye
            texture={getStaticTexture('Eye_Red_human.png')}
            x={centerX - 25 * scaleFactor}
            y={centerY - 20 * scaleFactor}
            scaleX={0.4 * scaleFactor}
            scaleY={0.4 * scaleFactor}
          />
          <MonsterEye
            texture={getStaticTexture('Eye_Red_human.png')}
            x={centerX + 25 * scaleFactor}
            y={centerY - 20 * scaleFactor}
            scaleX={0.4 * scaleFactor}
            scaleY={0.4 * scaleFactor}
          />

          {/* Mouth */}
          <MonsterMouth
            texture={getStaticTexture(
              `Mouth_${selections[ContagionProtocolTreeAttributeEnum.MOUTH]}.png`
            )}
            x={centerX}
            y={centerY + 30 * scaleFactor}
            scaleX={0.5 * scaleFactor}
            scaleY={0.5 * scaleFactor}
          />
          {children}
        </>
      )}
    </Container>
  );
};

export default MonsterContainer;
