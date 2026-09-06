export interface Backdrop {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number; // 0 = free
  color: string; // theme color for UI
}

export interface EvolutionTier {
  id: string;
  name: string;
  minPoints: number;
  maxPoints: number;
  description: string;
  features: string[];
  color: string;
}

export const backdrops: Backdrop[] = [
  {
    id: 'enchanted-forest',
    name: 'Enchanted Forest',
    description: 'Tall magical trees, fireflies, soft purple and green light',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773794422437_bba3bef5.png',
    price: 0,
    color: '#7C3AED',
  },
  {
    id: 'rainy-day',
    name: 'Rainy Day',
    description: 'Cozy rain on the window, grey blue sky, puddles',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773794449154_38506410.png',
    price: 15,
    color: '#6B7280',
  },
  {
    id: 'starry-night',
    name: 'Starry Night',
    description: 'Deep blue sky, twinkling stars, a large moon',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773794469243_96499ab2.jpg',
    price: 18,
    color: '#1E3A5F',
  },
  {
    id: 'autumn-leaves',
    name: 'Autumn Leaves',
    description: 'Orange and gold falling leaves, warm sunset',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773794490930_f9cbd6b8.png',
    price: 15,
    color: '#D97706',
  },
  {
    id: 'snowy-forest',
    name: 'Snowy Forest',
    description: 'White snow, pine trees, soft blue light',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773794508283_70889b24.jpg',
    price: 18,
    color: '#93C5FD',
  },
  {
    id: 'mystery-cave',
    name: 'Mystery Cave',
    description: 'Dark cave entrance, glowing crystals, bats',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773794531200_c87fd0b8.png',
    price: 22,
    color: '#6D28D9',
  },
  {
    id: 'underwater',
    name: 'Underwater',
    description: 'Fish, bubbles, coral, soft blue green light',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773794556381_b4843952.png',
    price: 22,
    color: '#0D9488',
  },
];

export const evolutionTiers: EvolutionTier[] = [
  {
    id: 'rookie',
    name: 'Rookie',
    minPoints: 0,
    maxPoints: 50,
    description: 'Basic bare treehouse',
    features: ['One lantern', 'Plain wood walls'],
    color: '#92400E',
  },
  {
    id: 'junior',
    name: 'Junior Detective',
    minPoints: 51,
    maxPoints: 150,
    description: 'Getting cozy!',
    features: ['Fairy lights', 'Small rug', 'Window curtains'],
    color: '#7C3AED',
  },
  {
    id: 'super-sleuth',
    name: 'Super Sleuth',
    minPoints: 151,
    maxPoints: 300,
    description: 'A real detective HQ!',
    features: ['Bookshelves', 'Reading chair', 'Corner plants'],
    color: '#059669',
  },
  {
    id: 'master',
    name: 'Master Detective',
    minPoints: 301,
    maxPoints: Infinity,
    description: 'Full magical treehouse!',
    features: ['Glowing mushrooms', 'Telescope', 'Framed awards', 'Forest animals'],
    color: '#DC2626',
  },
];

export const getEvolutionTier = (totalEarned: number): EvolutionTier => {
  for (let i = evolutionTiers.length - 1; i >= 0; i--) {
    if (totalEarned >= evolutionTiers[i].minPoints) {
      return evolutionTiers[i];
    }
  }
  return evolutionTiers[0];
};

export const getNextTier = (totalEarned: number): EvolutionTier | null => {
  const current = getEvolutionTier(totalEarned);
  const idx = evolutionTiers.indexOf(current);
  if (idx < evolutionTiers.length - 1) {
    return evolutionTiers[idx + 1];
  }
  return null;
};

export const getBackdropById = (id: string): Backdrop | undefined => {
  return backdrops.find(b => b.id === id);
};

// HQ localStorage keys
export const HQ_STORAGE_KEYS = {
  BACKDROP: 'wordWhiskerHQ_backdrop',
  BENCH_GADGETS: 'wordWhiskerHQ_benchGadgets',
  EVOLUTION_SEEN: 'wordWhiskerHQ_evolutionSeen',
  OWNED_BACKDROPS: 'wordWhiskerHQ_ownedBackdrops',
  OUTDOOR_PLACEMENTS: 'wordWhiskerHQ_outdoorPlacements',
};

export const TREEHOUSE_EXTERIOR_IMAGE = 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802267860_ba5c99c9.jpg';
