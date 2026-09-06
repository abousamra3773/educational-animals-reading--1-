import { MysteryGameData } from '../types/games';
import { StoryScene } from '../types';

// Generate game data for each mystery based on word family and story
export function generateGameData(
  mysteryId: string,
  wordFamily: string,
  words: string[],
  story: { id: number; text: string; clue?: string }[],
  scenes?: StoryScene[]
): MysteryGameData {
  // Common distractor words for various word families
  const distractorPools: Record<string, string[]> = {
    '-ake': ['apple', 'book', 'cat', 'dog', 'fish', 'green', 'happy', 'jump'],
    '-at': ['apple', 'book', 'cake', 'dog', 'fish', 'green', 'happy', 'jump'],
    '-ig': ['apple', 'book', 'cake', 'dog', 'fish', 'green', 'happy', 'jump'],
    '-eep': ['apple', 'book', 'cake', 'dog', 'fish', 'green', 'happy', 'jump'],
    '-ain': ['apple', 'book', 'cake', 'dog', 'fish', 'green', 'happy', 'jump'],
    '-un': ['apple', 'book', 'cake', 'dog', 'fish', 'green', 'happy', 'jump'],
    '-ell': ['apple', 'book', 'cake', 'dog', 'fish', 'green', 'happy', 'jump'],
    '-op': ['apple', 'book', 'cake', 'dog', 'fish', 'green', 'happy', 'jump'],
    '-ight': ['apple', 'book', 'cake', 'dog', 'fish', 'green', 'happy', 'jump'],
    '-ow': ['apple', 'book', 'cake', 'dog', 'fish', 'green', 'happy', 'jump'],
    '-ing': ['apple', 'book', 'cake', 'dog', 'fish', 'green', 'happy', 'jump'],
    '-uck': ['apple', 'book', 'cake', 'dog', 'fish', 'green', 'happy', 'jump'],
  };

  const distractors = distractorPools[wordFamily] || ['apple', 'book', 'cat', 'dog', 'fish', 'green'];

  // Word Family Match
  const wordFamilyMatch = {
    wordFamily,
    correctWords: words.slice(0, 4),
    distractorWords: distractors.slice(0, 4),
  };

  // Sentence Builder - use sentences from the story or scenes
  let sentenceBuilder;
  if (scenes && scenes.length > 0) {
    // Use dialogue from scenes for sentence builder
    const sentences: string[] = [];
    scenes.forEach(scene => {
      scene.dialogue.forEach(line => {
        if (line.speaker !== 'narrator' && sentences.length < 2) {
          sentences.push(line.text);
        }
      });
    });
    sentenceBuilder = sentences.map(text => ({
      originalSentence: text,
      words: text.replace(/[.,!?'"]/g, '').split(' ').filter(w => w.length > 0),
    }));
  } else {
    sentenceBuilder = story.slice(0, 2).map(page => ({
      originalSentence: page.text,
      words: page.text.replace(/[.,!?]/g, '').split(' ').filter(w => w.length > 0),
    }));
  }

  // Choose Right Word - context clues
  const chooseRightWord = generateChooseRightWord(mysteryId, words);

  // Story Sequencing - use scenes if available
  let storySequencing;
  if (scenes && scenes.length > 0) {
    storySequencing = {
      events: generateStorySequencingEvents(mysteryId, scenes),
    };
  } else {
    storySequencing = {
      events: story.map((page, index) => ({
        id: page.id,
        text: page.text,
        correctOrder: index + 1,
      })),
    };
  }

  // Comprehension Quiz
  const comprehensionQuiz = generateComprehensionQuiz(mysteryId, words);

  // Word Sort
  const wordSort = {
    wordFamily,
    familyWords: words.slice(0, 5),
    nonFamilyWords: distractors.slice(0, 5),
  };

  return {
    wordFamilyMatch,
    sentenceBuilder,
    chooseRightWord,
    storySequencing,
    comprehensionQuiz,
    wordSort,
  };
}

// Generate story sequencing events from scenes
function generateStorySequencingEvents(mysteryId: string, scenes: StoryScene[]): { id: number; text: string; correctOrder: number }[] {
  const customEvents: Record<string, { id: number; text: string; correctOrder: number }[]> = {
    'missing-cake': [
      { id: 1, text: 'Jake the Snake discovers his cake recipe is missing.', correctOrder: 1 },
      { id: 2, text: 'Jake remembers he put the recipe by the lake.', correctOrder: 2 },
      { id: 3, text: 'Pancake the Cat says she saw the recipe fall.', correctOrder: 3 },
      { id: 4, text: 'The detective finds the recipe under the doormat.', correctOrder: 4 },
      { id: 5, text: 'Jake is happy and can now bake his cake!', correctOrder: 5 },
    ],
    'lost-hat': [
      { id: 1, text: 'Bella Bunny sat on her mat with Matt the Cat.', correctOrder: 1 },
      { id: 2, text: 'Batty the Bat flew by and took Bella\'s hat!', correctOrder: 2 },
      { id: 3, text: 'Matt the Cat ran after the bat.', correctOrder: 3 },
      { id: 4, text: 'The detective found the hat on a flat rock.', correctOrder: 4 },
      { id: 5, text: 'Everyone became friends and sat together to chat.', correctOrder: 5 },
    ],
    'garden-mystery': [
      { id: 1, text: 'Oliver Owl found a big hole in the garden.', correctOrder: 1 },
      { id: 2, text: 'Oliver heard someone doing a jig nearby.', correctOrder: 2 },
      { id: 3, text: 'Piggy the Pig was digging to find her fig.', correctOrder: 3 },
      { id: 4, text: 'The detective helped Piggy find the fig.', correctOrder: 4 },
      { id: 5, text: 'Piggy did a happy jig and promised to ask before digging.', correctOrder: 5 },
    ],
    'sleepy-town': [
      { id: 1, text: 'The whole town fell into a deep sleep.', correctOrder: 1 },
      { id: 2, text: 'Even the sheep were counting sheep!', correctOrder: 2 },
      { id: 3, text: 'Misty Cat heard a little peep from a bird.', correctOrder: 3 },
      { id: 4, text: 'The detective found an alarm clock to make a beep.', correctOrder: 4 },
      { id: 5, text: 'The loud beep woke everyone up!', correctOrder: 5 },
    ],
  };

  if (customEvents[mysteryId]) {
    return customEvents[mysteryId];
  }

  return scenes.slice(0, 4).map((scene, index) => ({
    id: scene.id,
    text: scene.dialogue[0]?.text || `Scene ${scene.id}`,
    correctOrder: index + 1,
  }));
}

function generateChooseRightWord(mysteryId: string, words: string[]): { sentence: string; blank: string; correctAnswer: string; options: string[] }[] {
  const templates: Record<string, { sentence: string; blank: string; correctAnswer: string; options: string[] }[]> = {
    'missing-cake': [
      { sentence: 'Jake the Snake needed to _____ a cake for the town party.', blank: 'bake', correctAnswer: 'bake', options: ['bake', 'run', 'sleep'] },
      { sentence: 'The special _____ was missing from the bakery!', blank: 'recipe', correctAnswer: 'recipe', options: ['recipe', 'book', 'chair'] },
      { sentence: 'Jake put the recipe by the _____ that morning.', blank: 'lake', correctAnswer: 'lake', options: ['lake', 'tree', 'house'] },
      { sentence: 'Pancake the Cat saw the paper _____ to the floor.', blank: 'fall', correctAnswer: 'fall', options: ['fall', 'jump', 'fly'] },
      { sentence: 'The recipe slipped under the mat by _____.', blank: 'mistake', correctAnswer: 'mistake', options: ['mistake', 'magic', 'purpose'] },
    ],
    'lost-hat': [
      { sentence: 'Bella\'s _____ flew away in the wind.', blank: 'hat', correctAnswer: 'hat', options: ['hat', 'ball', 'kite'] },
      { sentence: 'The _____ ran after the bat.', blank: 'cat', correctAnswer: 'cat', options: ['cat', 'dog', 'bird'] },
      { sentence: 'Bella _____ on her soft mat.', blank: 'sat', correctAnswer: 'sat', options: ['sat', 'ran', 'jumped'] },
      { sentence: 'The hat was on a _____ rock by the stream.', blank: 'flat', correctAnswer: 'flat', options: ['flat', 'big', 'round'] },
      { sentence: 'Batty the _____ wanted to play with the hat.', blank: 'bat', correctAnswer: 'bat', options: ['bat', 'cat', 'rat'] },
    ],
    'garden-mystery': [
      { sentence: 'Piggy liked to _____ in the dirt.', blank: 'dig', correctAnswer: 'dig', options: ['dig', 'fly', 'swim'] },
      { sentence: 'The hole was very _____.', blank: 'big', correctAnswer: 'big', options: ['big', 'small', 'red'] },
      { sentence: 'A little _____ was dancing nearby.', blank: 'pig', correctAnswer: 'pig', options: ['pig', 'cow', 'horse'] },
      { sentence: 'Piggy was looking for a _____ to eat.', blank: 'fig', correctAnswer: 'fig', options: ['fig', 'carrot', 'apple'] },
      { sentence: 'Piggy did a happy _____ when she found it!', blank: 'jig', correctAnswer: 'jig', options: ['jig', 'run', 'jump'] },
    ],
    'sleepy-town': [
      { sentence: 'Everyone fell into a deep _____.', blank: 'sleep', correctAnswer: 'sleep', options: ['sleep', 'walk', 'talk'] },
      { sentence: 'The _____ were counting themselves!', blank: 'sheep', correctAnswer: 'sheep', options: ['sheep', 'cows', 'birds'] },
      { sentence: 'A loud _____ woke everyone up.', blank: 'beep', correctAnswer: 'beep', options: ['beep', 'bark', 'meow'] },
      { sentence: 'Misty heard a little _____ from a bird.', blank: 'peep', correctAnswer: 'peep', options: ['peep', 'chirp', 'song'] },
      { sentence: 'The town was in a _____ sleep.', blank: 'deep', correctAnswer: 'deep', options: ['deep', 'light', 'short'] },
    ],
    'rainy-day': [
      { sentence: 'The _____ fell from the sky.', blank: 'rain', correctAnswer: 'rain', options: ['rain', 'snow', 'sun'] },
      { sentence: 'Benny used his _____ to think.', blank: 'brain', correctAnswer: 'brain', options: ['brain', 'hand', 'foot'] },
      { sentence: 'He heard a _____ in the distance.', blank: 'train', correctAnswer: 'train', options: ['train', 'plane', 'boat'] },
    ],
    'sunny-park': [
      { sentence: 'The _____ was shining bright.', blank: 'sun', correctAnswer: 'sun', options: ['sun', 'moon', 'star'] },
      { sentence: 'Everyone was having _____.', blank: 'fun', correctAnswer: 'fun', options: ['fun', 'sad', 'mad'] },
      { sentence: 'They loved to _____ around.', blank: 'run', correctAnswer: 'run', options: ['run', 'sit', 'sleep'] },
    ],
    'bell-tower': [
      { sentence: 'The _____ would not ring.', blank: 'bell', correctAnswer: 'bell', options: ['bell', 'drum', 'horn'] },
      { sentence: 'Mabel could _____ something was wrong.', blank: 'tell', correctAnswer: 'tell', options: ['tell', 'see', 'hear'] },

      { sentence: 'A magic _____ fixed everything!', blank: 'spell', correctAnswer: 'spell', options: ['spell', 'trick', 'wish'] },
    ],
    'hop-shop': [
      { sentence: 'Bella went to the _____.', blank: 'shop', correctAnswer: 'shop', options: ['shop', 'park', 'school'] },
      { sentence: 'She had to _____ over the mop.', blank: 'hop', correctAnswer: 'hop', options: ['hop', 'run', 'walk'] },
      { sentence: 'The balloon went _____!', blank: 'pop', correctAnswer: 'pop', options: ['pop', 'bang', 'boom'] },
    ],
    'night-light': [
      { sentence: 'It was a dark _____.', blank: 'night', correctAnswer: 'night', options: ['night', 'day', 'morning'] },
      { sentence: 'Oliver needed to find the _____.', blank: 'light', correctAnswer: 'light', options: ['light', 'dark', 'shadow'] },
      { sentence: 'The star was very _____.', blank: 'bright', correctAnswer: 'bright', options: ['bright', 'dim', 'dull'] },
    ],
    'snowy-day': [
      { sentence: 'The _____ began to fall.', blank: 'snow', correctAnswer: 'snow', options: ['snow', 'rain', 'leaves'] },
      { sentence: 'The wind started to _____.', blank: 'blow', correctAnswer: 'blow', options: ['blow', 'stop', 'sing'] },
      { sentence: 'The snowflakes seemed to _____.', blank: 'glow', correctAnswer: 'glow', options: ['glow', 'melt', 'fall'] },
    ],
    'king-ring': [
      { sentence: 'The _____ lost something special.', blank: 'king', correctAnswer: 'king', options: ['king', 'queen', 'prince'] },
      { sentence: 'A bird with a _____ flew by.', blank: 'wing', correctAnswer: 'wing', options: ['wing', 'beak', 'feather'] },
      { sentence: 'The bird began to _____ a song.', blank: 'sing', correctAnswer: 'sing', options: ['sing', 'talk', 'shout'] },
    ],
    'duck-luck': [
      { sentence: 'The little _____ was stuck.', blank: 'duck', correctAnswer: 'duck', options: ['duck', 'bird', 'fish'] },
      { sentence: 'A big _____ came to help.', blank: 'truck', correctAnswer: 'truck', options: ['truck', 'car', 'bus'] },
      { sentence: 'With a little _____, they saved the day!', blank: 'luck', correctAnswer: 'luck', options: ['luck', 'help', 'push'] },
    ],
  };

  return templates[mysteryId] || [
    { sentence: `Find a word from the ${words[0]} family.`, blank: words[0], correctAnswer: words[0], options: [words[0], 'apple', 'book'] },
  ];
}

function generateComprehensionQuiz(mysteryId: string, words: string[]): { question: string; correctAnswer: string; options: string[] }[] {
  const quizzes: Record<string, { question: string; correctAnswer: string; options: string[] }[]> = {
    'missing-cake': [
      { question: 'What was Jake the Snake trying to bake?', correctAnswer: 'A cake for the town party', options: ['A cake for the town party', 'Cookies for his friends', 'Bread for the bakery'] },
      { question: 'Where did Jake put the recipe that morning?', correctAnswer: 'By the lake', options: ['By the lake', 'On the table', 'In the oven'] },
      { question: 'Who saw the recipe fall?', correctAnswer: 'Pancake the Cat', options: ['Pancake the Cat', 'Mabel the Mouse', 'Oliver the Owl'] },
      { question: 'Where was the recipe hiding?', correctAnswer: 'Under the doormat', options: ['Under the doormat', 'In the basket', 'By the window'] },
      { question: 'How did Jake feel when the recipe was found?', correctAnswer: 'Very happy', options: ['Very happy', 'Still worried', 'Sleepy'] },
    ],
    'lost-hat': [
      { question: 'Who was sitting on the mat at the beginning?', correctAnswer: 'Bella Bunny and Matt the Cat', options: ['Bella Bunny and Matt the Cat', 'Batty the Bat', 'Ted the Turtle'] },
      { question: 'Who took Bella\'s hat?', correctAnswer: 'Batty the Bat', options: ['Batty the Bat', 'Matt the Cat', 'The wind'] },
      { question: 'Who ran after the bat?', correctAnswer: 'Matt the Cat', options: ['Matt the Cat', 'Bella Bunny', 'The detective'] },
      { question: 'Where was the hat found?', correctAnswer: 'On a flat rock', options: ['On a flat rock', 'In a tree', 'In the water'] },
      { question: 'What happened at the end of the story?', correctAnswer: 'Everyone became friends', options: ['Everyone became friends', 'Batty flew away', 'Bella was sad'] },
    ],
    'garden-mystery': [
      { question: 'Who found a big hole in the garden?', correctAnswer: 'Oliver Owl', options: ['Oliver Owl', 'Bella Bunny', 'Mabel Mouse'] },
      { question: 'Who dug the big hole?', correctAnswer: 'Piggy the Pig', options: ['Piggy the Pig', 'A dog', 'A rabbit'] },
      { question: 'What was Piggy looking for?', correctAnswer: 'A fig', options: ['A fig', 'A carrot', 'A bone'] },
      { question: 'What was Piggy doing when Oliver found her?', correctAnswer: 'Doing a jig', options: ['Doing a jig', 'Sleeping', 'Eating'] },
      { question: 'What did Piggy promise at the end?', correctAnswer: 'To ask before digging', options: ['To ask before digging', 'To never dig again', 'To leave the garden'] },
    ],
    'sleepy-town': [
      { question: 'What happened to the whole town?', correctAnswer: 'Everyone fell asleep', options: ['Everyone fell asleep', 'It rained', 'There was a party'] },
      { question: 'What were the sheep doing?', correctAnswer: 'Counting sheep', options: ['Counting sheep', 'Running around', 'Eating grass'] },
      { question: 'What sound did Misty hear from a bird?', correctAnswer: 'A peep', options: ['A peep', 'A song', 'A bark'] },
      { question: 'What made the loud beep that woke everyone?', correctAnswer: 'An alarm clock', options: ['An alarm clock', 'A car', 'A phone'] },
      { question: 'Who helped solve the mystery?', correctAnswer: 'Misty Cat and the detective', options: ['Misty Cat and the detective', 'The sheep', 'Ted the Turtle'] },
    ],
    'rainy-day': [
      { question: 'What was the weather like?', correctAnswer: 'Rainy', options: ['Rainy', 'Sunny', 'Snowy'] },
      { question: 'What did Benny hear?', correctAnswer: 'A train', options: ['A train', 'A plane', 'A car'] },
      { question: 'Where did the water go?', correctAnswer: 'Down the drain', options: ['Down the drain', 'Into the lake', 'Up the hill'] },
    ],
    'sunny-park': [
      { question: 'What was in the sky?', correctAnswer: 'The sun', options: ['The sun', 'The moon', 'Clouds'] },
      { question: 'What did they have at the park?', correctAnswer: 'Fun', options: ['Fun', 'A nap', 'Homework'] },
      { question: 'What was dropped from the picnic?', correctAnswer: 'A bun', options: ['A bun', 'A ball', 'A hat'] },
    ],
    'bell-tower': [
      { question: 'What stopped working?', correctAnswer: 'The bell', options: ['The bell', 'The clock', 'The door'] },
      { question: 'Where did Mabel look for clues?', correctAnswer: 'Down the well', options: ['Down the well', 'In the tower', 'Under a rock'] },
      { question: 'What fixed the bell?', correctAnswer: 'A magic spell', options: ['A magic spell', 'A hammer', 'A wish'] },
    ],
    'hop-shop': [

      { question: 'Where did Bella go?', correctAnswer: 'To the shop', options: ['To the shop', 'To school', 'To the park'] },
      { question: 'What did Bella hop over?', correctAnswer: 'A mop', options: ['A mop', 'A box', 'A cat'] },
      { question: 'What sound did the balloon make?', correctAnswer: 'Pop', options: ['Pop', 'Bang', 'Whoosh'] },
    ],
    'night-light': [
      { question: 'What time of day was it?', correctAnswer: 'Night', options: ['Night', 'Morning', 'Afternoon'] },
      { question: 'What was Oliver looking for?', correctAnswer: 'The light', options: ['The light', 'His friend', 'Food'] },
      { question: 'What lit up everything?', correctAnswer: 'A star', options: ['A star', 'The moon', 'A lamp'] },
    ],
    'snowy-day': [
      { question: 'What was falling?', correctAnswer: 'Snow', options: ['Snow', 'Rain', 'Leaves'] },
      { question: 'What did the wind do?', correctAnswer: 'Blow', options: ['Blow', 'Stop', 'Whisper'] },
      { question: 'What did the snowflakes do?', correctAnswer: 'Glow', options: ['Glow', 'Melt', 'Disappear'] },
    ],
    'king-ring': [
      { question: 'What did the king lose?', correctAnswer: 'His ring', options: ['His ring', 'His crown', 'His sword'] },
      { question: 'Who flew by?', correctAnswer: 'A bird', options: ['A bird', 'A butterfly', 'A bee'] },
      { question: 'What did the bird want to do?', correctAnswer: 'Bring back the ring', options: ['Bring back the ring', 'Sing a song', 'Fly away'] },
    ],
    'duck-luck': [
      { question: 'What happened to the duck?', correctAnswer: 'It got stuck', options: ['It got stuck', 'It flew away', 'It went swimming'] },
      { question: 'What came to help?', correctAnswer: 'A truck', options: ['A truck', 'A car', 'A boat'] },
      { question: 'What did they need to save the duck?', correctAnswer: 'Luck', options: ['Luck', 'Magic', 'A rope'] },
    ],
  };

  return quizzes[mysteryId] || [
    { question: 'Did you enjoy the story?', correctAnswer: 'Yes!', options: ['Yes!', 'It was okay', 'Not sure'] },
  ];
}

// Pre-generated game data for all mysteries
export const mysteryGamesData: Record<string, MysteryGameData> = {};

// This will be populated when mysteries are loaded
export function initializeGamesData(mysteries: { id: string; wordFamily: string; words: string[]; story: { id: number; text: string; clue?: string }[] }[]) {
  mysteries.forEach(mystery => {
    mysteryGamesData[mystery.id] = generateGameData(
      mystery.id,
      mystery.wordFamily,
      mystery.words,
      mystery.story
    );
  });
}
