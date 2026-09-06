// Post-Story Learning Games Types

export interface GameResult {
  gameType: string;
  score: number;
  maxScore: number;
  completed: boolean;
  timeSpent?: number;
}

export interface WordFamilyMatchGame {
  wordFamily: string;
  correctWords: string[];
  distractorWords: string[];
}

export interface SentenceBuilderGame {
  originalSentence: string;
  words: string[];
}

export interface ChooseRightWordGame {
  sentence: string;
  blank: string;
  correctAnswer: string;
  options: string[];
}

export interface StorySequencingGame {
  events: {
    id: number;
    text: string;
    correctOrder: number;
  }[];
}

export interface ComprehensionQuestion {
  question: string;
  correctAnswer: string;
  options: string[];
}

export interface PictureWordMatch {
  word: string;
  imageUrl: string;
}

export interface MemoryCard {
  id: string;
  type: 'word' | 'image';
  content: string;
  matchId: string;
}

export interface WordSortGame {
  wordFamily: string;
  familyWords: string[];
  nonFamilyWords: string[];
}

export interface MysteryGameData {
  wordFamilyMatch: WordFamilyMatchGame;
  sentenceBuilder: SentenceBuilderGame[];
  chooseRightWord: ChooseRightWordGame[];
  storySequencing: StorySequencingGame;
  comprehensionQuiz: ComprehensionQuestion[];
  wordSort: WordSortGame;
}

export type GameType = 
  | 'word-family-match'
  | 'verb-conjugation'
  | 'sentence-builder'
  | 'choose-right-word'
  | 'story-sequencing'
  | 'sound-it-out'
  | 'word-sort'
  | 'word-search'
  | 'comprehension-quiz'
  | 'picture-word-match'
  | 'memory-flip';
