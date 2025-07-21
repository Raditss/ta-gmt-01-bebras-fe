import { Assets, Spritesheet, Texture } from 'pixi.js';
import {
  ContagionProtocolMonsterAttributeType,
  ContagionProtocolMonsterColorType,
  ContagionProtocolTreeAttributeEnum,
  ContagionProtocolTreeAttributeType
} from '@/models/contagion-protocol/contagion-protocol.model.type';
import {
  monsterAssetUrl,
  MonsterPartType
} from '@/components/features/question/anomaly-monster/monster-part.type';
import KenneyMonsterSpritesheet from '@/components/features/question/anomaly-monster/kenney-monster-spritesheet';
import { useEffect, useState } from 'react';

interface UseMonsterSpritesReturn {
  spritesheet: Spritesheet | null;
  isLoading: boolean;
  getTexture: (
    attribute: ContagionProtocolTreeAttributeType,
    type: ContagionProtocolMonsterAttributeType,
    color: ContagionProtocolMonsterColorType
  ) => Texture | null;
  getStaticTexture: (textureName: string) => Texture | null;
}

interface TextureData {
  source: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

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

export function useMonsterSprite(): UseMonsterSpritesReturn {
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
    attribute: ContagionProtocolTreeAttributeType,
    value: ContagionProtocolMonsterAttributeType,
    color: ContagionProtocolMonsterColorType
  ): string | null => {
    switch (attribute) {
      case ContagionProtocolTreeAttributeEnum.BODY:
        return `${MonsterPartType.BODY}_${color}_${value}.png`;
      default:
        return null;
    }
  };

  const getStaticTexture = (textureName: string): Texture | null => {
    if (!spritesheet) return null;
    return spritesheet.textures[textureName] || null;
  };

  const getTexture = (
    attribute: ContagionProtocolTreeAttributeType,
    value: ContagionProtocolMonsterAttributeType,
    color: ContagionProtocolMonsterColorType
  ): Texture | null => {
    if (!spritesheet) return null;

    const textureName = getTextureName(attribute, value, color);
    if (!textureName) return null;

    return getStaticTexture(textureName);
  };

  return {
    spritesheet,
    isLoading,
    getTexture,
    getStaticTexture
  };
}
