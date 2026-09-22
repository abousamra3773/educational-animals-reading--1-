import { TownLocation, ShopItem } from '../types';

export const townLocations: TownLocation[] = [
  {
    id: 'bakery',
    name: "Jake's Bakery",
    description: 'The only bakery in Tangle Town — owned by Jake the Snake!',
    image: '/locations/jakes-bakery.jpg',
    imageAlt: "Finn Fox holding a pink donut in front of Jake's Bakery stall.",
    level: 1,
    position: { x: 20, y: 30 },
    mysteryIds: ['missing-cake', 'hop-shop'],
    visited: false,
    completed: false
  },
  {
    id: 'sweet-paws',
    name: 'Sweet Paws Treats and Ice Cream',
    description: 'The cupcake shop in the heart of town — sweets, treats, and ice cream!',
    image: '/locations/sweet-paws.jpg',
    imageAlt: 'Pancake the cat with a magnifying glass outside the Sweet Paws cupcake shop.',
    level: 1,
    position: { x: 42, y: 43 },
    mysteryIds: [],
    visited: false,
    completed: false
  },
  {
    id: 'garden',
    name: "Gazelle's Garden",
    description: 'A beautiful garden full of flowers and vegetables!',
    image: '/locations/gazelles-garden.jpg',
    imageAlt: "Mabel Mouse with a magnifying glass in Gazelle's flower garden.",
    level: 1,
    position: { x: 70, y: 25 },
    mysteryIds: ['garden-mystery'],
    visited: false,
    completed: false
  },
  {
    id: 'mushroom-hollow',
    name: 'Mushroom Hollow Homes',
    description: 'A cluster of toadstool cottages where the little critters live.',
    image: '/locations/mushroom-hollow-homes.jpg',
    imageAlt: 'Benny Bear, Batty Bat, and Ted Turtle by the toadstool cottages of Mushroom Hollow.',
    level: 1,
    position: { x: 38, y: 82 },
    mysteryIds: [],
    visited: false,
    completed: false
  },
  {
    id: 'teapot-house',
    name: 'Teapot House',
    description: 'A cozy little home shaped like a giant painted teapot.',
    image: '/locations/teapot-house.jpg',
    imageAlt: 'Leo the Labradoodle in front of the pink Teapot House.',
    level: 1,
    position: { x: 15, y: 44 },
    mysteryIds: [],
    visited: false,
    completed: false
  },
  {
    id: 'boat-house',
    name: 'Boat House',
    description: 'A wooden boat home floating by the pond, home to the ducks.',
    image: '/locations/boat-house.jpg',
    imageAlt: 'Ducky Duck on the dock beside the cozy Boat House on the pond.',
    level: 1,
    position: { x: 84, y: 84 },
    mysteryIds: [],
    visited: false,
    completed: false
  },
  {
    id: 'acorn-store',
    name: 'Acorn Store',
    description: "Zap the Squirrel's shop — acorns, maps, and snacks.",
    image: '/locations/acorn-store.jpg',
    imageAlt: 'Zap the Squirrel holding an acorn outside the acorn-shaped store.',
    level: 1,
    position: { x: 90, y: 45 },
    mysteryIds: ['flapping-cap'],
    visited: false,
    completed: false
  },
  {
    id: 'willas-nest',
    name: "Willa's Nest",
    description: 'A snug bird nest high in the great oak tree.',
    image: '/locations/willas-nest.jpg',
    imageAlt: "Willa the Warbler and Oliver the Owl in Willa's cozy treetop nest.",
    level: 1,
    position: { x: 87, y: 16 },
    mysteryIds: [],
    visited: false,
    completed: false
  },

  {
    id: 'library',
    name: 'Whisker Library',
    description: 'A quiet place filled with wonderful books!',
    image: '/locations/library.jpg',
    imageAlt: 'Mitsy the Mole holding a book outside the brick Whisker Library.',
    level: 1,
    position: { x: 45, y: 15 },
    mysteryIds: ['sleepy-town', 'night-light'],
    visited: false,
    completed: false
  },
  {
    id: 'cottage',
    name: 'Cozy Cottage Lane',
    description: 'Friendly animal homes along a winding path!',
    image: '/locations/cozy-cottage-lane.jpg',
    imageAlt: 'Mabel Mouse and Milo the Mink saying hello on Cozy Cottage Lane.',
    level: 2,
    position: { x: 25, y: 60 },
    mysteryIds: ['lost-hat', 'rainy-day'],
    visited: false,
    completed: false
  },
  {
    id: 'park',
    name: 'Tangle Tail Park',
    description: 'A fun park where everyone loves to play!',
    image: '/locations/tangle-tail-park.jpg',
    imageAlt: 'Zap the Squirrel, Pip the Skunk, and friends playing at Tangle Tail Park.',
    level: 2,
    position: { x: 65, y: 55 },
    mysteryIds: ['sunny-park', 'duck-luck', 'snowy-day'],
    visited: false,
    completed: false
  },

  {
    id: 'tower',
    name: 'Bell Tower Square',
    description: 'The town center with the famous bell tower!',
    image: '/locations/bell-tower-square.jpg',
    imageAlt: 'Willa the Wandering Warbler in Bell Tower Square by the clock tower.',
    level: 2,
    position: { x: 45, y: 45 },
    mysteryIds: ['bell-tower', 'king-ring'],
    visited: false,
    completed: false
  }
];

export const townMapImage = 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769466729530_d1261ef0.png';

export const shopItems: ShopItem[] = [
  {
    id: 'detective-hat',
    name: 'Detective Hat',
    description: 'A classic detective cap!',
    type: 'hat',
    price: 50,
    image: '',
    color: '#8B4513'
  },
  {
    id: 'bow-tie',
    name: 'Fancy Bow Tie',
    description: 'Look sharp and smart!',
    type: 'scarf',
    price: 30,
    image: '',
    color: '#FF6B6B'
  },
  {
    id: 'reading-glasses',
    name: 'Reading Glasses',
    description: 'Perfect for finding clues!',
    type: 'glasses',
    price: 40,
    image: '',
    color: '#4A90D9'
  },
  {
    id: 'star-badge',
    name: 'Star Badge',
    description: 'Show off your achievements!',
    type: 'badge',
    price: 60,
    image: '',
    color: '#FFD700'
  },
  {
    id: 'flower-crown',
    name: 'Flower Crown',
    description: 'Beautiful spring flowers!',
    type: 'hat',
    price: 45,
    image: '',
    color: '#FF69B4'
  },
  {
    id: 'winter-scarf',
    name: 'Cozy Scarf',
    description: 'Stay warm and stylish!',
    type: 'scarf',
    price: 35,
    image: '',
    color: '#87CEEB'
  }
];

export const avatarColors: { id: string; name: string; color: string }[] = [
  { id: 'orange', name: 'Orange', color: '#FF8C42' },
  { id: 'purple', name: 'Purple', color: '#9B59B6' },
  { id: 'blue', name: 'Blue', color: '#3498DB' },
  { id: 'pink', name: 'Pink', color: '#E91E8C' },
  { id: 'green', name: 'Green', color: '#27AE60' },
  { id: 'brown', name: 'Brown', color: '#8B5A2B' },
  { id: 'gray', name: 'Gray', color: '#7F8C8D' },
  { id: 'cream', name: 'Cream', color: '#F5DEB3' }
];

export const avatarAnimals = [
  { id: 'fox', name: 'Fox', emoji: '🦊' },
  { id: 'bunny', name: 'Bunny', emoji: '🐰' },
  { id: 'owl', name: 'Owl', emoji: '🦉' },
  { id: 'cat', name: 'Cat', emoji: '🐱' },
  { id: 'bear', name: 'Bear', emoji: '🐻' },
  { id: 'raccoon', name: 'Raccoon', emoji: '🦝' },
  { id: 'squirrel', name: 'Squirrel', emoji: '🐿️' },
  { id: 'deer', name: 'Deer', emoji: '🦌' }
];
