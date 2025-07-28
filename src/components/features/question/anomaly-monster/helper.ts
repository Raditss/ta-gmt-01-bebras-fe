// import {
//   ColorOptions,
//   MonsterPartEnum,
//   MonsterPartOptionType, MonsterPartType
// } from './monster.type';
// import KenneyMonsterSpritesheet from '@/components/features/question/anomaly-monster/kenney-monster-spritesheet';
//
// export const extractOptions = (
//   type: MonsterPartType
// ) => {
//   return KenneyMonsterSpritesheet.textures.default[type].map((texture) => {
//     const sourceName = texture.source.split('.')[0];
//     const options = sourceName.split('_');
//     return {
//       label: options[options.length - 1],
//       source: texture.source,
//       value: options[options.length - 1]
//     };
//   });
// };
//
// export const extractSpriteOptions = () => {
//   const bodyOptions = extractOptions(MonsterPartEnum.BODY);
//   const legOptions = extractOptions(MonsterPartEnum.LEG);
//   const armOptions = extractOptions(MonsterPartEnum.ARM);
//   // const hornOptions = extractOptions(MonsterPartType.HORN);
//
//   return {
//     body: bodyOptions,
//     legs: legOptions,
//     arms: armOptions,
//     colors: ColorOptions
//   };
// };

import {
  BodyOptions,
  ColorOptions,
  MonsterPartEnum,
  MonsterPartOptionType,
  MonsterPartType,
  MouthOptions
} from '@/components/features/question/anomaly-monster/monster.type';

export const monsterParts: Record<MonsterPartType, MonsterPartOptionType[]> = {
  [MonsterPartEnum.COLOR]: ColorOptions,
  [MonsterPartEnum.BODY]: BodyOptions,
  [MonsterPartEnum.MOUTH]: MouthOptions
};
