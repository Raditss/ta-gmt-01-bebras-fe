export enum MonsterPartType {
  BODY = 'Body',
  ARM = 'Arm',
  LEG = 'Leg',
  COLOR = 'Color'
  // HORN = 'horns'
}

export type BodyType = 'Cube' | 'Orb' | 'Blob';

export type ArmType = 'Clampfin' | 'Grabbie' | 'Thumpet' | 'Twizzle';

export type LegType = 'Flop' | 'Paddle' | 'Stump';

export type ColorType =
  | 'Red'
  | 'Green'
  | 'Blue'
  | 'Yellow' /*| 'Dark'  | 'White' */;

export type MonsterPartValue = BodyType | ArmType | LegType | ColorType;

export interface MonsterPartOptionType {
  label: string;
  source?: string;
  value: string;
}

export const ColorOptions: MonsterPartOptionType[] = [
  { label: 'Red', value: 'Red' },
  { label: 'Green', value: 'Green' },
  { label: 'Blue', value: 'Blue' },
  { label: 'Yellow', value: 'Yellow' }
  // { label: 'Dark', value: 'Dark' }
];

export const monsterAssetUrl = '/kenney_monster-builder-pack/';

export const defaultColor = 'White';
