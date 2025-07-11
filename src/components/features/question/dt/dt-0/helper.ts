import { ColorOptions, MonsterPartOptionType, MonsterPartType } from '../types';
import KenneyMonsterSpritesheet from '@/components/features/question/dt/kenney-monster-spritesheet';

export const extractOptions = (
  type: Exclude<MonsterPartType, MonsterPartType.COLOR>
) => {
  return KenneyMonsterSpritesheet.textures.default[type].map((texture) => {
    const sourceName = texture.source.split('.')[0];
    const options = sourceName.split('_');
    return {
      label: options[options.length - 1],
      source: texture.source,
      value: options[options.length - 1]
    };
  });
};

export const extractSpriteOptions = () => {
  const bodyOptions = extractOptions(MonsterPartType.BODY);
  const legOptions = extractOptions(MonsterPartType.LEG);
  const armOptions = extractOptions(MonsterPartType.ARM);
  const hornOptions = extractOptions(MonsterPartType.HORN);

  return {
    body: bodyOptions,
    horns: [{ label: 'None', value: 'none' }, ...hornOptions],
    legs: legOptions,
    arms: armOptions,
    colors: ColorOptions
  };
};

export const monsterParts: Record<MonsterPartType, MonsterPartOptionType[]> = {
  [MonsterPartType.COLOR]: extractSpriteOptions().colors,
  [MonsterPartType.HORN]: extractSpriteOptions().horns,
  [MonsterPartType.BODY]: extractSpriteOptions().body,
  [MonsterPartType.ARM]: extractSpriteOptions().arms,
  [MonsterPartType.LEG]: extractSpriteOptions().legs
};
