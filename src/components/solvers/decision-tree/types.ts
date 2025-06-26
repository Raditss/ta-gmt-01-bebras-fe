export interface MonsterPartOptionType {
  label: string;
  value: string;
  answer: string;
}

export enum MonsterPartType {
  COLOR = "color",
  // EYE_NUMBER = "eye_number",
  BODY = "body",
  LEG = "leg",
  ARM = "arm",
  HORN = "horn",
}

export const ColorOptions: MonsterPartOptionType[] = [
  { label: "Red", value: "red", answer: "red" },
  { label: "Green", value: "green", answer: "green" },
  { label: "Blue", value: "blue", answer: "blue" },
  { label: "Yellow", value: "yellow", answer: "yellow" },
  { label: "Dark", value: "dark", answer: "dark" },
  // { label: "White", value: "white", answer: "white" },
];

export const EyeNumberOptions: MonsterPartOptionType[] = [
  { label: "1", value: "1", answer: "1" },
  { label: "2", value: "2", answer: "2" },
  { label: "3", value: "3", answer: "3" },
];

// export const HornOptions: MonsterPartOptionType[] = [
//   { label: "None", value: "none", answer: "none" },
//   { label: "Small", value: "small", answer: "small" },
//   { label: "Large", value: "large", answer: "large" },
// ];

// TODO
export const monsterAssetUrl = "/kenney_monster-builder-pack/";

export const defaultColor = "white";
