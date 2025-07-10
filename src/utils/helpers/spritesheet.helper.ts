interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ParsedSprite {
  name: string;
  frame: SpriteFrame;
}

interface PIXIFrameData {
  frame: { x: number; y: number; w: number; h: number };
}

interface PIXISpritesheetData {
  frames: Record<string, PIXIFrameData>;
  meta: {
    image: string;
    format: string;
    size: { w: number; h: number };
    scale: number;
  };
}

export class SpritesheetHelper {
  private xmlData: string | null = null;
  private sprites: Map<string, SpriteFrame> = new Map();
  private xmlPath: string | null = null;

  async loadXML(xmlPath: string): Promise<void> {
    try {
      const response = await fetch(xmlPath);
      this.xmlData = await response.text();
      if (this.xmlPath === xmlPath) return;
      this.xmlPath = xmlPath;
      this.sprites.clear();
      this.parseXML();
    } catch (error) {
      console.error('Failed to load XML:', error);
      throw error;
    }
  }

  private parseXML(): void {
    if (!this.xmlData) return;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this.xmlData, 'text/xml');
    const subtextures = xmlDoc.querySelectorAll('SubTexture');

    subtextures.forEach((subtexture) => {
      const name = subtexture.getAttribute('name');
      const x = parseInt(subtexture.getAttribute('x') || '0');
      const y = parseInt(subtexture.getAttribute('y') || '0');
      const width = parseInt(subtexture.getAttribute('width') || '0');
      const height = parseInt(subtexture.getAttribute('height') || '0');

      if (name) {
        this.sprites.set(name, { x, y, width, height });
      }
    });
  }

  getSprite(name: string): SpriteFrame | null {
    return this.sprites.get(name) || null;
  }

  getAllSprites(): ParsedSprite[] {
    return Array.from(this.sprites.entries()).map(([name, frame]) => ({
      name,
      frame
    }));
  }

  getSpritesByType(type: string): ParsedSprite[] {
    return this.getAllSprites().filter((sprite) =>
      sprite.name.toLowerCase().includes(type.toLowerCase())
    );
  }

  getSpritesByPattern(pattern: string): ParsedSprite[] {
    return this.getAllSprites().filter((sprite) =>
      sprite.name.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  toPIXIFormat(imagePath: string): PIXISpritesheetData {
    const frames: Record<string, PIXIFrameData> = {};

    this.sprites.forEach((frame, name) => {
      frames[name] = {
        frame: { x: frame.x, y: frame.y, w: frame.width, h: frame.height }
      };
    });

    return {
      frames,
      meta: {
        image: imagePath,
        format: 'RGBA8888',
        size: { w: 2958, h: 2958 },
        scale: 1
      }
    };
  }
}

export const spritesheetParser = new SpritesheetHelper();
