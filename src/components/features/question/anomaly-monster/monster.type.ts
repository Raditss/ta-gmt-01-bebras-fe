export enum MonsterPartEnum {
  COLOR = 'Color',
  BODY = 'Body',
  MOUTH = 'Mouth'
  // ARM = 'Arm',
  // LEG = 'Leg',
  // HORN = 'horns'
}

export type MonsterPartType = `${MonsterPartEnum}`;

export type ColorType = 'Red' | 'Green' | 'Blue';
/* | 'Yellow' /*| 'Dark'  | 'White' */

export type BodyType = 'Cube' | 'Orb' /* | 'Blob' */;

export type MouthType = 'Closedteeth' | 'Fangs';

// export type ArmType = 'Clampfin' | 'Grabbie' | 'Thumpet' | 'Twizzle';

// export type LegType = 'Flop' | 'Paddle' | 'Stump';

export type MonsterPartValue = ColorType | BodyType | MouthType;

export interface MonsterPartOptionType {
  label: string;
  source?: string;
  value: string;
}

export const ColorOptions: MonsterPartOptionType[] = [
  { label: 'Merah', value: 'Red' },
  { label: 'Hijau', value: 'Green' },
  { label: 'Biru', value: 'Blue' }
  // { label: 'Kuning', value: 'Yellow' }
  // { label: 'Dark', value: 'Dark' }
];

export const BodyOptions: MonsterPartOptionType[] = [
  { label: 'Bulat', value: 'Orb' },
  { label: 'Kotak', value: 'Cube' }
];

export const MouthOptions: MonsterPartOptionType[] = [
  { label: 'Bertaring', value: 'Fangs' },
  { label: 'Tidak Bertaring', value: 'Closedteeth' }
];

export const monsterAssetUrl = '/kenney_monster-builder-pack/';

export const defaultColor = 'White';
