import { MonsterPartOptionType } from "@/components/features/question/dt-0/solver/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { spritesheetParser } from "@/utils/helpers/spritesheet.helper";

export default function MonsterPartOption({
  option,
  selected,
  onMouseEnter,
  onMouseLeave,
  onClick,
  size = "auto",
}: {
  option: MonsterPartOptionType;
  selected: boolean;
  color?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  size?: "auto" | "small" | "medium" | "large" | number;
}) {
  const sprite = spritesheetParser.getSprite(option.source ?? "");

  // Get container size class based on size prop
  const getSizeClass = () => {
    if (typeof size === "number") {
      return "";
    }

    switch (size) {
      case "small":
        return "w-8 h-8";
      case "medium":
        return "w-12 h-12";
      case "large":
        return "w-16 h-16";
      default:
        return "w-full h-full aspect-square";
    }
  };

  // Get inline styles for custom numeric size
  const getContainerStyles = () => {
    if (typeof size === "number") {
      return {
        width: `${size}px`,
        height: `${size}px`,
      };
    }
    return {};
  };

  // Calculate sprite positioning and scaling for even distribution
  const getSpriteImageStyle = () => {
    if (!sprite) return {};

    // Calculate scale to make all sprites appear the same visual size
    // We'll scale based on the largest dimension to ensure sprites fit in container
    const maxDimension = Math.max(sprite.width, sprite.height);
    const containerSize = typeof size === "number" ? size : 80; // Increased default container size
    const scale = (containerSize * 0.95) / maxDimension; // 0.95 for minimal padding (bigger images)

    const scaledWidth = sprite.width * scale;
    const scaledHeight = sprite.height * scale;
    const spriteSheetScaledWidth = 2958 * scale;
    const spriteSheetScaledHeight = 2960 * scale;

    return {
      width: `${scaledWidth}px`,
      height: `${scaledHeight}px`,
      backgroundImage: "url(/kenney_monster-builder-pack/spritesheet.png)",
      backgroundPosition: `-${sprite.x * scale}px -${sprite.y * scale}px`,
      backgroundSize: `${spriteSheetScaledWidth}px ${spriteSheetScaledHeight}px`,
      backgroundRepeat: "no-repeat",
    };
  };

  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`rounded-lg transition-all duration-200 capitalize flex items-center justify-center ${
        selected
          ? "bg-blue-500 text-white shadow-md"
          : "bg-black/20 hover:bg-black/30 hover:shadow-md"
      } ${sprite ? "p-2" : "px-3 py-2"}`}
      style={getContainerStyles()}
    >
      {sprite ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`${getSizeClass()} flex items-center justify-center`}
            >
              <div
                className="bg-no-repeat shrink-0"
                style={getSpriteImageStyle()}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-white text-black z-50">
            <p>{option.label}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <span className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
          {option.label}
        </span>
      )}
    </button>
  );
}
