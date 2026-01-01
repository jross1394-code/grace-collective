import React, { useMemo } from 'react';
import { useGame, Venue, VENUE_CONFIG } from '../../context/GameContext';
import { PixelSprite, TILE_WIDTH, TILE_HEIGHT, SCALE, SPRITES } from './GameAssets';

// --- Isometric Math Helpers ---
function toScreen(gridX: number, gridY: number) {
  // ISO grid:
  // x increases to bottom-right
  // y increases to bottom-left
  // (0,0) is top center
  return {
    x: (gridX - gridY) * (TILE_WIDTH / 2) * SCALE,
    y: (gridX + gridY) * (TILE_HEIGHT / 2) * SCALE,
  };
}

// --- Types ---
type TileType = 'floor_wood' | 'floor_carpet';
type ObjectType = 'chair' | 'pulpit' | 'speaker' | 'plant' | 'person';

interface GridObject {
  x: number;
  y: number;
  type: ObjectType;
  variant?: number;
}

// --- Venue Layout Generator (Thematic) ---
const getVenueLayout = (venue: Venue, members: number) => {
    let width = 8;
    let height = 8;
    let floorType: TileType = 'floor_wood';
    let objects: GridObject[] = [];

    if (venue === 'Living Room') {
        width = 8;
        height = 8;
        floorType = 'floor_wood';
        
        objects.push({ x: 0, y: 0, type: 'pulpit' }); 
        
        // Circle of chairs
        objects.push({ x: 2, y: 2, type: 'chair' });
        objects.push({ x: 2, y: 3, type: 'chair' });
        objects.push({ x: 3, y: 2, type: 'chair' });
        objects.push({ x: 3, y: 3, type: 'chair' });
    } 
    else if (venue === 'School Auditorium') {
        width = 10;
        height = 12;
        floorType = 'floor_wood'; 
        
        // Stage area
        objects.push({ x: 1, y: 1, type: 'speaker' });
        objects.push({ x: 1, y: 2, type: 'pulpit' });
        objects.push({ x: 1, y: 3, type: 'speaker' });

        // Rows
        for(let x=3; x<width-1; x++) {
            for(let y=1; y<height-1; y++) {
                 if (y !== Math.floor(height/2)) { // Aisle
                    objects.push({ x, y, type: 'chair' });
                 }
            }
        }
    }
    else {
        // Warehouse
        width = 14;
        height = 14;
        floorType = 'floor_carpet';
        
        objects.push({ x: 1, y: 7, type: 'pulpit' });
        objects.push({ x: 0, y: 4, type: 'speaker' });
        objects.push({ x: 0, y: 10, type: 'speaker' });

        for(let x=4; x<width-1; x++) {
            for(let y=1; y<height-1; y++) {
                if (y !== 7) {
                    objects.push({ x, y, type: 'chair' });
                }
            }
        }
    }
    
    return { width, height, floorType, objects };
};


export default function IsoMap() {
  const { state } = useGame();
  
  const { width, height, floorType, objects } = useMemo(() => getVenueLayout(state.venue, state.members), [state.venue]);

  // Crowd Calculation
  const totalChairs = objects.filter(o => o.type === 'chair').length;
  const capacity = VENUE_CONFIG[state.venue].capacity || 1;
  const fillRatio = Math.min(1, state.members / capacity);
  const peopleCount = Math.floor(totalChairs * fillRatio);

  const chairs = objects.filter(o => o.type === 'chair');
  const occupiedIndices = useMemo(() => {
      const indices = Array.from({ length: chairs.length }, (_, i) => i);
      // Simple shuffle
      for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      return new Set(indices.slice(0, peopleCount));
  }, [peopleCount, chairs.length]); 

  const peopleObjects: GridObject[] = [];
  chairs.forEach((chair, idx) => {
      if (occupiedIndices.has(idx)) {
          // Person sits slightly higher than the chair base to look like they are ON it
          peopleObjects.push({ 
              x: chair.x, 
              y: chair.y, 
              type: 'person', 
              variant: idx 
          });
      }
  });

  const allObjects = [...objects, ...peopleObjects].sort((a, b) => {
      return (a.x + a.y) - (b.x + b.y);
  });

  // Center the map
  const mapWidthPx = (width + height) * (TILE_WIDTH / 2) * SCALE;
  const mapHeightPx = (width + height) * (TILE_HEIGHT / 2) * SCALE;

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-[#2c3e50] relative select-none">
       {/* Background */}
       <div className="absolute inset-0 bg-slate-900"></div>
       
       <div 
         className="relative"
         style={{
             width: mapWidthPx,
             height: mapHeightPx,
             transform: 'translateY(-10%)' 
         }}
       >
            {/* Tiles Layer */}
            {Array.from({ length: width }).map((_, x) => 
                Array.from({ length: height }).map((_, y) => {
                    const pos = toScreen(x, y);
                    // Standard Loop order (x then y) is fine for floor if flat.
                    // But we want to center the whole grid.
                    // Let's rely on absolute positioning relative to container.
                    return (
                        <div 
                            key={`tile-${x}-${y}`}
                            className="absolute"
                            style={{ 
                                left: pos.x, 
                                top: pos.y,
                                zIndex: 0 
                            }}
                        >
                            <PixelSprite name={floorType} />
                        </div>
                    )
                })
            )}

            {/* Objects Layer */}
            {allObjects.map((obj, i) => {
                const pos = toScreen(obj.x, obj.y);
                
                let spriteName = '';
                if (obj.type === 'chair') spriteName = 'chair_front';
                if (obj.type === 'pulpit') spriteName = 'pulpit';
                if (obj.type === 'speaker') spriteName = 'speaker';
                if (obj.type === 'person') spriteName = 'person_standing';

                // Depth Sorting
                // (x + y) gives the diagonal plane.
                // We add small offsets for layering on same tile (person > chair)
                const depth = (obj.x + obj.y) * 10 + (obj.type === 'person' ? 5 : 1);

                // Sprite Offset
                // The position `pos` is the top-left of the TILE sprite (which is 32x17).
                // We want to align the OBJECT sprite's "anchor" (ox, oy) to the tile center.
                // Tile Center is at (16, 8) relative to tile sprite top-left.
                // Object Sprite Anchor is at (ox, oy) relative to object sprite top-left.
                // So we place object at: pos.x + (16 - ox)*SCALE, pos.y + (8 - oy)*SCALE.
                
                // Wait, `toScreen` returns the top-left of the bounding box where the tile sprite should be drawn?
                // `toScreen` logic: (x-y)*16, (x+y)*8.
                // If x=0,y=0 -> 0,0. This is the top point of the diamond?
                // The tile sprite (floor_wood) has the diamond top at roughly 16,0 (center top).
                // So if we place the image at 0,0, the diamond top is at 16,0.
                
                // If we want the object to stand on the center of the tile:
                // Center of tile logic is 16, 8 (relative to tile image).
                // We want the object's anchor (ox, oy) to be at that same screen point.
                
                const tileCenterX = 16; 
                const tileCenterY = 8;
                
                const spriteDef = SPRITES[spriteName];
                const ox = spriteDef ? spriteDef.ox : 0;
                const oy = spriteDef ? spriteDef.oy : 0;

                const offsetX = (tileCenterX - ox) * SCALE;
                const offsetY = (tileCenterY - oy) * SCALE;
                
                // For people sitting in chairs, we might want to lift them a bit?
                // Currently `person_standing` is generic. Let's just offset Y a bit if it overlaps a chair?
                // The logic above handles `type === 'person'` sorting.
                // If sitting, we might need a `person_sitting` sprite or just shift Y up.
                // Let's shift up by 4px (unscaled) -> 8px scaled.
                const sitOffset = (obj.type === 'person' && objects.some(o => o.x === obj.x && o.y === obj.y && o.type === 'chair')) ? -4 * SCALE : 0;

                return (
                    <div
                        key={`obj-${i}`}
                        className="absolute pointer-events-none"
                        style={{
                            left: pos.x,
                            top: pos.y,
                            zIndex: depth,
                            transform: `translate(${offsetX}px, ${offsetY + sitOffset}px)`
                        }}
                    >
                        <PixelSprite name={spriteName} variant={obj.variant} />
                    </div>
                );
            })}
       </div>
       
       <div className="absolute bottom-4 right-4 text-white/50 text-xs font-mono">
          Venue: {state.venue} | Occ: {peopleCount}/{totalChairs}
      </div>
    </div>
  );
}
