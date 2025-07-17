import { useEffect, useState } from 'react';
import { Assets, Spritesheet, Texture } from 'pixi.js';
import {
  defaultColor,
  monsterAssetUrl,
  MonsterPartType
} from '@/components/features/question/anomaly-monster/monster-part.type';
import KenneyMonsterSpritesheet from '@/components/features/question/anomaly-monster/kenney-monster-spritesheet';

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

interface TextureData {
  source: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useMonsterSprites(): UseMonsterSpritesReturn {
  const [spritesheet, setSpritesheet] = useState<Spritesheet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSpritesheet = async () => {
      try {
        setIsLoading(true);

        const texture = await Assets.load(`${monsterAssetUrl}/Spritesheet.png`);

        // Get all textures from the spritesheet
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

        if (spritesheet) {
          spritesheet.destroy();
        }

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
        return `${MonsterPartType.BODY}_${currentColor}_${value}.png`;
      case MonsterPartType.LEG:
        return `${MonsterPartType.LEG}_${currentColor}_${value}.png`;
      case MonsterPartType.ARM:
        return `${MonsterPartType.ARM}_${currentColor}_${value}.png`;
      // case MonsterPartType.HORN:
      //   return value === 'none' ? null : `horn_${currentColor}_${value}.png`;
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
