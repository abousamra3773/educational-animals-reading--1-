export interface Character {
  id: string;
  name: string;
  animal: string;
  specialty: string;
  personality: string;
  image: string;
  fullBodyImage?: string;
  color: string;
}


// Dialogue line for scene-based stories
export interface DialogueLine {
  speaker: 'narrator' | 'detective' | string; // 'detective' uses avatar name, string for character names
  characterId?: string; // optional reference to a character
  text: string;
  emotion?: 'happy' | 'sad' | 'surprised' | 'thinking' | 'excited' | 'worried';
}

// Scene for the new story format
export interface StoryScene {
  id: number;
  title?: string;
  image: string;
  headerText?: string; // Text shown above the image (like "Can you find the missing recipe?")
  dialogue: DialogueLine[];
  isInteractive?: boolean; // For scenes where user needs to click something
  interactiveTarget?: {
    description: string;
    hint: string;
    position?: { x: number; y: number; width: number; height: number }; // Clickable area
  };
}

export interface Mystery {
  id: string;
  title: string;
  tagline?: string; // Short description shown on card
  description: string;
  detective: Character;
  wordFamily: string;
  difficulty: 'easy' | 'medium' | 'hard';
  stars: number;
  completed: boolean;
  words: string[];
  story: StoryPage[];
  scenes?: StoryScene[]; // New scene-based format
  locationId?: string;
}

export interface StoryPage {
  id: number;
  text: string;
  clue?: string;
  image?: string;
}

export interface UserProgress {
  completedMysteries: string[];
  badges: Badge[];
  wordFamiliesMastered: string[];
  totalStars: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export interface AccessibilitySettings {
  textSize: 'small' | 'medium' | 'large' | 'xlarge';
  highContrast: boolean;
  audioSpeed: number;
}

// New types for avatar and town progression

export interface Avatar {
  id: string;
  name: string;
  animalType: 'fox' | 'bunny' | 'owl' | 'cat' | 'bear' | 'raccoon' | 'squirrel' | 'deer';
  color: string;
  accessories: string[];
}

export interface TownLocation {
  id: string;
  name: string;
  description: string;
  image: string;
  position: { x: number; y: number };
  mysteryIds: string[];
  visited: boolean;
  completed: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'disguise' | 'outfit' | 'gadget' | 'pet' | 'outdoor' | 'hat' | 'shoes' | 'accessory';
  subtype?: 'garden' | 'tree' | 'doorstep' | 'sky' | 'pathway';
  price: number;
  image: string;
  color?: string;
}


export type OutdoorZone = 'garden' | 'tree' | 'doorstep' | 'sky' | 'pathway';

export interface OutdoorPlacements {
  garden: string[];
  tree: string[];
  doorstep: string[];
  sky: string[];
  pathway: string[];
}



export interface GameScore {
  mysteryId: string;
  gameType: 'comprehension' | 'word-family' | 'sentence-builder' | 'story-sequencing' | 'choose-right-word' | 'verb-conjugation';

  score: number;
  maxScore: number;
  completedAt: string;
  timeSpent?: number; // in seconds
}

export interface PlayerState {
  avatar: Avatar | null;
  coins: number;
  currentLevel: number;
  ownedItems: string[];
  hasCompletedOnboarding: boolean;
  gameScores: GameScore[];
  chosenDetectiveId: string | null;
}


export interface CloudSyncData {
  progress: {
    completedMysteries: string[];
    wordFamiliesMastered: string[];
    totalStars: number;
  };
  badges: { id: string; earned: boolean; earnedDate?: string }[];
  playerState: {
    avatar: Avatar | null;
    coins: number;
    currentLevel: number;
    ownedItems: string[];
    hasCompletedOnboarding: boolean;
    gameScores: GameScore[];
  };
  accessibility: AccessibilitySettings;
  lastSyncedAt: string;
}


// Voice Recording types
export interface VoiceRecording {
  id: string;
  mysteryId: string;
  mysteryTitle: string;
  pageNumber: number;
  pageText: string;
  audioBlob: Blob;
  duration: number; // in seconds
  recordedAt: string;
  isFavorite: boolean;
  childName?: string;
}

export interface RecordingMetadata {
  id: string;
  mysteryId: string;
  mysteryTitle: string;
  pageNumber: number;
  pageText: string;
  duration: number;
  recordedAt: string;
  isFavorite: boolean;
  childName?: string;
}


// Worksheet Score types
export interface WorksheetScoreSection {
  score: number;
  max: number;
}

export interface WorksheetScore {
  id?: string;
  mysteryId: string;
  fillInBlank: WorksheetScoreSection;
  wordMatching: WorksheetScoreSection;
  sentenceCompletion: WorksheetScoreSection;
  comprehension: WorksheetScoreSection;
  notes: string;
  scoredAt: string;
  totalScore?: number;
  totalMax?: number;
  percentage?: number;
}
