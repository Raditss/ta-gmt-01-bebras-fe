import { spritesheetParser } from "./spritesheet-parser";

export class SpriteExplorer {
  static async loadAndExplore(): Promise<void> {
    try {
      await spritesheetParser.loadXML(
        "/kenney_monster-builder-pack/spritesheet.xml"
      );

      console.log("🎨 Monster Builder Sprite Explorer");
      console.log("=====================================");

      // Get all sprite categories
      const bodySprites = spritesheetParser.getSpritesByType("body");
      const armSprites = spritesheetParser.getSpritesByType("arm");
      const legSprites = spritesheetParser.getSpritesByType("leg");
      const eyeSprites = spritesheetParser.getSpritesByType("eye");
      const hornSprites = spritesheetParser.getSpritesByPattern("horn");
      const detailSprites = spritesheetParser.getSpritesByType("detail");
      const mouthSprites = spritesheetParser.getSpritesByType("mouth");

      console.log(
        `👁️  Eyes (${eyeSprites.length}):`,
        eyeSprites.map((s) => s.name)
      );
      console.log(
        `🦵 Bodies (${bodySprites.length}):`,
        bodySprites.map((s) => s.name)
      );
      console.log(
        `💪 Arms (${armSprites.length}):`,
        armSprites.map((s) => s.name)
      );
      console.log(
        `🦵 Legs (${legSprites.length}):`,
        legSprites.map((s) => s.name)
      );
      console.log(
        `🦄 Horns (${hornSprites.length}):`,
        hornSprites.map((s) => s.name)
      );
      console.log(
        `✨ Details (${detailSprites.length}):`,
        detailSprites.map((s) => s.name)
      );
      console.log(
        `😊 Mouths (${mouthSprites.length}):`,
        mouthSprites.map((s) => s.name)
      );

      // Extract unique colors
      const extractColors = (sprites: { name: string }[]) => {
        const colors = new Set<string>();
        sprites.forEach((sprite) => {
          const colorMatch = sprite.name.match(/_(\w+)[A-Z\.]/);
          if (colorMatch) colors.add(colorMatch[1]);
        });
        return Array.from(colors);
      };

      console.log(
        "🎨 Available Colors:",
        extractColors([...bodySprites, ...armSprites, ...legSprites])
      );

      // Show total sprites loaded
      console.log(
        `📊 Total sprites loaded: ${spritesheetParser.getAllSprites().length}`
      );
    } catch (error) {
      console.error("❌ Failed to explore sprites:", error);
    }
  }

  static getAvailableOptions() {
    const bodySprites = spritesheetParser.getSpritesByType("body");
    const hornSprites = spritesheetParser.getSpritesByPattern("horn");
    const eyeSprites = spritesheetParser.getSpritesByType("eye");

    // Extract colors from body sprites
    const bodyColors = new Set<string>();
    bodySprites.forEach((sprite) => {
      const match = sprite.name.match(/body_(\w+)[A-Z]/);
      if (match) bodyColors.add(match[1]);
    });

    // Extract horn colors
    const hornColors = new Set<string>();
    hornSprites.forEach((sprite) => {
      const match = sprite.name.match(/detail_(\w+)_horn/);
      if (match) hornColors.add(match[1]);
    });

    // Extract eye types
    const eyeTypes = new Set<string>();
    eyeSprites.forEach((sprite) => {
      const match = sprite.name.match(/eye_(.+)\.png/);
      if (match) eyeTypes.add(match[1]);
    });

    return {
      body: Array.from(bodyColors),
      horns: Array.from(hornColors),
      eyes: Array.from(eyeTypes),
    };
  }
}

// Development helper - only runs in development mode
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (
    window as typeof window & { exploreSprites: () => Promise<void> }
  ).exploreSprites = () => SpriteExplorer.loadAndExplore();
}
