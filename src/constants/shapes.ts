// Centralized fish constants that match available fish images and backend supported types
export const SUPPORTED_FISH = [
  'fish_blue',
  'fish_brown',
  'fish_green',
  'fish_grey',
  'fish_orange',
  'fish_pink',
  'fish_red'
] as const;

export type FishType = (typeof SUPPORTED_FISH)[number];

// Fish definitions for creation UI
export const AVAILABLE_FISH = [
  {
    id: 1,
    type: 'fish_blue' as FishType,
    name: 'Ikan Biru',
    path: '/kenney_fish-pack_2/Double/fish_blue.png'
  },
  {
    id: 2,
    type: 'fish_brown' as FishType,
    name: 'Ikan Cokelat',
    path: '/kenney_fish-pack_2/Double/fish_brown.png'
  },
  {
    id: 3,
    type: 'fish_green' as FishType,
    name: 'Ikan Hijau',
    path: '/kenney_fish-pack_2/Double/fish_green.png'
  },
  {
    id: 4,
    type: 'fish_grey' as FishType,
    name: 'Ikan Abu-abu',
    path: '/kenney_fish-pack_2/Double/fish_grey.png'
  },
  {
    id: 5,
    type: 'fish_orange' as FishType,
    name: 'Ikan Oranye',
    path: '/kenney_fish-pack_2/Double/fish_orange.png'
  },
  {
    id: 6,
    type: 'fish_pink' as FishType,
    name: 'Ikan Pink',
    path: '/kenney_fish-pack_2/Double/fish_pink.png'
  },
  {
    id: 7,
    type: 'fish_red' as FishType,
    name: 'Ikan Merah',
    path: '/kenney_fish-pack_2/Double/fish_red.png'
  }
];

// Fish display names for UI
export const FISH_NAMES: Record<FishType, string> = {
  fish_blue: 'Ikan Biru',
  fish_brown: 'Ikan Cokelat',
  fish_green: 'Ikan Hijau',
  fish_grey: 'Ikan Abu-abu',
  fish_orange: 'Ikan Oranye',
  fish_pink: 'Ikan Pink',
  fish_red: 'Ikan Merah'
};

// Sound queue types for interaction feedback
export const SOUND_TYPES = {
  FISH_SELECT: 'fish_select',
  FISH_DESELECT: 'fish_deselect',
  TRADE_APPLY: 'trade_apply',
  TRADE_SUCCESS: 'trade_success',
  GAME_COMPLETE: 'game_complete',
  ERROR: 'error'
} as const;

export type SoundType = (typeof SOUND_TYPES)[keyof typeof SOUND_TYPES];
