export interface MonsterPartOptionType {
  label: string;
  source?: string;
  value: string;
}

export enum MonsterPartType {
  COLOR = 'color',
  BODY = 'body',
  LEG = 'legs',
  ARM = 'arms',
  HORN = 'horns'
}

export const ColorOptions: MonsterPartOptionType[] = [
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Dark', value: 'dark' }
];

export const monsterAssetUrl = '/kenney_monster-builder-pack/';

export const defaultColor = 'white';
