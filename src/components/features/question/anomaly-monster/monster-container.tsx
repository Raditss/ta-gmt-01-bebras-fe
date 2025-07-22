import { Container } from '@pixi/react';
import { PropsWithChildren } from 'react';
import { MonsterPartEnum } from '@/components/features/question/anomaly-monster/monster.type';
import { useMonsterSprites } from './useMonsterSprites';
import {
  MonsterArm,
  MonsterBody,
  MonsterEye,
  MonsterLeg,
  MonsterMouth
} from './monster-parts';

interface IMainContainerProps {
  canvasSize: { width: number; height: number };
  selections: Record<string, string>;
  hovered?: {
    category: MonsterPartEnum;
    value: string;
  } | null;
}

const MonsterContainer = ({
  canvasSize,
  selections,
  hovered,
  children
}: PropsWithChildren<IMainContainerProps>) => {
  const { isLoading, getTexture, getStaticTexture } = useMonsterSprites();

  // Calculate center position based on canvas size
  const centerX = canvasSize.width / 2;
  const centerY = canvasSize.height / 2;

  // Calculate scale factor based on canvas size
  const scaleFactor = Math.min(canvasSize.width, canvasSize.height) / 300;

  const getCurrentSelection = (category: MonsterPartEnum) => {
    if (hovered && hovered.category === category) return hovered.value;

    // Provide default values if no selection is available
    const defaultValues = {
      [MonsterPartEnum.COLOR]: 'White',
      [MonsterPartEnum.BODY]: 'Orb',
      [MonsterPartEnum.MOUTH]: 'Closedteeth'
      // [MonsterPartEnum.LEG]: 'Paddle',
      // [MonsterPartEnum.ARM]: 'Clampfin'
      // [MonsterPartType.HORN]: 'none'
    };

    return (selections && selections[category]) || defaultValues[category];
  };

  return (
    <Container>
      {isLoading ? (
        children
      ) : (
        <>
          {/* Back legs (behind body) */}
          <MonsterLeg
            texture={getStaticTexture(
              `Leg_${getCurrentSelection(MonsterPartEnum.COLOR)}_Paddle.png`
            )}
            x={centerX + 40 * scaleFactor}
            y={centerY + 50 * scaleFactor}
            scaleX={0.4 * scaleFactor}
            scaleY={0.4 * scaleFactor}
          />
          <MonsterLeg
            texture={getStaticTexture(
              `Leg_${getCurrentSelection(MonsterPartEnum.COLOR)}_Paddle.png`
            )}
            x={centerX - 40 * scaleFactor}
            y={centerY + 50 * scaleFactor}
            scaleX={-0.4 * scaleFactor}
            scaleY={0.4 * scaleFactor}
          />
          {/* Arms */}
          <MonsterArm
            texture={getStaticTexture(
              `Arm_${getCurrentSelection(MonsterPartEnum.COLOR)}_Grabbie.png`
            )}
            x={centerX - 95 * scaleFactor}
            y={centerY + 50 * scaleFactor}
            scaleX={-0.25 * scaleFactor}
            scaleY={0.25 * scaleFactor}
          />
          <MonsterArm
            texture={getStaticTexture(
              `Arm_${getCurrentSelection(MonsterPartEnum.COLOR)}_Grabbie.png`
            )}
            x={centerX + 95 * scaleFactor}
            y={centerY + 50 * scaleFactor}
            scaleX={0.25 * scaleFactor}
            scaleY={0.25 * scaleFactor}
          />
          {/* Body */}
          <MonsterBody
            texture={getTexture(
              MonsterPartEnum.BODY,
              getCurrentSelection(MonsterPartEnum.BODY),
              getCurrentSelection(MonsterPartEnum.COLOR)
            )}
            x={centerX}
            y={centerY}
            scaleX={0.5 * scaleFactor}
            scaleY={0.5 * scaleFactor}
          />
          {/* Horn (if present) */}
          {/*<MonsterHorn*/}
          {/*  texture={getTexture(*/}
          {/*    MonsterPartType.HORN,*/}
          {/*    getCurrentSelection(MonsterPartType.HORN),*/}
          {/*    getCurrentSelection(MonsterPartType.COLOR)*/}
          {/*  )}*/}
          {/*  x={centerX}*/}
          {/*  y={centerY - 80 * scaleFactor}*/}
          {/*  scaleX={0.4 * scaleFactor}*/}
          {/*  scaleY={0.4 * scaleFactor}*/}
          {/*/>*/}
          {/* Eyes */}
          {/* Left Eye */}
          <MonsterEye
            texture={getStaticTexture('Eye_Red_human.png')}
            x={centerX - 25 * scaleFactor}
            y={centerY - 20 * scaleFactor}
            scaleX={0.4 * scaleFactor}
            scaleY={0.4 * scaleFactor}
          />
          {/* Right Eye */}
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
              selections[MonsterPartEnum.MOUTH] === 'Closedteeth'
                ? 'Mouth_Closedteeth.png'
                : 'Mouth_Fangs.png'
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
