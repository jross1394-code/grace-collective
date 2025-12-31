import React, { useMemo } from 'react';
import { useGame, Venue, VENUE_CONFIG } from '../../context/GameContext';

// --- Isometric Math Helpers ---
const TILE_WIDTH = 32;
const TILE_HEIGHT = 16; // 2:1 isometric ratio

function toScreen(gridX: number, gridY: number) {
  return {
    x: (gridX - gridY) * TILE_WIDTH,
    y: (gridX + gridY) * TILE_HEIGHT,
  };
}

// --- Types ---
type TileType = 'wood' | 'carpet' | 'tile' | 'concrete' | 'grass' | 'dark';
type ObjectType = 'chair' | 'table' | 'pulpit' | 'speaker' | 'plant' | 'wall' | 'person';

interface GridObject {
  x: number;
  y: number;
  type: ObjectType;
  variant?: number;
}

// --- Visual Assets (SVG Paths) ---
const PALETTE = {
  wood: '#d2b48c',
  woodSide: '#8b4513',
  carpet: '#d33682',
  tile: '#eee8d5',
  concrete: '#93a1a1',
  grass: '#859900',
  dark: '#073642',
  
  chair: '#cb4b16',
  chairDark: '#bd362f',
  pulpit: '#b58900',
  person: '#268bd2',
  skin: '#ffccaa',
};

// Generic Iso Tile (Floor)
const IsoTile = ({ x, y, type }: { x: number; y: number; type: TileType }) => {
  const pos = toScreen(x, y);
  const fill = PALETTE[type];
  
  return (
    <g transform={`translate(${pos.x}, ${pos.y})`}>
      <path 
        d={`M0,0 L${TILE_WIDTH},${TILE_HEIGHT} L0,${TILE_HEIGHT * 2} L-${TILE_WIDTH},${TILE_HEIGHT} Z`} 
        fill={fill}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
      />
      {/* Side Thickness (Fake 3D) */}
      <path 
        d={`M-${TILE_WIDTH},${TILE_HEIGHT} L0,${TILE_HEIGHT * 2} L0,${TILE_HEIGHT * 2 + 4} L-${TILE_WIDTH},${TILE_HEIGHT + 4} Z`} 
        fill="rgba(0,0,0,0.2)"
      />
      <path 
        d={`M0,${TILE_HEIGHT * 2} L${TILE_WIDTH},${TILE_HEIGHT} L${TILE_WIDTH},${TILE_HEIGHT + 4} L0,${TILE_HEIGHT * 2 + 4} Z`} 
        fill="rgba(0,0,0,0.4)"
      />
    </g>
  );
};

// Generic Iso Object (Billboarded or Block)
const IsoObject = ({ x, y, type }: { x: number; y: number; type: ObjectType }) => {
  const pos = toScreen(x, y);
  // Center object on tile
  // The tile center is at (0, TILE_HEIGHT) relative to tile origin, but toScreen gives top-center.
  // Actually toScreen(x,y) is top corner of the diamond.
  // Center of tile is (0, TILE_HEIGHT).
  
  const screenX = pos.x;
  const screenY = pos.y + TILE_HEIGHT; 

  if (type === 'chair') {
    return (
      <g transform={`translate(${screenX}, ${screenY})`}>
        {/* Chair Legs/Base */}
        <path d="M-6,0 L6,0 L6,-8 L-6,-8 Z" fill={PALETTE.chairDark} />
        {/* Seat */}
        <path d="M-8,-8 L8,-8 L8,-12 L-8,-12 Z" fill={PALETTE.chair} />
        {/* Back */}
        <path d="M-8,-12 L8,-12 L8,-24 L-8,-24 Z" fill={PALETTE.chair} />
        {/* Highlight */}
        <path d="M-8,-24 L8,-24 L8,-22 L-8,-22 Z" fill="rgba(255,255,255,0.2)" />
      </g>
    );
  }

  if (type === 'pulpit') {
    return (
        <g transform={`translate(${screenX}, ${screenY})`}>
          {/* Base */}
          <path d="M-10,0 L10,0 L10,-20 L-10,-20 Z" fill={PALETTE.pulpit} stroke="#000" strokeWidth="1"/>
          {/* Top Slope */}
          <path d="M-12,-20 L12,-20 L12,-24 L-12,-24 Z" fill="#8b4513" />
          {/* Microphone */}
          <line x1="0" y1="-24" x2="5" y2="-30" stroke="#333" strokeWidth="2" />
          <circle cx="5" cy="-30" r="2" fill="#333" />
        </g>
    );
  }

  if (type === 'person') {
      return (
        <g transform={`translate(${screenX}, ${screenY})`}>
            {/* Shadow */}
            <ellipse cx="0" cy="0" rx="6" ry="3" fill="rgba(0,0,0,0.2)" />
            {/* Body */}
            <path d="M-5,-4 L5,-4 L6,-16 L-6,-16 Z" fill={PALETTE.person} />
            {/* Head */}
            <circle cx="0" cy="-20" r="5" fill={PALETTE.skin} />
            {/* Hair (Generic) */}
             <path d="M-5,-20 Q0,-26 5,-20 Z" fill="#444" />
        </g>
      )
  }

  return null;
};

// --- Venue Layout Generator ---
const getVenueLayout = (venue: Venue, members: number) => {
    let width = 6;
    let height = 6;
    let floorType: TileType = 'wood';
    let objects: GridObject[] = [];

    // Base config
    if (venue === 'Living Room') {
        width = 6;
        height = 6;
        floorType = 'wood';
        
        // Pulpit/TV Area
        objects.push({ x: 0, y: 0, type: 'pulpit' });
        
        // Chairs/Couches (simplified as chairs for now)
        // Capacity 20. 4 rows of 3?
        const chairLocs = [
            {x:2, y:1}, {x:2, y:2}, {x:2, y:3},
            {x:3, y:1}, {x:3, y:2}, {x:3, y:3},
            {x:4, y:1}, {x:4, y:2}, {x:4, y:3},
        ];
        chairLocs.forEach(loc => objects.push({...loc, type: 'chair'}));
    } 
    else if (venue === 'School Auditorium') {
        width = 8;
        height = 10;
        floorType = 'tile';
        objects.push({ x: 1, y: 1, type: 'pulpit' });
        
        // More chairs
        for(let r=3; r<width; r++) {
            for(let c=1; c<height-1; c++) {
                objects.push({ x: r, y: c, type: 'chair' });
            }
        }
    }
    else {
        // Generic large room
        width = 10;
        height = 10;
        floorType = 'concrete';
        objects.push({ x: 0, y: 4, type: 'pulpit' });
        for(let r=2; r<width; r+=2) {
            for(let c=0; c<height; c+=2) {
                objects.push({ x: r, y: c, type: 'chair' });
            }
        }
    }

    // Populate People
    // Simple logic: fill chairs first, then random?
    // Actually, let's just draw people ON TOP of chairs if present, or near them.
    // We'll treat people as a separate layer in rendering.
    
    return { width, height, floorType, objects };
};


export default function IsoMap() {
  const { state } = useGame();
  const { width, height, floorType, objects } = useMemo(() => getVenueLayout(state.venue, state.members), [state.venue]);

  // Calculate filled seats
  // This is purely visual.
  // We want to overlay people on top of chairs based on member count.
  const totalChairs = objects.filter(o => o.type === 'chair').length;
  // Visual fill %
  const fillPercent = Math.min(1, state.members / (VENUE_CONFIG[state.venue].capacity || 1));
  const peopleToDraw = Math.floor(totalChairs * fillPercent);

  // Identify which chairs get people
  const chairs = objects.filter(o => o.type === 'chair');
  const occupiedIndices = new Set<number>();
  while(occupiedIndices.size < peopleToDraw && occupiedIndices.size < chairs.length) {
      // Fill from front? or random?
      // Let's fill sequentially for "filling up" effect, or random for organic look.
      // Random is better.
      const idx = Math.floor(Math.random() * chairs.length);
      occupiedIndices.add(idx);
  }

  // Create People Objects
  const peopleObjects: GridObject[] = [];
  chairs.forEach((chair, idx) => {
      if (occupiedIndices.has(idx)) {
          peopleObjects.push({ x: chair.x, y: chair.y, type: 'person' });
      }
  });


  // Sorting for depth: Painter's Algorithm
  // Draw tiles first (usually fine to just draw by grid order).
  // Draw objects sorted by (x + y).
  const allObjects = [...objects, ...peopleObjects].sort((a, b) => (a.x + a.y) - (b.x + b.y));

  // Viewbox calculations
  // MinX, MinY, MaxX, MaxY
  // Center the grid.
  const midX = 0; // Top corner is 0,0
  const midY = 0;
  // We need enough padding.
  // Grid extends from (0,0) to (w,h).
  // Top: (0,0) -> 0,0
  // Bottom: (w,h) -> 0, (w+h)*TH
  // Left: (0,h) -> -h*TW, h*TH
  // Right: (w,0) -> w*TW, w*TH
  
  const minX = -height * TILE_WIDTH;
  const maxX = width * TILE_WIDTH;
  const minY = 0;
  const maxY = (width + height) * TILE_HEIGHT + 32; // +32 for object height

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-[#87ceeb] relative border-b-4 border-[#002b36]">
       {/* Simple gradient for wall/bg */}
       <div className="absolute inset-0 bg-gradient-to-b from-[#87ceeb] to-[#fdf6e3] opacity-50"></div>

      <svg 
        viewBox={`${minX - 40} ${minY - 40} ${maxX - minX + 80} ${maxY - minY + 80}`}
        className="w-full h-full max-w-[600px] pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Render Tiles */}
        <g>
            {Array.from({ length: width }).map((_, x) => 
                Array.from({ length: height }).map((_, y) => (
                    <IsoTile key={`tile-${x}-${y}`} x={x} y={y} type={floorType} />
                ))
            )}
        </g>

        {/* Render Objects */}
        <g>
            {allObjects.map((obj, i) => (
                <IsoObject key={`obj-${i}`} x={obj.x} y={obj.y} type={obj.type} />
            ))}
        </g>
      </svg>
      
      {/* Overlay info */}
      <div className="absolute bottom-2 right-2 text-xs font-bold text-[#002b36] bg-white/80 p-1 border border-[#002b36]">
          {state.venue}
      </div>
    </div>
  );
}
