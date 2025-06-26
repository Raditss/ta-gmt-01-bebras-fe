import { MonsterPartOptionType } from "@/components/solvers/decision-tree/types";
import { spritesheetParser } from "@/lib/spritesheet-parser";

export default function MonsterPartOption({
  option,
  selected,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  option: MonsterPartOptionType;
  selected: boolean;
  color?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}) {
  const sprite = spritesheetParser.getSprite(option.value ?? "");
  console.log("🔍 monster part option: ", option, sprite);

  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`rounded-lg transition-all duration-200 capitalize flex items-center justify-center space-x-2 ${
        selected
          ? "bg-blue-500 text-white shadow-md"
          : "bg-black/20 hover:bg-black/30 hover:shadow-md"
      }`}
      style={{
        padding: option.value ? "0.5rem" : "0.75rem 1rem",
        minWidth:
          option.value && sprite ? `${sprite.width * 0.5 + 16}px` : undefined,
      }}
    >
      {sprite ? (
        (() => {
          const SCALE = 0.5;
          const imageWidth = 2958;
          const imageHeight = 2960;

          const scaledWidth = sprite.width * SCALE;
          const scaledHeight = sprite.height * SCALE;
          const backgroundX = sprite.x * SCALE;
          const backgroundY = sprite.y * SCALE;
          const backgroundSizeWidth = imageWidth * SCALE;
          const backgroundSizeHeight = imageHeight * SCALE;

          return (
            <div
              className="relative overflow-hidden bg-no-repeat shrink-0"
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                backgroundImage:
                  "url(/kenney_monster-builder-pack/spritesheet.png)",
                backgroundPosition: `-${backgroundX}px -${backgroundY}px`,
                backgroundSize: `${backgroundSizeWidth}px ${backgroundSizeHeight}px`,
              }}
            />
          );
        })()
      ) : (
        <span className="text-xs">{option.label}</span>
      )}{" "}
    </button>
  );
}
