import { ShopItem } from '../types';

export const shopItems: ShopItem[] = [
  // Disguises
  {
    id: 'disguise-moustache',
    name: 'Fake Moustache',
    description: 'A curly fake moustache for the sneakiest detectives!',
    type: 'disguise',
    price: 8,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792188732_1ef4b706.png',
    color: '#8B4513'
  },
  {
    id: 'disguise-spyglasses',
    name: 'Spy Glasses',
    description: 'See through any mystery with these cool spy glasses!',
    type: 'disguise',
    price: 10,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792187241_b5c572bb.jpg',
    color: '#1F2937'
  },
  {
    id: 'disguise-wig',
    name: 'Funny Wig',
    description: 'A wild and wacky wig to fool any suspect!',
    type: 'disguise',
    price: 12,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792192302_f5278f63.png',
    color: '#EC4899'
  },
  {
    id: 'disguise-mask',
    name: 'Superhero Mask',
    description: 'A heroic mask for the bravest detectives!',
    type: 'disguise',
    price: 15,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792194859_3178e696.png',
    color: '#DC2626'
  },
  {
    id: 'disguise-cloak',
    name: 'Invisible Cloak',
    description: 'Become invisible and sneak past anyone!',
    type: 'disguise',
    price: 20,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792194405_b61358c0.jpg',
    color: '#6366F1'
  },

  // Outfits
  {
    id: 'outfit-detective',
    name: 'Classic Detective Coat',
    description: 'The classic trench coat every great detective needs!',
    type: 'outfit',
    price: 15,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792213116_3b01868c.jpg',
    color: '#92400E'
  },
  {
    id: 'outfit-tuxedo',
    name: 'Spy Tuxedo',
    description: 'A sleek tuxedo for undercover missions!',
    type: 'outfit',
    price: 20,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792219695_88fd080f.png',
    color: '#1F2937'
  },
  {
    id: 'outfit-explorer',
    name: 'Nature Explorer Vest',
    description: 'Perfect for outdoor detective adventures!',
    type: 'outfit',
    price: 18,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792221760_362c340a.png',
    color: '#16A34A'
  },
  {
    id: 'outfit-cape',
    name: 'Superhero Cape',
    description: 'Fly into action with this awesome cape!',
    type: 'outfit',
    price: 25,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792215463_2c19e1a0.jpg',
    color: '#DC2626'
  },

  // Gadgets
  {
    id: 'gadget-magnifying',
    name: 'Magnifying Glass',
    description: 'Zoom in on the tiniest clues!',
    type: 'gadget',
    price: 10,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792238729_3c361b1b.jpg',
    color: '#F59E0B'
  },
  {
    id: 'gadget-spyglass',
    name: 'Spyglass',
    description: 'See far away clues with this telescope!',
    type: 'gadget',
    price: 12,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792246762_4d4ada2f.png',
    color: '#B45309'
  },
  {
    id: 'gadget-notebook',
    name: 'Clue Notebook',
    description: 'Write down every clue you find!',
    type: 'gadget',
    price: 8,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792240555_73c8f47d.jpg',
    color: '#7C3AED'
  },
  {
    id: 'gadget-decoder',
    name: 'Decoder Ring',
    description: 'Crack secret codes with this magic ring!',
    type: 'gadget',
    price: 15,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792245204_977ef6f7.png',
    color: '#059669'
  },

  // Pets
  {
    id: 'pet-butterfly',
    name: 'Butterfly',
    description: 'A beautiful butterfly companion!',
    type: 'pet',
    price: 20,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792263502_dd26c9a7.jpg',
    color: '#EC4899'
  },
  {
    id: 'pet-firefly',
    name: 'Firefly',
    description: 'A glowing firefly to light the way!',
    type: 'pet',
    price: 22,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792270179_2937f672.png',
    color: '#F59E0B'
  },
  {
    id: 'pet-dragonfly',
    name: 'Dragonfly',
    description: 'A speedy dragonfly sidekick!',
    type: 'pet',
    price: 25,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792267798_aa1fb975.jpg',
    color: '#3B82F6'
  },
];

// Hats
export const hatItems: ShopItem[] = [
  {
    id: 'hat-detective',
    name: 'Detective Hat',
    description: 'The classic fedora every great detective wears!',
    type: 'hat',
    price: 15,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773887675206_4b54bda8.jpg',
    color: '#8B6914'
  },
  {
    id: 'hat-wizard',
    name: 'Wizard Hat',
    description: 'A magical pointy hat with stars and moons!',
    type: 'hat',
    price: 20,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773887698488_ef4ce149.jpg',
    color: '#7C3AED'
  },
  {
    id: 'hat-crown',
    name: 'Royal Crown',
    description: 'A golden crown fit for a detective king or queen!',
    type: 'hat',
    price: 25,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773887716818_ce416272.jpg',
    color: '#F59E0B'
  },
  {
    id: 'hat-pirate',
    name: 'Pirate Hat',
    description: 'Ahoy! A swashbuckling hat for sea-faring detectives!',
    type: 'hat',
    price: 12,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773887735586_550f43b8.jpg',
    color: '#1F2937'
  },
];

// Shoes
export const shoesItems: ShopItem[] = [
  {
    id: 'shoes-sneakers',
    name: 'Speedy Sneakers',
    description: 'Run fast and catch those clues with these cool sneakers!',
    type: 'shoes',
    price: 10,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773887759205_c34c3734.jpg',
    color: '#EF4444'
  },
  {
    id: 'shoes-boots',
    name: 'Explorer Boots',
    description: 'Sturdy boots for trekking through any mystery terrain!',
    type: 'shoes',
    price: 15,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773887776844_3626bf80.jpg',
    color: '#92400E'
  },
  {
    id: 'shoes-slippers',
    name: 'Bunny Slippers',
    description: 'Super cozy slippers for solving mysteries at home!',
    type: 'shoes',
    price: 12,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773887794301_f31db9ad.jpg',
    color: '#F472B6'
  },
  {
    id: 'shoes-rollerskates',
    name: 'Roller Skates',
    description: 'Zoom around town on these radical roller skates!',
    type: 'shoes',
    price: 20,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773887813624_d5ad343a.jpg',
    color: '#8B5CF6'
  },
];

// Accessories
export const accessoryItems: ShopItem[] = [
  {
    id: 'accessory-scarf',
    name: 'Cozy Scarf',
    description: 'A warm striped scarf for chilly detective days!',
    type: 'accessory',
    price: 12,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773887846865_0420835d.jpg',
    color: '#DC2626'
  },
  {
    id: 'accessory-backpack',
    name: 'Adventure Backpack',
    description: 'Carry all your detective tools in this handy backpack!',
    type: 'accessory',
    price: 18,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773887866370_d6d8448b.jpg',
    color: '#2563EB'
  },
  {
    id: 'accessory-badge',
    name: 'Detective Badge',
    description: 'An official shiny badge that proves you\'re a real detective!',
    type: 'accessory',
    price: 10,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773887886967_c7fa2c2a.jpg',
    color: '#F59E0B'
  },
  {
    id: 'accessory-bowtie',
    name: 'Fancy Bow Tie',
    description: 'Look dapper and distinguished with this fancy bow tie!',
    type: 'accessory',
    price: 15,
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773887905233_d6a08640.jpg',
    color: '#7C3AED'
  },
];


// Outdoor items for treehouse exterior
export const outdoorShopItems: ShopItem[] = [
  // Garden items
  { id: 'outdoor-glowing-mushrooms', name: 'Glowing Mushrooms', description: 'Magical mushrooms that glow softly in the dark!', type: 'outdoor', subtype: 'garden', price: 8, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802313479_f74c6b42.jpg', color: '#8B5CF6' },
  { id: 'outdoor-rainbow-flowers', name: 'Rainbow Flowers', description: 'Beautiful flowers in every color of the rainbow!', type: 'outdoor', subtype: 'garden', price: 10, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802340202_4c0c2f54.jpg', color: '#EC4899' },
  { id: 'outdoor-crystal-cluster', name: 'Crystal Cluster', description: 'Sparkling crystals that catch the moonlight!', type: 'outdoor', subtype: 'garden', price: 15, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802343157_6e4b0841.jpg', color: '#06B6D4' },
  { id: 'outdoor-fairy-ring', name: 'Fairy Ring', description: 'A magical circle where fairies dance at night!', type: 'outdoor', subtype: 'garden', price: 18, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802342733_4eb5e521.jpg', color: '#A855F7' },
  // Tree decorations
  { id: 'outdoor-hanging-lantern', name: 'Hanging Lantern', description: 'A warm lantern to light up the tree!', type: 'outdoor', subtype: 'tree', price: 10, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802350321_04b45106.jpg', color: '#F59E0B' },
  { id: 'outdoor-wind-chimes', name: 'Wind Chimes', description: 'Tinkling chimes that sing in the breeze!', type: 'outdoor', subtype: 'tree', price: 12, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802343027_b1f628aa.jpg', color: '#94A3B8' },
  { id: 'outdoor-star-banner', name: 'Star Banner', description: 'A string of glowing stars across the branches!', type: 'outdoor', subtype: 'tree', price: 15, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802345494_6c895c56.jpg', color: '#EAB308' },
  { id: 'outdoor-birdhouse', name: 'Birdhouse', description: 'A cozy home for forest birds!', type: 'outdoor', subtype: 'tree', price: 12, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802345853_10c69950.jpg', color: '#22C55E' },
  // Doorstep items
  { id: 'outdoor-welcome-mat', name: 'Welcome Mat', description: 'A cozy mat for the treehouse entrance!', type: 'outdoor', subtype: 'doorstep', price: 8, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802351230_d0627d62.jpg', color: '#92400E' },
  { id: 'outdoor-name-sign', name: 'Name Sign', description: 'A sign with your detective\'s name on it!', type: 'outdoor', subtype: 'doorstep', price: 15, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802309080_7d1cba67.jpg', color: '#B45309' },
  { id: 'outdoor-potted-fern', name: 'Potted Fern', description: 'A lush green fern for the doorstep!', type: 'outdoor', subtype: 'doorstep', price: 10, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802306321_83ec8074.jpg', color: '#16A34A' },
  // Sky items
  { id: 'outdoor-firefly-swarm', name: 'Firefly Swarm', description: 'A cloud of glowing fireflies above the treehouse!', type: 'outdoor', subtype: 'sky', price: 12, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802307802_78e36f00.jpg', color: '#FBBF24' },
  { id: 'outdoor-floating-balloons', name: 'Floating Balloons', description: 'Colorful balloons floating in the sky!', type: 'outdoor', subtype: 'sky', price: 15, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802314040_8ad09231.jpg', color: '#F472B6' },
  { id: 'outdoor-rainbow', name: 'Rainbow', description: 'A magical rainbow arching over the treehouse!', type: 'outdoor', subtype: 'sky', price: 20, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802309679_c269e9e1.jpg', color: '#EF4444' },
  { id: 'outdoor-full-moon', name: 'Full Moon Glow', description: 'A beautiful glowing full moon in the sky!', type: 'outdoor', subtype: 'sky', price: 18, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802310821_acdf615f.jpg', color: '#FDE68A' },
  // Pathway items
  { id: 'outdoor-stepping-stones', name: 'Glowing Stepping Stones', description: 'Magical stones that light the path!', type: 'outdoor', subtype: 'pathway', price: 10, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802317410_c915794e.jpg', color: '#A78BFA' },
  { id: 'outdoor-flower-border', name: 'Flower Border', description: 'Pretty flowers lining the pathway!', type: 'outdoor', subtype: 'pathway', price: 12, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802312739_04693671.jpg', color: '#FB923C' },
  { id: 'outdoor-garden-fence', name: 'Garden Fence', description: 'A charming little fence for the garden!', type: 'outdoor', subtype: 'pathway', price: 15, image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773802353718_d9cbd4c2.jpg', color: '#78716C' },
];

// Combined wearable items (for avatar dress-up — excludes outdoor)
export const allWearableItems: ShopItem[] = [...shopItems, ...hatItems, ...shoesItems, ...accessoryItems];

export const allShopItems: ShopItem[] = [...shopItems, ...hatItems, ...shoesItems, ...accessoryItems, ...outdoorShopItems];

export const MYSTERY_BOX_IMAGE = 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773792288354_fd2ecae2.jpg';
export const MYSTERY_BOX_PRICE = 20;

export const getShopItemsByType = (type: ShopItem['type']): ShopItem[] => {
  if (type === 'outdoor') return outdoorShopItems;
  if (type === 'hat') return hatItems;
  if (type === 'shoes') return shoesItems;
  if (type === 'accessory') return accessoryItems;
  return shopItems.filter(item => item.type === type);
};

export const getOutdoorItemsBySubtype = (subtype: string): ShopItem[] => {
  return outdoorShopItems.filter(item => item.subtype === subtype);
};

export const getShopItemById = (id: string): ShopItem | undefined => {
  return allShopItems.find(item => item.id === id);
};
