import { spritesheetParser } from "@/lib/spritesheet-parser";
import {
  ColorOptions,
  EyeNumberOptions,
  MonsterPartOptionType,
  defaultColor,
} from "./types";

export const extractOptions = (
  sprites: { name: string }[],
  pattern: RegExp
) => {
  const options = new Set<MonsterPartOptionType>();
  sprites.forEach((sprite) => {
    const match = sprite.name.match(pattern);
    if (match)
      options.add({
        label: match[1],
        source: match.input!,
        value: match[1],
      });
  });
  return Array.from(options);
};

export const extractSpriteOptions = () => {
  // TODO
  const bodySprites = spritesheetParser.getSpritesByType(
    `body_${defaultColor}`
  );
  const legSprites = spritesheetParser.getSpritesByType(`leg_${defaultColor}`);
  const armSprites = spritesheetParser.getSpritesByType(`arm_${defaultColor}`);
  const hornSprites = spritesheetParser.getSpritesByType(
    `horn_${defaultColor}`
  );

  const typePattern = /\w+_\w+_(\w+)/;

  const bodyOptions = extractOptions(bodySprites, typePattern);
  const legOptions = extractOptions(legSprites, typePattern);
  const armOptions = extractOptions(armSprites, typePattern);
  const hornOptions = extractOptions(hornSprites, typePattern);

  return {
    body: bodyOptions,
    horns: [{ label: "None", value: "none" }, ...hornOptions],
    legs: legOptions,
    arms: armOptions,
    colors: ColorOptions,
    eye_numbers: EyeNumberOptions,
  };
};
