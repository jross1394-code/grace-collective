import React, { useMemo } from 'react';
import { useGame, Venue, VENUE_CONFIG } from '../../context/GameContext';

// --- Isometric Math Helpers ---
const TILE_WIDTH = 64; // Bigger tiles for full screen
const TILE_HEIGHT = 32;

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
        d={`M-${TILE_WIDTH},${TILE_HEIGHT} L0,${TILE_HEIGHT * 2} L0,${TILE_HEIGHT * 2 + 8} L-${TILE_WIDTH},${TILE_HEIGHT + 8} Z`} 
        fill="rgba(0,0,0,0.2)"
      />
      <path 
        d={`M0,${TILE_HEIGHT * 2} L${TILE_WIDTH},${TILE_HEIGHT} L${TILE_WIDTH},${TILE_HEIGHT + 8} L0,${TILE_HEIGHT * 2 + 8} Z`} 
        fill="rgba(0,0,0,0.4)"
      />
    </g>
  );
};

// Generic Iso Object (Billboarded or Block)
const IsoObject = ({ x, y, type }: { x: number; y: number; type: ObjectType }) => {
  const pos = toScreen(x, y);
  
  const screenX = pos.x;
  const screenY = pos.y + TILE_HEIGHT; 

  if (type === 'chair') {
    return (
      <g transform={`translate(${screenX}, ${screenY})`}>
        {/* Chair Legs/Base */}
        <path d="M-12,0 L12,0 L12,-16 L-12,-16 Z" fill={PALETTE.chairDark} />
        {/* Seat */}
        <path d="M-16,-16 L16,-16 L16,-24 L-16,-24 Z" fill={PALETTE.chair} />
        {/* Back */}
        <path d="M-16,-24 L16,-24 L16,-48 L-16,-48 Z" fill={PALETTE.chair} />
        {/* Highlight */}
        <path d="M-16,-48 L16,-48 L16,-44 L-16,-44 Z" fill="rgba(255,255,255,0.2)" />
      </g>
    );
  }

  if (type === 'pulpit') {
    return (
        <g transform={`translate(${screenX}, ${screenY})`}>
          {/* Base */}
          <path d="M-20,0 L20,0 L20,-40 L-20,-40 Z" fill={PALETTE.pulpit} stroke="#000" strokeWidth="1"/>
          {/* Top Slope */}
          <path d="M-24,-40 L24,-40 L24,-48 L-24,-48 Z" fill="#8b4513" />
          {/* Microphone */}
          <line x1="0" y1="-48" x2="10" y2="-60" stroke="#333" strokeWidth="4" />
          <circle cx="10" cy="-60" r="4" fill="#333" />
        </g>
    );
  }

  if (type === 'person') {
      return (
        <g transform={`translate(${screenX}, ${screenY})`}>
            {/* Shadow */}
            <ellipse cx="0" cy="0" rx="12" ry="6" fill="rgba(0,0,0,0.2)" />
            {/* Body */}
            <path d="M-10,-8 L10,-8 L12,-32 L-12,-32 Z" fill={PALETTE.person} />
            {/* Head */}
            <circle cx="0" cy="-40" r="10" fill={PALETTE.skin} />
            {/* Hair (Generic) */}
             <path d="M-10,-40 Q0,-52 10,-40 Z" fill="#444" />
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
        width = 8;
        height = 8;
        floorType = 'wood';
        
        objects.push({ x: 0, y: 0, type: 'pulpit' });
        
        const chairLocs = [
            {x:2, y:1}, {x:2, y:2}, {x:2, y:3},
            {x:3, y:1}, {x:3, y:2}, {x:3, y:3},
            {x:4, y:1}, {x:4, y:2}, {x:4, y:3},
            {x:5, y:1}, {x:5, y:2}, {x:5, y:3},
        ];
        chairLocs.forEach(loc => objects.push({...loc, type: 'chair'}));
    } 
    else if (venue === 'School Auditorium') {
        width = 12;
        height = 14;
        floorType = 'tile';
        objects.push({ x: 1, y: 1, type: 'pulpit' });
        
        for(let r=4; r<width; r++) {
            for(let c=1; c<height-1; c++) {
                objects.push({ x: r, y: c, type: 'chair' });
            }
        }
    }
    else {
        // Generic large room
        width = 16;
        height = 16;
        floorType = 'concrete';
        objects.push({ x: 0, y: 4, type: 'pulpit' });
        for(let r=3; r<width; r+=2) {
            for(let c=0; c<height; c+=2) {
                objects.push({ x: r, y: c, type: 'chair' });
            }
        }
    }
    
    return { width, height, floorType, objects };
};


export default function IsoMap() {
  const { state } = useGame();
  const { width, height, floorType, objects } = useMemo(() => getVenueLayout(state.venue, state.members), [state.venue]);

  // Calculate filled seats
  const totalChairs = objects.filter(o => o.type === 'chair').length;
  const fillPercent = Math.min(1, state.members / (VENUE_CONFIG[state.venue].capacity || 1));
  const peopleToDraw = Math.floor(totalChairs * fillPercent);

  // Identify which chairs get people
  const chairs = objects.filter(o => o.type === 'chair');
  const occupiedIndices = new Set<number>();
  while(occupiedIndices.size < peopleToDraw && occupiedIndices.size < chairs.length) {
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
  const allObjects = [...objects, ...peopleObjects].sort((a, b) => (a.x + a.y) - (b.x + b.y));

  // Viewbox calculations
  const minX = -height * TILE_WIDTH;
  const maxX = width * TILE_WIDTH;
  const minY = 0;
  const maxY = (width + height) * TILE_HEIGHT + 64; 

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-[#87ceeb] relative">
       {/* Simple gradient for wall/bg */}
       <div className="absolute inset-0 bg-gradient-to-b from-[#87ceeb] to-[#fdf6e3] opacity-50"></div>

      <svg 
        viewBox={`${minX - 100} ${minY - 100} ${maxX - minX + 200} ${maxY - minY + 200}`}
        className="w-full h-full pointer-events-none"
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
    </div>
  );
}
