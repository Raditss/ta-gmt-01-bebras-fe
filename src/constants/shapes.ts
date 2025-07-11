// Centralized shape constants that match backend supported shapes
export const SUPPORTED_SHAPES = [
  'circle',
  'triangle',
  'square',
  'star',
  'hexagon',
  'pentagon',
  'octagon',
  'diamond'
] as const;

export type ShapeType = (typeof SUPPORTED_SHAPES)[number];

// Shape definitions for creation UI
export const AVAILABLE_SHAPES = [
  { id: 1, type: 'circle' as ShapeType, icon: '⚪' },
  { id: 2, type: 'triangle' as ShapeType, icon: '△' },
  { id: 3, type: 'square' as ShapeType, icon: '⬜' },
  { id: 4, type: 'star' as ShapeType, icon: '⭐' },
  { id: 5, type: 'hexagon' as ShapeType, icon: '⬡' },
  { id: 6, type: 'pentagon' as ShapeType, icon: '⬟' },
  { id: 7, type: 'octagon' as ShapeType, icon: '⬢' },
  { id: 8, type: 'diamond' as ShapeType, icon: '♦️' }
];

// Shape display names for UI
export const SHAPE_NAMES: Record<ShapeType, string> = {
  circle: 'Circle',
  triangle: 'Triangle',
  square: 'Square',
  star: 'Star',
  hexagon: 'Hexagon',
  pentagon: 'Pentagon',
  octagon: 'Octagon',
  diamond: 'Diamond'
};
