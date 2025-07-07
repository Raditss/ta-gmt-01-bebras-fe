import { Sprite } from "@pixi/react";
import { Texture } from "pixi.js";

interface MonsterPartProps {
  texture: Texture | null;
  x: number;
  y: number;
  scaleX?: number;
  scaleY?: number;
  anchorX?: number;
  anchorY?: number;
}

export const MonsterLeg = ({
  texture,
  x,
  y,
  scaleX = 0.4,
  scaleY = 0.4,
  anchorX = 0.5,
  anchorY = 0,
}: MonsterPartProps) => {
  if (!texture) return null;

  return (
    <Sprite
      texture={texture}
      x={x}
      y={y}
      anchor={{ x: anchorX, y: anchorY }}
      scale={{ x: scaleX, y: scaleY }}
    />
  );
};

export const MonsterArm = ({
  texture,
  x,
  y,
  scaleX = 0.3,
  scaleY = 0.3,
  anchorX = 0.5,
  anchorY = 0.3,
}: MonsterPartProps) => {
  if (!texture) return null;

  return (
    <Sprite
      texture={texture}
      x={x}
      y={y}
      anchor={{ x: anchorX, y: anchorY }}
      scale={{ x: scaleX, y: scaleY }}
    />
  );
};

export const MonsterBody = ({
  texture,
  x,
  y,
  scaleX = 0.5,
  scaleY = 0.5,
  anchorX = 0.5,
  anchorY = 0.5,
}: MonsterPartProps) => {
  if (!texture) return null;

  return (
    <Sprite
      texture={texture}
      x={x}
      y={y}
      anchor={{ x: anchorX, y: anchorY }}
      scale={{ x: scaleX, y: scaleY }}
    />
  );
};

export const MonsterEye = ({
  texture,
  x,
  y,
  scaleX = 0.4,
  scaleY = 0.4,
  anchorX = 0.5,
  anchorY = 0.5,
}: MonsterPartProps) => {
  if (!texture) return null;

  return (
    <Sprite
      texture={texture}
      x={x}
      y={y}
      anchor={{ x: anchorX, y: anchorY }}
      scale={{ x: scaleX, y: scaleY }}
    />
  );
};

export const MonsterMouth = ({
  texture,
  x,
  y,
  scaleX = 0.5,
  scaleY = 0.5,
  anchorX = 0.5,
  anchorY = 0.5,
}: MonsterPartProps) => {
  if (!texture) return null;

  return (
    <Sprite
      texture={texture}
      x={x}
      y={y}
      anchor={{ x: anchorX, y: anchorY }}
      scale={{ x: scaleX, y: scaleY }}
    />
  );
};

export const MonsterHorn = ({
  texture,
  x,
  y,
  scaleX = 0.4,
  scaleY = 0.4,
  anchorX = 0.5,
  anchorY = 1,
}: MonsterPartProps) => {
  if (!texture) return null;

  return (
    <Sprite
      texture={texture}
      x={x}
      y={y}
      anchor={{ x: anchorX, y: anchorY }}
      scale={{ x: scaleX, y: scaleY }}
    />
  );
};
