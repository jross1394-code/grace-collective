import React, { useMemo } from 'react';
import { useGame, Venue, VENUE_CONFIG } from '../../context/GameContext';

// --- Isometric Math Helpers ---
const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

function toScreen(gridX: number, gridY: number) {
  return {
    x: (gridX - gridY) * TILE_WIDTH,
    y: (gridX + gridY) * TILE_HEIGHT,
  };
}

// --- Types ---
type TileType = 'wood' | 'carpet_blue' | 'carpet_grey' | 'concrete' | 'stage';
type ObjectType = 'chair' | 'pulpit' | 'speaker' | 'plant' | 'person_casual' | 'person_formal';

interface GridObject {
  x: number;
  y: number;
  type: ObjectType;
  variant?: number;
}

// --- Visual Assets (16-bit Style SVG) ---
// Suburban Non-Denominational Palette
const PALETTE = {
  // Flooring
  woodLight: '#E3C195',
  woodDark: '#8F664E',
  carpetBlue: '#4A6FA5',
  carpetBlueDark: '#354F75',
  carpetGrey: '#7A7A7A',
  carpetGreyDark: '#555555',
  concrete: '#C0C0C0',
  concreteDark: '#808080',
  stageBlack: '#222222',
  stageBlackSide: '#111111',

  // Objects
  chairMetal: '#8899A6',
  chairFabric: '#5D737E', // Muted blue/grey
  chairHighlight: '#7A95A3',
  
  pulpitAcrylic: 'rgba(200, 220, 230, 0.6)', // Glass/Acrylic look
  pulpitWood: '#A67C52',
  
  speakerCabinet: '#1A1A1A',
  speakerGrill: '#333333',
  standMetal: '#111111',

  potCotta: '#B96A59',
  plantGreen: '#4F7942',
  plantGreenLight: '#6B9C59',

  // People (Casual)
  skin: ['#F5D0A9', '#D9A066', '#8D5524', '#E0AC69'],
  shirt: ['#D64933', '#2B303A', '#92B6B1', '#7F95D1', '#FFFFFF'], // Plaids, Polos
  pants: ['#0C1B33', '#7A5C4F', '#4B5563'], // Jeans, Khakis
  hair: ['#000000', '#4E342E', '#E6BE8A', '#8D6E63'],
};

// Helper for randomization
const getRandomColor = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

// 1. Isometric Tile
const IsoTile = ({ x, y, type }: { x: number; y: number; type: TileType }) => {
  const pos = toScreen(x, y);
  
  let fillTop = PALETTE.concrete;
  let fillSide = PALETTE.concreteDark;
  let texture = null;

  switch (type) {
    case 'wood':
      fillTop = PALETTE.woodLight;
      fillSide = PALETTE.woodDark;
      texture = <path d={`M0,0 L${TILE_WIDTH},${TILE_HEIGHT}`} stroke={PALETTE.woodDark} strokeWidth="1" opacity="0.3" />;
      break;
    case 'carpet_blue':
      fillTop = PALETTE.carpetBlue;
      fillSide = PALETTE.carpetBlueDark;
      // Speckle pattern
      texture = (
        <g fill="rgba(255,255,255,0.1)">
          <rect x="-20" y="10" width="2" height="2" />
          <rect x="0" y="20" width="2" height="2" />
          <rect x="20" y="15" width="2" height="2" />
        </g>
      );
      break;
    case 'carpet_grey':
      fillTop = PALETTE.carpetGrey;
      fillSide = PALETTE.carpetGreyDark;
      break;
    case 'stage':
      fillTop = PALETTE.stageBlack;
      fillSide = PALETTE.stageBlackSide;
      break;
  }

  return (
    <g transform={`translate(${pos.x}, ${pos.y})`}>
      {/* Top Face */}
      <path 
        d={`M0,0 L${TILE_WIDTH},${TILE_HEIGHT} L0,${TILE_HEIGHT * 2} L-${TILE_WIDTH},${TILE_HEIGHT} Z`} 
        fill={fillTop}
      />
      {texture}
      {/* Right Side */}
      <path 
        d={`M0,${TILE_HEIGHT * 2} L${TILE_WIDTH},${TILE_HEIGHT} L${TILE_WIDTH},${TILE_HEIGHT + 6} L0,${TILE_HEIGHT * 2 + 6} Z`} 
        fill={fillSide}
        fillOpacity="0.8"
      />
      {/* Left Side */}
      <path 
        d={`M-${TILE_WIDTH},${TILE_HEIGHT} L0,${TILE_HEIGHT * 2} L0,${TILE_HEIGHT * 2 + 6} L-${TILE_WIDTH},${TILE_HEIGHT + 6} Z`} 
        fill={fillSide}
      />
      {/* Border for grid definition */}
      <path 
        d={`M0,0 L${TILE_WIDTH},${TILE_HEIGHT} L0,${TILE_HEIGHT * 2} L-${TILE_WIDTH},${TILE_HEIGHT} Z`} 
        fill="none"
        stroke="rgba(0,0,0,0.05)"
        strokeWidth="1"
      />
    </g>
  );
};

// 2. Isometric Objects
const IsoObject = ({ x, y, type, variant = 0 }: { x: number; y: number; type: ObjectType; variant?: number }) => {
  const pos = toScreen(x, y);
  const screenX = pos.x;
  const screenY = pos.y + TILE_HEIGHT; // Anchor point usually bottom center of tile

  // --- SPRITES ---

  if (type === 'chair') {
    // Modern "Church Chair" (Interlocking, padded)
    return (
      <g transform={`translate(${screenX}, ${screenY})`}>
        {/* Shadow */}
        <ellipse cx="0" cy="0" rx="14" ry="7" fill="rgba(0,0,0,0.2)" />
        
        {/* Legs (Chrome/Metal) */}
        <path d="M-10,-4 L-10,-12 M10,-4 L10,-12" stroke={PALETTE.chairMetal} strokeWidth="3" />
        
        {/* Seat Base */}
        <path d="M-12,-12 L12,-12 L12,-18 L-12,-18 Z" fill={PALETTE.chairMetal} />
        
        {/* Cushion (Main Color) */}
        <path d="M-12,-18 L12,-18 L12,-22 L-12,-22 Z" fill={PALETTE.chairFabric} />
        <path d="M-12,-22 L12,-22 L8,-26 L-16,-26 Z" fill={PALETTE.chairHighlight} /> {/* Top of seat */}

        {/* Backrest */}
        <path d="M-12,-24 L12,-24 L12,-44 L-12,-44 Z" fill={PALETTE.chairFabric} />
        <path d="M-12,-44 L12,-44 L12,-46 L-12,-46 Z" fill={PALETTE.chairHighlight} />
        
        {/* Back Pocket (Detail common in these chairs) */}
        <rect x="-8" y="-40" width="16" height="10" fill="rgba(0,0,0,0.1)" />
      </g>
    );
  }

  if (type === 'pulpit') {
    // Modern Acrylic/Wood Podium
    return (
        <g transform={`translate(${screenX}, ${screenY})`}>
          {/* Base */}
          <path d="M-16,0 L16,0 L16,-4 L-16,-4 Z" fill="#333" />
          
          {/* Stem/Body */}
          <path d="M-8,-4 L8,-4 L12,-40 L-12,-40 Z" fill={PALETTE.pulpitWood} />
          
          {/* Acrylic Top */}
          <path d="M-20,-40 L20,-40 L24,-48 L-16,-48 Z" fill="rgba(200,240,255, 0.4)" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
          
          {/* Bible/iPad */}
          <path d="M-6,-44 L6,-44 L8,-46 L-4,-46 Z" fill="#222" />
        </g>
    );
  }

  if (type === 'speaker') {
      // PA Speaker on Stand
      return (
          <g transform={`translate(${screenX}, ${screenY})`}>
              {/* Tripod Legs */}
              <path d="M0,-20 L-10,0" stroke={PALETTE.standMetal} strokeWidth="2" />
              <path d="M0,-20 L10,0" stroke={PALETTE.standMetal} strokeWidth="2" />
              <path d="M0,-20 L0,0" stroke={PALETTE.standMetal} strokeWidth="2" />
              
              {/* Pole */}
              <line x1="0" y1="-20" x2="0" y2="-40" stroke={PALETTE.standMetal} strokeWidth="3" />
              
              {/* Speaker Box */}
              <path d="M-10,-40 L10,-40 L10,-70 L-10,-70 Z" fill={PALETTE.speakerCabinet} />
              {/* Grill */}
              <rect x="-8" y="-68" width="16" height="26" fill={PALETTE.speakerGrill} />
          </g>
      )
  }

  if (type === 'plant') {
      // Ficus in Pot
      return (
          <g transform={`translate(${screenX}, ${screenY})`}>
              {/* Pot */}
              <path d="M-8,0 L8,0 L10,-12 L-10,-12 Z" fill={PALETTE.potCotta} />
              <ellipse cx="0" cy="-12" rx="10" ry="3" fill="#8B4513" />
              
              {/* Leaves (Simple pixel-ish clusters) */}
              <circle cx="0" cy="-20" r="8" fill={PALETTE.plantGreen} />
              <circle cx="-6" cy="-28" r="6" fill={PALETTE.plantGreenLight} />
              <circle cx="6" cy="-28" r="6" fill={PALETTE.plantGreen} />
              <circle cx="0" cy="-38" r="8" fill={PALETTE.plantGreenLight} />
          </g>
      )
  }

  if (type.startsWith('person')) {
      // Procedural Person - Casual Dress for "Suburban Non-Denom"
      // Use variant to determing colors if needed, or random based on ID (but here we just use what we have)
      
      const skinColor = PALETTE.skin[variant % PALETTE.skin.length];
      const shirtColor = PALETTE.shirt[(variant + 1) % PALETTE.shirt.length];
      const pantsColor = PALETTE.pants[(variant + 2) % PALETTE.pants.length];
      const hairColor = PALETTE.hair[variant % PALETTE.hair.length];

      return (
        <g transform={`translate(${screenX}, ${screenY})`}>
            {/* Shadow */}
            <ellipse cx="0" cy="0" rx="10" ry="4" fill="rgba(0,0,0,0.2)" />
            
            {/* Legs/Pants */}
            <path d="M-7,-4 L-2,-4 L-2,-24 L-7,-24 Z" fill={pantsColor} />
            <path d="M2,-4 L7,-4 L7,-24 L2,-24 Z" fill={pantsColor} />
            
            {/* Torso/Shirt */}
            <path d="M-9,-20 L9,-20 L8,-42 L-8,-42 Z" fill={shirtColor} />
            {/* Sleeves */}
            <path d="M-9,-38 L-13,-30" stroke={shirtColor} strokeWidth="4" strokeLinecap="round"/>
            <path d="M9,-38 L13,-30" stroke={shirtColor} strokeWidth="4" strokeLinecap="round"/>

            {/* Hands */}
            <circle cx="-13" cy="-30" r="2.5" fill={skinColor} />
            <circle cx="13" cy="-30" r="2.5" fill={skinColor} />

            {/* Head */}
            <circle cx="0" cy="-48" r="7" fill={skinColor} />
            
            {/* Hair */}
            <path d="M-7,-48 Q0,-58 7,-48 L7,-45 Q0,-50 -7,-45 Z" fill={hairColor} />
        </g>
      )
  }

  return null;
};

// --- Venue Layout Generator (Thematic) ---
const getVenueLayout = (venue: Venue, members: number) => {
    let width = 8;
    let height = 8;
    let floorType: TileType = 'wood';
    let objects: GridObject[] = [];

    // Helper to add rows of chairs
    const addChairRows = (startX: number, endX: number, startY: number, endY: number) => {
        for (let r = startX; r <= endX; r += 1) { // 1.5 spacing if using grid coords loosely, but here integer grid
             for (let c = startY; c <= endY; c += 1) {
                 objects.push({ x: r, y: c, type: 'chair' });
             }
        }
    };

    if (venue === 'Living Room') {
        width = 8;
        height = 8;
        floorType = 'wood'; // Hardwood in home
        
        objects.push({ x: 0, y: 0, type: 'pulpit' }); // TV stand area?
        objects.push({ x: 0, y: 3, type: 'plant' });
        
        // Circle of chairs/couches implied
        addChairRows(2, 5, 2, 5);
    } 
    else if (venue === 'School Auditorium') {
        width = 12;
        height = 16;
        floorType = 'concrete'; // Gym floor or polished concrete
        
        // Stage area
        objects.push({ x: 1, y: 1, type: 'speaker' });
        objects.push({ x: 1, y: 2, type: 'pulpit' });
        objects.push({ x: 1, y: 3, type: 'speaker' });

        // Rows
        for(let x=4; x<width-1; x++) {
            for(let y=1; y<height-1; y++) {
                 // Leave an aisle in the middle?
                 if (y !== Math.floor(height/2)) {
                    objects.push({ x, y, type: 'chair' });
                 }
            }
        }
    }
    else {
        // "Old Warehouse" / Storefront Church
        width = 16;
        height = 18;
        floorType = 'carpet_grey'; // Commercial carpet
        
        // Stage (Visualized by objects placement, maybe different tile if we had multi-layer)
        objects.push({ x: 1, y: 2, type: 'plant' });
        objects.push({ x: 1, y: 4, type: 'pulpit' });
        objects.push({ x: 1, y: 6, type: 'plant' });
        
        objects.push({ x: 0, y: 0, type: 'speaker' });
        objects.push({ x: 0, y: 8, type: 'speaker' });

        // Dense rows
        for(let x=4; x<width-1; x++) {
            for(let y=1; y<height-1; y++) {
                // Aisle
                if (y !== 4 && y !== 5) {
                    objects.push({ x, y, type: 'chair' });
                }
            }
        }
    }
    
    return { width, height, floorType, objects };
};


export default function IsoMap() {
  const { state } = useGame();
  
  // Memoize layout to prevent jitter
  const { width, height, floorType, objects } = useMemo(() => getVenueLayout(state.venue, state.members), [state.venue]);

  // Calculate filled seats
  // In this style, we want to visualize the actual crowd density
  const totalChairs = objects.filter(o => o.type === 'chair').length;
  // Cap visual filling at 100% of chairs even if members > capacity (standing room not visualized yet)
  const capacity = VENUE_CONFIG[state.venue].capacity || 1;
  const fillRatio = Math.min(1, state.members / capacity);
  const peopleCount = Math.floor(totalChairs * fillRatio);

  // Distribute people randomly but consistently (seeded by index mostly)
  // We re-calculate "occupied" based on count to ensure it grows visually
  const chairs = objects.filter(o => o.type === 'chair');
  const occupiedIndices = useMemo(() => {
      const indices = Array.from({ length: chairs.length }, (_, i) => i);
      // Shuffle indices (pseudo-random based on length to keep stable-ish if count doesn't change?)
      // Actually, simple random shuffle is fine for now, but to keep people from jumping seats every render, 
      // we might want a stable seed. For now, useMemo protects us unless state.members changes.
      for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      return new Set(indices.slice(0, peopleCount));
  }, [peopleCount, chairs.length]); // Re-roll when number of people changes

  const peopleObjects: GridObject[] = [];
  chairs.forEach((chair, idx) => {
      if (occupiedIndices.has(idx)) {
          peopleObjects.push({ 
              x: chair.x, 
              y: chair.y, 
              type: 'person_casual', 
              variant: idx * 123 // pseudo-random variant seed
          });
      }
  });

  const allObjects = [...objects, ...peopleObjects].sort((a, b) => {
      // Isometric depth sort: (x + y)
      // If same coordinate, floor items first (chair), then people
      const depthA = (a.x + a.y) * 10 + (a.type.startsWith('person') ? 1 : 0);
      const depthB = (b.x + b.y) * 10 + (b.type.startsWith('person') ? 1 : 0);
      return depthA - depthB;
  });

  const minX = -height * TILE_WIDTH;
  const maxX = width * TILE_WIDTH;
  const minY = 0;
  const maxY = (width + height) * TILE_HEIGHT + 128; 

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-[#2c3e50] relative select-none">
       {/* Background gradient */}
       <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
       
       {/* Vignette */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] pointer-events-none"></div>

      <svg 
        viewBox={`${minX - 100} ${minY - 50} ${maxX - minX + 200} ${maxY - minY + 100}`}
        className="w-full h-full max-w-full max-h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(0, 32)">
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
                    <IsoObject key={`obj-${i}`} x={obj.x} y={obj.y} type={obj.type} variant={obj.variant} />
                ))}
            </g>
        </g>
      </svg>
      
      {/* Overlay info if needed */}
      <div className="absolute bottom-4 right-4 text-white/50 text-xs font-mono">
          Venue: {state.venue} | Occ: {peopleCount}/{totalChairs}
      </div>
    </div>
  );
}
