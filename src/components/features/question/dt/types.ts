export interface MonsterPartOptionType {
  label: string;
  source?: string;
  value: string;
}

export enum MonsterPartType {
  COLOR = 'color',
  // EYE_NUMBER = "eye_number",
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
  // { label: "White", value: "white", answer: "white" },
];

export const EyeNumberOptions: MonsterPartOptionType[] = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' }
];

// export const HornOptions: MonsterPartOptionType[] = [
//   { label: "None", value: "none", answer: "none" },
//   { label: "Small", value: "small", answer: "small" },
//   { label: "Large", value: "large", answer: "large" },
// ];

// TODO
export const monsterAssetUrl = '/kenney_monster-builder-pack/';

export const defaultColor = 'white';
