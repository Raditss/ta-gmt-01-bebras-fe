import { useEffect, useState } from 'react';
import { Assets, Spritesheet, Texture } from 'pixi.js';
import { spritesheetParser } from '@/utils/helpers/spritesheet.helper';
import {
  defaultColor,
  monsterAssetUrl,
  MonsterPartType
} from '@/components/features/question/dt/types';

interface UseMonsterSpritesReturn {
  spritesheet: Spritesheet | null;
  isLoading: boolean;
  getTexture: (
    type: MonsterPartType,
    value?: string,
    color?: string
  ) => Texture | null;
  getStaticTexture: (textureName: string) => Texture | null;
  getTextureName: (
    type: MonsterPartType,
    value: string,
    color?: string
  ) => string | null;
}

export function useMonsterSprites(): UseMonsterSpritesReturn {
  const [spritesheet, setSpritesheet] = useState<Spritesheet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSpritesheet = async () => {
      try {
        setIsLoading(true);

        await spritesheetParser.loadXML(`${monsterAssetUrl}/spritesheet.xml`);

        const texture = await Assets.load(`${monsterAssetUrl}/spritesheet.png`);

        const spritesheetData = spritesheetParser.toPIXIFormat(texture);

        const newSpritesheet = new Spritesheet(texture, spritesheetData);
        await newSpritesheet.parse();

        setSpritesheet(newSpritesheet);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading spritesheet:', error);
        setIsLoading(false);
      }
    };

    loadSpritesheet();
  }, []);

  const getTextureName = (
    type: MonsterPartType,
    value: string,
    color?: string
  ): string | null => {
    const currentColor = color || defaultColor;

    switch (type) {
      case MonsterPartType.BODY:
        return `body_${currentColor}_${value}.png`;
      case MonsterPartType.LEG:
        return `leg_${currentColor}_${value}.png`;
      case MonsterPartType.ARM:
        return `arm_${currentColor}_${value}.png`;
      case MonsterPartType.HORN:
        return value === 'none' ? null : `horn_${currentColor}_${value}.png`;
      default:
        return null;
    }
  };

  const getTexture = (
    type: MonsterPartType,
    value?: string,
    color?: string
  ): Texture | null => {
    if (!spritesheet || !value) return null;

    const textureName = getTextureName(type, value, color);
    if (!textureName) return null;

    return spritesheet.textures[textureName] || null;
  };

  const getStaticTexture = (textureName: string): Texture | null => {
    if (!spritesheet) return null;
    return spritesheet.textures[textureName] || null;
  };

  return {
    spritesheet,
    isLoading,
    getTexture,
    getStaticTexture,
    getTextureName
  };
}
