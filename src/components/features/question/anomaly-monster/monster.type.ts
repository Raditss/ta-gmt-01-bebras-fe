export enum MonsterPartEnum {
  COLOR = 'Color',
  BODY = 'Body',
  MOUTH = 'Mouth'
  // ARM = 'Arm',
  // LEG = 'Leg',
  // HORN = 'horns'
}

export type MonsterPartType = `${MonsterPartEnum}`;

export enum ColorEnum {
  RED = 'Red',
  GREEN = 'Green',
  BLUE = 'Blue'
}

export type ColorType = `${ColorEnum}`;

/* | 'Yellow' /*| 'Dark'  | 'White' */

export enum BodyEnum {
  CUBE = 'Cube',
  ORB = 'Orb'
}

export type BodyType = `${BodyEnum}` /* | 'Blob' */;

export enum MouthEnum {
  FANGS = 'Fangs',
  NO_FANGS = 'Closedteeth'
}

export type MouthType = `${MouthEnum}`;

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

export const getColorLabel = (color: string): string => {
  switch (color) {
    case ColorEnum.GREEN:
      return 'Hijau';
    case ColorEnum.BLUE:
      return 'Biru';
    case ColorEnum.RED:
      return 'Merah';
    default:
      return 'Tidak diketahui';
  }
};

export const getBodyLabel = (body: string): string => {
  switch (body) {
    case BodyEnum.ORB:
      return 'Bulat';
    case BodyEnum.CUBE:
      return 'Kotak';
    default:
      return 'Tidak diketahui';
  }
};

export const getMouthLabel = (mouth: string): string => {
  switch (mouth) {
    case MouthEnum.NO_FANGS:
      return 'Tidak Bertaring';
    case MouthEnum.FANGS:
      return 'Bertaring';
    default:
      return 'Tidak diketahui';
  }
};
