import React from 'react';
import { SPRITES, PALETTE } from '../../lib/pixelData';

// --- Constants ---
export const TILE_WIDTH = 32;
export const TILE_HEIGHT = 16;
export const SCALE = 2; // Pixel art scaling

// --- Sprite Renderer ---

interface SpriteProps {
  name: string;
  variant?: number;
  flip?: boolean;
}

// Cache for generated data URIs to avoid re-drawing every frame
const spriteCache: Record<string, string> = {};

const getSpriteDataURI = (name: string, variant: number = 0) => {
  const key = `${name}-${variant}`;
  if (spriteCache[key]) return spriteCache[key];

  const spriteDef = SPRITES[name];
  if (!spriteDef) return ''; // Placeholder or fallback?

  // Create an offscreen canvas (conceptually, here we construct an SVG data URI for simplicity in React)
  // Actually, generating a base64 PNG in pure JS without canvas in Node is hard, 
  // but we are in the browser. However, to keep it fast and compatible with SSR/RSC, 
  // let's build a tiny SVG string which is vector but looks like pixels.
  // OR, we just map 1x1 rects.
  
  // Let's use the SVG Pixel approach directly in the component for now, 
  // optimizing by grouping same-colored pixels if possible is too complex for this step.
  // We will just return the definition to be rendered.
  
  return null; 
};

export const PixelSprite = ({ name, variant = 0, flip = false, className }: SpriteProps & { className?: string }) => {
  const sprite = SPRITES[name];
  if (!sprite) return null;

  // Process data to SVG rects
  // We memoize this in the parent or rely on React to be fast enough for 100s of rects?
  // 100s of rects per sprite * 100 sprites = 10,000 DOM nodes. Too slow.
  
  // BETTER APPROACH: Canvas.
  // But strictly asking for "Asset" component usage.
  // Let's generate a Data URI for an SVG image on the fly? No, too slow.
  
  // BEST APPROACH for "Strict Sprite Usage" in DOM:
  // Render a single <canvas> for the whole map? 
  // The user asked for "Graphic Assets" to be used.
  // Let's make this component render a highly optimized SVG group of rects, 
  // but we MUST ensure we don't have 1000s of them.
  
  // Actually, for "Game Dev Story" style, we usually have static PNG assets.
  // Since I have to GENERATE them with code (Gemini), I will use a helper 
  // to draw the sprite to a tiny canvas and export as DataURL, then render an <img>.
  
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = React.useState<string>('');

  React.useEffect(() => {
      // If we already have a global cache for this sprite name/variant, use it.
      // (Simple global cache implementation)
      if ((window as any)._spriteCache?.[name]) {
          setDataUrl((window as any)._spriteCache[name]);
          return;
      }

      if (!sprite) return;

      const cvs = document.createElement('canvas');
      cvs.width = sprite.w;
      cvs.height = sprite.h;
      const ctx = cvs.getContext('2d');
      if (!ctx) return;

      sprite.data.forEach((row, y) => {
          // Parse row string
          // We need a robust parser. The current example data is simple strings like "__K__".
          // We need to parse 2-char codes if using the palette properly, or 1-char.
          // The current `pixelData.ts` uses variable length logic? 
          // Let's assume standard "3 chars per pixel" or "comma separated" or just split by color key length.
          // Wait, the `pixelData.ts` I wrote uses regex or simple replacement logic?
          // Looking at `pixelData.ts`: "___wd3_wd3..."
          // It seems I used `_` for empty and 3-char codes.
          
          // Custom Parser for the format in pixelData.ts:
          // We will iterate through the string.
          // If char is '_', skip 1 pixel.
          // If char matches a key in PALETTE (checking 3 chars, then 2, then 1), draw.
          
          let x = 0;
          let i = 0;
          while (i < row.length) {
              if (row[i] === '_') {
                  x++;
                  i++;
                  continue;
              }
              
              // Try 3 chars
              let code = row.substr(i, 3);
              if (PALETTE[code as keyof typeof PALETTE]) {
                  ctx.fillStyle = PALETTE[code as keyof typeof PALETTE]!;
                  ctx.fillRect(x, y, 1, 1);
                  x++;
                  i += 3;
                  continue;
              }
              
              // Try 2 chars (e.g., G1)
              code = row.substr(i, 2);
              if (PALETTE[code as keyof typeof PALETTE]) {
                   ctx.fillStyle = PALETTE[code as keyof typeof PALETTE]!;
                   ctx.fillRect(x, y, 1, 1);
                   x++;
                   i += 2;
                   continue;
              }
              
              // Try 1 char (e.g. K)
              code = row.substr(i, 1);
              if (PALETTE[code as keyof typeof PALETTE]) {
                  ctx.fillStyle = PALETTE[code as keyof typeof PALETTE]!;
                  ctx.fillRect(x, y, 1, 1);
                  x++;
                  i += 1;
                  continue;
              }
              
              // Unknown? Skip.
              x++;
              i++;
          }
      });

      const url = cvs.toDataURL();
      
      // Cache it
      if (!(window as any)._spriteCache) (window as any)._spriteCache = {};
      (window as any)._spriteCache[name] = url;
      
      setDataUrl(url);

  }, [name]);

  if (!dataUrl) return null;

  return (
    <img 
        src={dataUrl} 
        width={sprite.w * SCALE} 
        height={sprite.h * SCALE}
        style={{ 
            imageRendering: 'pixelated',
            transform: flip ? 'scaleX(-1)' : undefined
        }}
        className={className}
        alt={name}
    />
  );
};
