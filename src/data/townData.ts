import { TownLocation, ShopItem } from '../types';

export const townLocations: TownLocation[] = [
  {
    id: 'bakery',
    name: 'Sweet Paws Bakery',
    description: 'A cozy bakery where delicious treats are made!',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769466744080_819937d7.jpg',
    position: { x: 20, y: 30 },
    mysteryIds: ['missing-cake', 'hop-shop'],
    visited: false,
    completed: false
  },
  {
    id: 'garden',
    name: 'Sunny Meadow Garden',
    description: 'A beautiful garden full of flowers and vegetables!',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769466765809_8dc3643f.png',
    position: { x: 70, y: 25 },
    mysteryIds: ['garden-mystery'],
    visited: false,
    completed: false
  },

  {
    id: 'library',
    name: 'Whisker Library',
    description: 'A quiet place filled with wonderful books!',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769466785081_6bac5d27.png',
    position: { x: 45, y: 15 },
    mysteryIds: ['sleepy-town', 'night-light'],
    visited: false,
    completed: false
  },
  {
    id: 'cottage',
    name: 'Cozy Cottage Lane',
    description: 'Friendly animal homes along a winding path!',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769466799334_a4b462ec.jpg',
    position: { x: 25, y: 60 },
    mysteryIds: ['lost-hat', 'rainy-day'],
    visited: false,
    completed: false
  },
  {
    id: 'park',
    name: 'Tangle Tail Park',
    description: 'A fun park where everyone loves to play!',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769466817313_8a765e56.jpg',
    position: { x: 65, y: 55 },
    mysteryIds: ['sunny-park', 'duck-luck', 'snowy-day'],
    visited: false,
    completed: false
  },

  {
    id: 'tower',
    name: 'Bell Tower Square',
    description: 'The town center with the famous bell tower!',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769466828832_e7d136c7.jpg',
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
