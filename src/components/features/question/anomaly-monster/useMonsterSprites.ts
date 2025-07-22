import { useEffect, useState } from 'react';
import { Assets, Spritesheet, Texture } from 'pixi.js';
import {
  defaultColor,
  monsterAssetUrl,
  MonsterPartEnum
} from '@/components/features/question/anomaly-monster/monster.type';
import KenneyMonsterSpritesheet from '@/components/features/question/anomaly-monster/kenney-monster-spritesheet';

interface UseMonsterSpritesReturn {
  spritesheet: Spritesheet | null;
  isLoading: boolean;
  getTexture: (
    type: MonsterPartEnum,
    value?: string,
    color?: string
  ) => Texture | null;
  getStaticTexture: (textureName: string) => Texture | null;
  getTextureName: (
    type: MonsterPartEnum,
    value: string,
    color?: string
  ) => string | null;
}

interface TextureData {
  source: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Singleton cache
let cachedSpritesheet: Spritesheet | null = null;
let spritesheetPromise: Promise<Spritesheet> | null = null;

async function loadMonsterSpritesheet(): Promise<Spritesheet> {
  if (cachedSpritesheet) return cachedSpritesheet;
  if (spritesheetPromise) return spritesheetPromise;

  spritesheetPromise = (async () => {
    const texture = await Assets.load(`${monsterAssetUrl}/Spritesheet.png`);

    const allTextures = Object.values(
      KenneyMonsterSpritesheet.textures
    ).flatMap((typeTextures) => typeTextures as TextureData[]);

    const newSpritesheet = new Spritesheet(texture as Texture, {
      frames: Object.fromEntries(
        allTextures.map((texture: TextureData) => [
          texture.source,
          {
            frame: {
              x: texture.x,
              y: texture.y,
              w: texture.width,
              h: texture.height
            }
          }
        ])
      ),
      meta: {
        scale: '1'
      }
    });

    await newSpritesheet.parse();
    cachedSpritesheet = newSpritesheet;
    return newSpritesheet;
  })();

  return spritesheetPromise;
}

export function useMonsterSprites(): UseMonsterSpritesReturn {
  const [spritesheet, setSpritesheet] = useState<Spritesheet | null>(
    cachedSpritesheet
  );
  const [isLoading, setIsLoading] = useState(!cachedSpritesheet);

  useEffect(() => {
    if (!cachedSpritesheet) {
      setIsLoading(true);
      loadMonsterSpritesheet()
        .then((sheet) => {
          setSpritesheet(sheet);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error loading spritesheet:', error);
          setIsLoading(false);
        });
    }
  }, []);

  const getTextureName = (
    type: MonsterPartEnum,
    value: string,
    color?: string
  ): string | null => {
    const currentColor = color || defaultColor;

    switch (type) {
      case MonsterPartEnum.BODY:
        return `${MonsterPartEnum.BODY}_${currentColor}_${value}.png`;
      // case MonsterPartEnum.LEG:
      //   return `${MonsterPartEnum.LEG}_${currentColor}_${value}.png`;
      // case MonsterPartEnum.ARM:
      //   return `${MonsterPartEnum.ARM}_${currentColor}_${value}.png`;
      // case MonsterPartType.HORN:
      //   return value === 'none' ? null : `horn_${currentColor}_${value}.png`;
      default:
        return null;
    }
  };

  const getTexture = (
    type: MonsterPartEnum,
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
