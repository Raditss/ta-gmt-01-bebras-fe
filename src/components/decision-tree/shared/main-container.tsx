import { Container } from "@pixi/react";
import { PropsWithChildren } from "react";
import {
  MonsterPartOptionType,
  MonsterPartType,
} from "@/components/solvers/decision-tree/types";
import { useMonsterSprites } from "@/components/decision-tree/shared/useMonsterSprites";
import {
  MonsterLeg,
  MonsterArm,
  MonsterBody,
  MonsterEye,
  MonsterMouth,
  MonsterHorn,
} from "./monster-parts";

interface IMainContainerProps {
  canvasSize: { width: number; height: number };
  selections?: Record<string, MonsterPartOptionType>;
  hovered?: {
    category: MonsterPartType;
    value: string;
  } | null;
}

const MainContainer = ({
  canvasSize,
  selections = {},
  hovered,
  children,
}: PropsWithChildren<IMainContainerProps>) => {
  const { isLoading, getTexture, getStaticTexture } = useMonsterSprites();

  const centerX = canvasSize.width / 2;
  const centerY = canvasSize.height / 2;

  const scaleFactor = Math.min(canvasSize.width, canvasSize.height) / 600;

  const getCurrentSelection = (category: MonsterPartType) => {
    if (hovered && hovered.category === category) return hovered.value;

    // Provide default values if no selection is available
    const defaultValues = {
      [MonsterPartType.COLOR]: "white",
      [MonsterPartType.BODY]: "A",
      [MonsterPartType.LEG]: "A",
      [MonsterPartType.ARM]: "A",
      [MonsterPartType.HORN]: "none",
    };

    return selections[category]?.answer || defaultValues[category];
  };

  if (isLoading) {
    return <Container>{children}</Container>;
  }

  return (
    <Container>
      <MonsterLeg
        texture={getTexture(
          MonsterPartType.LEG,
          getCurrentSelection(MonsterPartType.LEG),
          getCurrentSelection(MonsterPartType.COLOR)
        )}
        x={centerX + 40 * scaleFactor}
        y={centerY + 50 * scaleFactor}
        scaleX={0.4 * scaleFactor}
        scaleY={0.4 * scaleFactor}
      />
      <MonsterLeg
        texture={getTexture(
          MonsterPartType.LEG,
          getCurrentSelection(MonsterPartType.LEG),
          getCurrentSelection(MonsterPartType.COLOR)
        )}
        x={centerX - 40 * scaleFactor}
        y={centerY + 50 * scaleFactor}
        scaleX={-0.4 * scaleFactor}
        scaleY={0.4 * scaleFactor}
      />

      <MonsterArm
        texture={getTexture(
          MonsterPartType.ARM,
          getCurrentSelection(MonsterPartType.ARM),
          getCurrentSelection(MonsterPartType.COLOR)
        )}
        x={centerX - 100 * scaleFactor}
        y={centerY + 50 * scaleFactor}
        scaleX={-0.3 * scaleFactor}
        scaleY={0.3 * scaleFactor}
      />
      <MonsterArm
        texture={getTexture(
          MonsterPartType.ARM,
          getCurrentSelection(MonsterPartType.ARM),
          getCurrentSelection(MonsterPartType.COLOR)
        )}
        x={centerX + 100 * scaleFactor}
        y={centerY + 5 * scaleFactor}
        scaleX={0.3 * scaleFactor}
        scaleY={-0.3 * scaleFactor}
      />

      <MonsterBody
        texture={getTexture(
          MonsterPartType.BODY,
          getCurrentSelection(MonsterPartType.BODY),
          getCurrentSelection(MonsterPartType.COLOR)
        )}
        x={centerX}
        y={centerY}
        scaleX={0.5 * scaleFactor}
        scaleY={0.5 * scaleFactor}
      />

      <MonsterHorn
        texture={getTexture(
          MonsterPartType.HORN,
          getCurrentSelection(MonsterPartType.HORN),
          getCurrentSelection(MonsterPartType.COLOR)
        )}
        x={centerX}
        y={centerY - 80 * scaleFactor}
        scaleX={0.4 * scaleFactor}
        scaleY={0.4 * scaleFactor}
      />

      <MonsterEye
        texture={getStaticTexture("eye_human")}
        x={centerX}
        y={centerY - 20 * scaleFactor}
        scaleX={0.4 * scaleFactor}
        scaleY={0.4 * scaleFactor}
      />

      <MonsterMouth
        texture={getStaticTexture("mouth_openToothless")}
        x={centerX}
        y={centerY + 20 * scaleFactor}
        scaleX={0.5 * scaleFactor}
        scaleY={0.5 * scaleFactor}
      />

      {children}
    </Container>
  );
};

export default MainContainer;
