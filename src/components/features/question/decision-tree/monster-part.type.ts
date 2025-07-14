export interface MonsterPartOptionType {
  label: string;
  source?: string;
  value: string;
}

export enum MonsterPartType {
  COLOR = 'color',
  BODY = 'body',
  LEG = 'legs',
  ARM = 'arms'
  // HORN = 'horns'
}

export const ColorOptions: MonsterPartOptionType[] = [
  { label: 'Red', value: 'Red' },
  { label: 'Green', value: 'Green' },
  { label: 'Blue', value: 'Blue' },
  { label: 'Yellow', value: 'Yellow' },
  { label: 'Dark', value: 'Dark' }
];

export const monsterAssetUrl = '/kenney_monster-builder-pack/';

export const defaultColor = 'White';
