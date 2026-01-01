import React from 'react';

// --- Constants ---
export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;

// --- Palette (Suburban Church Theme) ---
export const PALETTE = {
  // Environment
  floorWoodLight: '#E3C195',
  floorWoodDark: '#8F664E',
  floorCarpetBlue: '#4A6FA5',
  floorCarpetBlueDark: '#354F75',
  floorConcrete: '#C0C0C0',
  floorConcreteDark: '#808080',
  stageBlack: '#222222',
  stageBlackSide: '#111111',

  // Furniture
  chairFrame: '#8899A6',
  chairFabric: '#5D737E',
  chairHighlight: '#7A95A3',
  pulpitWood: '#A67C52',
  pulpitGlass: 'rgba(200, 230, 255, 0.5)',
  
  // Tech/Stage
  speakerCase: '#1A1A1A',
  speakerGrill: '#333333',
  standMetal: '#111111',
  drumShell: '#990000',
  cymbalGold: '#FFD700',

  // Decor
  potCotta: '#B96A59',
  plantGreen: '#4F7942',
  plantGreenLight: '#6B9C59',
  tableWhite: '#F0F0F0',
  coffeeUrn: '#C0C0C0',

  // People Skins
  skins: ['#F5D0A9', '#D9A066', '#8D5524', '#E0AC69', '#5C3A21'],
  // Clothes
  shirts: ['#D64933', '#2B303A', '#92B6B1', '#7F95D1', '#FFFFFF', '#333333', '#556B2F'],
  pants: ['#0C1B33', '#7A5C4F', '#4B5563', '#1A1A1A'],
  hair: ['#000000', '#4E342E', '#E6BE8A', '#8D6E63', '#A9A9A9'],
  
  // Staff Specific
  staffShirt: '#000000', // Tech team black
  usherShirt: '#FFFFFF', // Ushers
  lanyard: '#FF4500',
};

// --- Helper Components ---

const PixelRect = ({ x, y, w, h, fill }: { x: number, y: number, w: number, h: number, fill: string }) => (
  <rect x={x} y={y} width={w} height={h} fill={fill} shapeRendering="crispEdges" />
);

// --- 1. Floor Tiles ---

export const AssetTile = ({ type }: { type: string }) => {
  let fillTop = PALETTE.floorConcrete;
  let fillSide = PALETTE.floorConcreteDark;
  let texture = null;

  switch (type) {
    case 'wood':
      fillTop = PALETTE.floorWoodLight;
      fillSide = PALETTE.floorWoodDark;
      texture = (
        <g opacity="0.4">
           <path d={`M10,5 L54,27`} stroke={PALETTE.floorWoodDark} strokeWidth="1" />
           <path d={`M0,16 L64,16`} stroke={PALETTE.floorWoodDark} strokeWidth="1" />
           <path d={`M20,0 L20,16 M40,16 L40,32`} stroke={PALETTE.floorWoodDark} strokeWidth="1" />
        </g>
      );
      break;
    case 'carpet_blue':
      fillTop = PALETTE.floorCarpetBlue;
      fillSide = PALETTE.floorCarpetBlueDark;
      texture = (
         <g fill="rgba(255,255,255,0.1)">
           <rect x="10" y="10" width="2" height="2" />
           <rect x="30" y="20" width="2" height="2" />
           <rect x="50" y="15" width="2" height="2" />
           <rect x="20" y="25" width="2" height="2" />
         </g>
      );
      break;
    case 'stage':
      fillTop = PALETTE.stageBlack;
      fillSide = PALETTE.stageBlackSide;
      break;
  }

  return (
    <g>
      {/* Top */}
      <path d={`M0,0 L${TILE_WIDTH},${TILE_HEIGHT} L0,${TILE_HEIGHT * 2} L-${TILE_WIDTH},${TILE_HEIGHT} Z`} fill={fillTop} />
      {texture}
      {/* Sides (Thickness) */}
      <path d={`M0,${TILE_HEIGHT * 2} L${TILE_WIDTH},${TILE_HEIGHT} L${TILE_WIDTH},${TILE_HEIGHT + 6} L0,${TILE_HEIGHT * 2 + 6} Z`} fill={fillSide} fillOpacity="0.8" />
      <path d={`M-${TILE_WIDTH},${TILE_HEIGHT} L0,${TILE_HEIGHT * 2} L0,${TILE_HEIGHT * 2 + 6} L-${TILE_WIDTH},${TILE_HEIGHT + 6} Z`} fill={fillSide} />
      {/* Highlight/Border */}
      <path d={`M0,0 L${TILE_WIDTH},${TILE_HEIGHT} L0,${TILE_HEIGHT * 2} L-${TILE_WIDTH},${TILE_HEIGHT} Z`} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
    </g>
  );
};

// --- 2. Furniture & Objects ---

export const AssetChair = () => (
  <g transform="translate(0, -8)">
    <ellipse cx="0" cy="8" rx="14" ry="7" fill="rgba(0,0,0,0.2)" />
    {/* Legs */}
    <path d="M-11,0 L-11,-10 M11,0 L11,-10" stroke={PALETTE.chairFrame} strokeWidth="2" />
    {/* Seat */}
    <path d="M-13,-10 L13,-10 L13,-16 L-13,-16 Z" fill={PALETTE.chairFrame} />
    <path d="M-13,-16 L13,-16 L13,-20 L-13,-20 Z" fill={PALETTE.chairFabric} />
    <path d="M-13,-20 L13,-20 L9,-23 L-17,-23 Z" fill={PALETTE.chairHighlight} />
    {/* Back */}
    <path d="M-13,-22 L13,-22 L13,-40 L-13,-40 Z" fill={PALETTE.chairFabric} />
    <path d="M-13,-40 L13,-40 L13,-42 L-13,-42 Z" fill={PALETTE.chairHighlight} />
    {/* Pocket Detail */}
    <rect x="-9" y="-36" width="18" height="8" fill="rgba(0,0,0,0.1)" rx="1" />
  </g>
);

export const AssetPulpit = () => (
  <g transform="translate(0, -4)">
    <path d="M-18,0 L18,0 L18,-4 L-18,-4 Z" fill="#333" />
    <path d="M-10,-4 L10,-4 L14,-38 L-14,-38 Z" fill={PALETTE.pulpitWood} />
    {/* Acrylic Top */}
    <path d="M-22,-38 L22,-38 L26,-46 L-18,-46 Z" fill={PALETTE.pulpitGlass} stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
    {/* Logo/Cross Placeholder */}
    <circle cx="0" cy="-20" r="4" fill="rgba(0,0,0,0.1)" />
  </g>
);

export const AssetSpeaker = () => (
  <g transform="translate(0, -8)">
    {/* Stand */}
    <path d="M0,-20 L-12,0 M0,-20 L12,0 M0,-20 L0,0" stroke={PALETTE.standMetal} strokeWidth="2" />
    <line x1="0" y1="-20" x2="0" y2="-45" stroke={PALETTE.standMetal} strokeWidth="3" />
    {/* Box */}
    <path d="M-12,-45 L12,-45 L12,-80 L-12,-80 Z" fill={PALETTE.speakerCase} />
    <rect x="-10" y="-78" width="20" height="30" fill={PALETTE.speakerGrill} />
    {/* Horn */}
    <rect x="-10" y="-47" width="20" height="6" fill="#111" />
  </g>
);

export const AssetDrumKit = () => (
    <g transform="translate(0, -10)">
        {/* Bass Drum */}
        <circle cx="0" cy="-15" r="14" fill={PALETTE.drumShell} stroke="#DDD" strokeWidth="1"/>
        <circle cx="0" cy="-15" r="11" fill="#EEE" /> 
        {/* Tom */}
        <circle cx="-10" cy="-35" r="7" fill={PALETTE.drumShell} />
        <ellipse cx="-10" cy="-38" rx="7" ry="3" fill="#FFF" />
        {/* Floor Tom */}
        <circle cx="16" cy="-15" r="9" fill={PALETTE.drumShell} />
        <ellipse cx="16" cy="-20" rx="9" ry="4" fill="#FFF" />
        {/* Cymbal */}
        <line x1="-20" y1="-10" x2="-25" y2="-40" stroke="#333" strokeWidth="2" />
        <ellipse cx="-25" cy="-40" rx="10" ry="2" fill={PALETTE.cymbalGold} />
    </g>
);

export const AssetPlant = () => (
    <g transform="translate(0, -5)">
        <path d="M-8,0 L8,0 L10,-14 L-10,-14 Z" fill={PALETTE.potCotta} />
        {/* Leaves - stacked circles for bushiness */}
        <circle cx="0" cy="-20" r="10" fill={PALETTE.plantGreenDark || '#2E4F26'} />
        <circle cx="-8" cy="-28" r="8" fill={PALETTE.plantGreen} />
        <circle cx="8" cy="-28" r="8" fill={PALETTE.plantGreen} />
        <circle cx="0" cy="-38" r="8" fill={PALETTE.plantGreenLight} />
    </g>
);

export const AssetCoffeeStation = () => (
    <g transform="translate(0, -5)">
        {/* Table */}
        <path d="M-24,0 L-24,-16 M24,0 L24,-16" stroke="#555" strokeWidth="2" />
        <path d="M-28,-16 L28,-16 L32,-24 L-24,-24 Z" fill={PALETTE.tableWhite} />
        {/* Urns */}
        <rect x="-16" y="-36" width="10" height="14" fill={PALETTE.coffeeUrn} />
        <rect x="0" y="-36" width="10" height="14" fill={PALETTE.coffeeUrn} />
        {/* Cups */}
        <rect x="18" y="-28" width="4" height="4" fill="#FFF" />
        <rect x="22" y="-26" width="4" height="4" fill="#FFF" />
    </g>
);

// --- 3. Entities (People) ---

export type PersonRole = 'guest' | 'staff_usher' | 'staff_tech' | 'band_guitar' | 'band_singer';

interface PersonProps {
    variant: number; // For randomness
    role?: PersonRole;
}

export const AssetPerson = ({ variant, role = 'guest' }: PersonProps) => {
    // Deterministic randoms based on variant
    const skinColor = PALETTE.skins[variant % PALETTE.skins.length];
    const hairColor = PALETTE.hair[(variant + 2) % PALETTE.hair.length];
    
    let shirtColor = PALETTE.shirts[(variant + 1) % PALETTE.shirts.length];
    let pantsColor = PALETTE.pants[(variant + 3) % PALETTE.pants.length];
    
    // Role Overrides
    if (role === 'staff_usher') {
        shirtColor = PALETTE.usherShirt;
        pantsColor = '#000000';
    } else if (role === 'staff_tech') {
        shirtColor = PALETTE.staffShirt;
        pantsColor = '#000000';
    }

    return (
      <g transform="translate(0, -6)">
        <ellipse cx="0" cy="6" rx="10" ry="4" fill="rgba(0,0,0,0.2)" />
        
        {/* Legs */}
        <path d="M-6,0 L-1,0 L-1,-22 L-6,-22 Z" fill={pantsColor} />
        <path d="M1,0 L6,0 L6,-22 L1,-22 Z" fill={pantsColor} />
        
        {/* Torso */}
        <path d="M-8,-20 L8,-20 L8,-44 L-8,-44 Z" fill={shirtColor} />
        
        {/* Arms */}
        <path d="M-8,-40 L-12,-30" stroke={shirtColor} strokeWidth="4" strokeLinecap="round"/>
        <path d="M8,-40 L12,-30" stroke={shirtColor} strokeWidth="4" strokeLinecap="round"/>
        <circle cx="-12" cy="-30" r="3" fill={skinColor} />
        <circle cx="12" cy="-30" r="3" fill={skinColor} />

        {/* Accessorries */}
        {role === 'staff_usher' && (
            <path d="M-4,-42 Q0,-30 4,-42" stroke={PALETTE.lanyard} strokeWidth="2" fill="none" />
        )}
        {role === 'staff_usher' && (
            <rect x="-2" y="-34" width="4" height="5" fill="#FFF" stroke="#000" strokeWidth="0.5" />
        )}
        {role === 'staff_tech' && (
             <path d="M-9,-48 L9,-48" stroke="#333" strokeWidth="2" fill="none" /> // Headset band
        )}
        {role === 'band_guitar' && (
             <g transform="translate(0, -30) rotate(-15)">
                 {/* Guitar Body */}
                 <ellipse cx="0" cy="5" rx="8" ry="10" fill="#800000" />
                 <rect x="-2" y="-15" width="4" height="20" fill="#5C3A21" />
             </g>
        )}

        {/* Head */}
        <circle cx="0" cy="-48" r="8" fill={skinColor} />
        
        {/* Hair */}
        <path d="M-8,-48 Q0,-60 8,-48 L8,-44 Q0,-50 -8,-44 Z" fill={hairColor} />
      </g>
    );
};
