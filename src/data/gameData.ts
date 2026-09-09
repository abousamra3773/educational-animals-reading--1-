import { Character, Mystery, Badge } from '../types';

export const characters: Character[] = [
  {
    id: 'mabel',
    name: 'Mabel Mouse',
    animal: 'Mouse',
    specialty: 'Finding rhyming words',
    personality: 'Quick and clever, Mabel loves to sniff out clues hidden in rhymes!',
    image: '/characters/pip_mouse_detective.png',
    fullBodyImage: '/characters/pip_mouse_detective.png',
    color: 'bg-rose-100'
  },

  {
    id: 'bella',
    name: 'Bella Bunny',
    animal: 'Bunny',
    specialty: 'Spotting word patterns',
    personality: 'Sweet and observant, Bella hops to conclusions with her sharp eyes!',
    image: '/characters/bella_bunny_detective.png',
    fullBodyImage: '/characters/bella_bunny_detective.png',
    color: 'bg-purple-100'
  },
  {
    id: 'oliver',
    name: 'Oliver Owl',
    animal: 'Owl',
    specialty: 'Reading tricky words',
    personality: 'Wise and patient, Oliver helps everyone understand difficult clues!',
    image: '/characters/ollie_owl_detective.png',
    fullBodyImage: '/characters/ollie_owl_detective.png',
    color: 'bg-blue-100'
  },
  {
    id: 'misty',
    name: 'Misty Cat',
    animal: 'Cat',
    specialty: 'Solving puzzles',
    personality: 'Playful and smart, Misty pounces on puzzles with joy!',
    image: '/characters/misty_cat_detective.png',
    fullBodyImage: '/characters/misty_cat_detective.png',
    color: 'bg-gray-100'
  },
  {
    id: 'benny',
    name: 'Benny Bear',
    animal: 'Bear',
    specialty: 'Remembering clues',
    personality: 'Gentle and strong, Benny never forgets an important detail!',
    image: '/characters/benny_bear_detective.png',
    fullBodyImage: '/characters/benny_bear_detective.png',
    color: 'bg-amber-100'
  },
  {
    id: 'felix2',
    name: 'Finn Fox',
    animal: 'Fox',
    specialty: 'Word building',
    personality: 'Energetic and friendly, Finn builds words like building blocks!',
    image: '/characters/felix_fox_detective.png',
    fullBodyImage: '/characters/felix_fox_detective.png',
    color: 'bg-orange-50'
  },
  {
    id: 'sam',
    name: 'Sam the Squirrel',
    animal: 'Squirrel',
    specialty: 'Finding hidden letters',
    personality: 'Quick and busy, Sam loves to stash letters and find them again!',
    image: '/characters/sam_squirrel_detective.png',
    fullBodyImage: '/characters/sam_squirrel_detective.png',
    color: 'bg-green-100'
  },
  {
    id: 'pancake',
    name: 'Pancake the Cat',
    animal: 'Cat',
    specialty: 'Sounding out words',
    personality: 'Cozy and curious, Pancake pounces on sounds to build words!',
    image: '/characters/pancake_cat_detective.png',
    fullBodyImage: '/characters/pancake_cat_detective.png',
    color: 'bg-orange-100'
  },
  {
    id: 'leo',
    name: 'Leo the Labradoodle',
    animal: 'Dog',
    specialty: 'Tracking word clues',
    personality: 'Loyal and playful, Leo sniffs out clues with a wag and a woof!',
    image: '/characters/leo_labradoodle_detective.png',
    fullBodyImage: '/characters/leo_labradoodle_detective.png',
    color: 'bg-sky-100'
  }
];


export const mysteries: Mystery[] = [
  {
    id: 'missing-cake',
    title: 'The Case of the Missing Cake Recipe',
    tagline: 'Help Jake the Snake find his missing cake recipe!',
    description: 'Jake the Snake needs to bake a cake for the town party, but his special recipe is missing! Help solve the mystery.',
    detective: characters[7],
    wordFamily: '-ake',
    difficulty: 'easy',
    stars: 0,
    completed: false,
    words: ['cake', 'bake', 'lake', 'make', 'take', 'wake', 'Jake', 'rake', 'shake', 'flake'],
    story: [
      { id: 1, text: 'Jake the Snake needs to bake a cake for the town party.', clue: 'Find words that end in -ake!' },
      { id: 2, text: 'But Jake cannot find his special recipe!', clue: 'Oh no! The recipe is missing!' },
      { id: 3, text: 'Pancake the Cat saw it fall by the lake.', clue: 'Where did the recipe go?' },
      { id: 4, text: 'The recipe slipped under the mat by mistake!', clue: 'You found it!' },
      { id: 5, text: 'Now Jake can bake his cake for the party!', clue: 'Hooray! Mystery solved!' },
      { id: 6, text: 'Great job, Detective! You helped Jake the Snake!', clue: 'Time to practice your -AKE words!' }
    ],
    scenes: [
      {
        id: 1,
        title: 'Scene 1',
        image: '/stories/ake/scene1-bakery.jpg',
        dialogue: [
          { speaker: 'narrator', text: "Flutter! It's me, Willa the Wandering Warbler! I just flew into Jake's Bakery in Tangle Tail Town and something is wrong!" },
          { speaker: 'Jake the Snake', text: 'Oh no! My recipe is blank! It just says RECIPE and nothing else!', emotion: 'worried' }
        ]
      },
      {
        id: 2,
        title: 'Scene 2',
        image: '/stories/ake/scene2-lake-memory.jpg',
        dialogue: [
          { speaker: 'Jake the Snake', text: 'I put it by the lake this morning. Did I take it back?', emotion: 'thinking' },
          { speaker: 'narrator', text: 'Jake tries to remember where he left the recipe.' },
          { speaker: 'detective', text: "Let's ask Pancake!", emotion: 'excited' }
        ]
      },
      {
        id: 3,
        title: 'Scene 3',
        image: '/stories/ake/scene3-pancake-clue.jpg',
        dialogue: [
          { speaker: 'Pancake the Cat', text: 'I saw it fall! Jake tried to make the batter and it slipped away.', emotion: 'surprised' },
          { speaker: 'narrator', text: 'Pancake points toward the door with her paw.' },
          { speaker: 'detective', text: 'Follow the clue!', emotion: 'excited' }
        ]
      },
      {
        id: 4,
        title: 'Scene 4',
        image: '/stories/ake/scene4-find-recipe.jpg',
        headerText: 'Can you find the missing recipe? Click on the recipe to help Jake the Snake.',
        dialogue: [
          { speaker: 'detective', text: 'There it is! The recipe slipped under the mat by mistake.', emotion: 'happy' },
          { speaker: 'narrator', text: 'The detective hands the recipe back to Jake.' }
        ],
        isInteractive: true,
        interactiveTarget: {
          description: 'Recipe paper under the doormat',
          hint: 'Look near the door!',
          position: { x: 30, y: 78, width: 28, height: 20 }
        }
      },
      {
        id: 5,
        title: 'Scene 5',
        image: '/stories/ake/scene5-recipe-found.jpg',
        dialogue: [
          { speaker: 'Jake the Snake', text: 'You found it! Now I can bake my cake!', emotion: 'happy' },
          { speaker: 'narrator', text: 'Jake is so happy! He will make the best cake for the town party.' },
          { speaker: 'Pancake the Cat', text: 'Hooray!', emotion: 'happy' }
        ]
      },
      {
        id: 6,
        title: 'Scene 6',
        image: '/stories/ake/scene6-well-done.jpg',
        dialogue: [
          { speaker: 'Pancake the Cat', text: 'Great job, Detective!', emotion: 'happy' },
          { speaker: 'narrator', text: 'You helped Jake find his recipe! Time to practice your -AKE words: cake, bake, lake, make, take, wake, Jake, rake, shake, flake.' }
        ]
      }
    ],
    locationId: 'bakery'
  },

  {
    id: 'lost-hat',
    title: 'The Case of the Lost Hat',
    tagline: 'Help Bella Bunny find her favorite hat!',
    description: 'Bella\'s favorite hat flew away! Find words that end in "-at" to help.',
    detective: characters[1],
    wordFamily: '-at',
    difficulty: 'easy',
    stars: 0,
    completed: false,
    words: ['hat', 'cat', 'bat', 'mat', 'sat', 'rat', 'flat', 'that', 'chat', 'pat'],
    story: [
      { id: 1, text: 'Bella sat on her mat with her cat.', clue: 'Where was Bella sitting?' },
      { id: 2, text: 'A bat flew by and took her hat!', clue: 'What took the hat?' },
      { id: 3, text: 'The cat ran after the bat.', clue: 'Who chased the bat?' },
      { id: 4, text: 'They found the hat on a flat rock!', clue: 'Hooray! The hat is found!' }
    ],
    scenes: [
      {
        id: 1,
        title: 'Scene 1',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475418369_afad8291.jpg',
        dialogue: [
          { speaker: 'narrator', text: 'It was a sunny day at Cozy Cottage Lane.' },
          { speaker: 'Bella Bunny', text: 'What a nice day! I love to sit on my mat with my friend Matt the Cat.', emotion: 'happy' },
          { speaker: 'Matt the Cat', text: 'This is so nice! I could sit here and chat all day.', emotion: 'happy' }
        ]
      },
      {
        id: 2,
        title: 'Scene 2',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475436735_2cdf62cf.png',
        dialogue: [
          { speaker: 'narrator', text: 'Suddenly, a gust of wind blew through the garden!' },
          { speaker: 'Batty the Bat', text: 'Wheee! Look at this pretty hat! I will take it!', emotion: 'excited' },
          { speaker: 'Bella Bunny', text: 'Oh no! That bat took my hat!', emotion: 'worried' },
          { speaker: 'detective', text: 'We need to get it back!', emotion: 'excited' }
        ]
      },
      {
        id: 3,
        title: 'Scene 3',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475456578_6af2536b.png',
        dialogue: [
          { speaker: 'Matt the Cat', text: 'I will run after that bat! Wait for me!', emotion: 'excited' },
          { speaker: 'narrator', text: 'Matt the Cat ran as fast as he could through the meadow.' },
          { speaker: 'detective', text: 'Go, Matt! You can catch that bat!', emotion: 'excited' }
        ]
      },
      {
        id: 4,
        title: 'Scene 4',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475470464_71e39224.jpg',
        headerText: 'Can you find the hat? Click on it to help Bella!',
        dialogue: [
          { speaker: 'Matt the Cat', text: 'Look! The hat is on that flat rock!', emotion: 'happy' },
          { speaker: 'detective', text: 'I see it! The hat sat on the flat rock by the stream.', emotion: 'happy' },
          { speaker: 'narrator', text: 'The detective picks up the hat carefully.' }
        ],
        isInteractive: true,
        interactiveTarget: {
          description: 'Pink hat on the flat rock',
          hint: 'Look on the flat rock!',
          position: { x: 40, y: 60, width: 20, height: 15 }
        }
      },
      {
        id: 5,
        title: 'Scene 5',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475497393_174846b6.png',
        dialogue: [
          { speaker: 'Bella Bunny', text: 'My hat! You found it! Thank you so much!', emotion: 'happy' },
          { speaker: 'Batty the Bat', text: 'I am sorry I took your hat. I just wanted to play!', emotion: 'sad' },
          { speaker: 'Bella Bunny', text: 'That is okay, Batty! Do you want to sit and chat with us?', emotion: 'happy' },
          { speaker: 'Matt the Cat', text: 'Yes! Let us all be friends!', emotion: 'happy' }
        ]
      },
      {
        id: 6,
        title: 'Scene 6',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475497393_174846b6.png',
        dialogue: [
          { speaker: 'narrator', text: 'Everyone sat together on the mat and had a wonderful time.' },
          { speaker: 'Bella Bunny', text: 'Great job, Detective! You helped us find my hat!', emotion: 'happy' },
          { speaker: 'narrator', text: 'Time to practice your -AT words!' }
        ]
      }
    ],
    locationId: 'cottage'
  },

  {
    id: 'garden-mystery',
    title: 'The Case of the Garden Digger',
    tagline: 'Help Oliver Owl solve the mystery of the big hole!',
    description: 'Who dug holes in the garden? Find words that end in "-ig" to discover the truth.',
    detective: characters[2],
    wordFamily: '-ig',
    difficulty: 'easy',
    stars: 0,
    completed: false,
    words: ['dig', 'big', 'pig', 'wig', 'fig', 'jig', 'twig', 'gig'],
    story: [
      { id: 1, text: 'Oliver saw a big hole in the garden.', clue: 'How big was the hole?' },
      { id: 2, text: 'Did someone dig it up?', clue: 'What happened to make the hole?' },
      { id: 3, text: 'A little pig was doing a jig nearby!', clue: 'Who was dancing?' },
      { id: 4, text: 'The pig was looking for a fig to eat!', clue: 'Mystery solved!' }
    ],
    scenes: [
      {
        id: 1,
        title: 'Scene 1',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475759130_3818c8c4.png',
        dialogue: [
          { speaker: 'narrator', text: 'It was a lovely morning at Sunny Meadow Garden.' },
          { speaker: 'Oliver Owl', text: 'Oh my! What is this? There is a big hole in the garden!', emotion: 'surprised' },
          { speaker: 'detective', text: 'Who could have made such a big hole?', emotion: 'thinking' }
        ]
      },
      {
        id: 2,
        title: 'Scene 2',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475777261_7c22f0b8.png',
        dialogue: [
          { speaker: 'narrator', text: 'Oliver Owl heard a sound coming from behind the flowers.' },
          { speaker: 'Oliver Owl', text: 'What is that noise? Someone is doing a jig!', emotion: 'surprised' },
          { speaker: 'detective', text: 'Let us go see who it is!', emotion: 'excited' }
        ]
      },
      {
        id: 3,
        title: 'Scene 3',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475799049_305da243.png',
        dialogue: [
          { speaker: 'Piggy the Pig', text: 'Dig, dig, dig! I love to dig! Where is my fig?', emotion: 'happy' },
          { speaker: 'Oliver Owl', text: 'Piggy! Did you dig this big hole?', emotion: 'surprised' },
          { speaker: 'Piggy the Pig', text: 'Yes! I am looking for a fig. I buried it here!', emotion: 'excited' }
        ]
      },
      {
        id: 4,
        title: 'Scene 4',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475799049_305da243.png',
        headerText: 'Can you help Piggy find the fig? Click on it!',
        dialogue: [
          { speaker: 'detective', text: 'I see something! Is that the fig by the twig?', emotion: 'excited' },
          { speaker: 'Piggy the Pig', text: 'Yes! That is my fig! You found it!', emotion: 'happy' },
          { speaker: 'narrator', text: 'The detective helps Piggy find the buried fig.' }
        ],
        isInteractive: true,
        interactiveTarget: {
          description: 'Fig fruit near the twig',
          hint: 'Look near the twig!',
          position: { x: 60, y: 70, width: 15, height: 12 }
        }
      },
      {
        id: 5,
        title: 'Scene 5',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475817441_18ed95a9.png',
        dialogue: [
          { speaker: 'Piggy the Pig', text: 'Thank you! Now I can eat my big, yummy fig!', emotion: 'happy' },
          { speaker: 'Oliver Owl', text: 'Piggy, next time please ask before you dig in the garden!', emotion: 'happy' },
          { speaker: 'Piggy the Pig', text: 'I will! I am sorry for the big mess.', emotion: 'sad' }
        ]
      },
      {
        id: 6,
        title: 'Scene 6',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475817441_18ed95a9.png',
        dialogue: [
          { speaker: 'narrator', text: 'Piggy did a happy jig and everyone laughed together.' },
          { speaker: 'Oliver Owl', text: 'Great job, Detective! You solved the mystery of the big hole!', emotion: 'happy' },
          { speaker: 'narrator', text: 'Time to practice your -IG words!' }
        ]
      }
    ],
    locationId: 'garden'
  },

  {
    id: 'sleepy-town',
    title: 'The Case of Sleepy Town',
    tagline: 'Help Misty Cat wake up the sleepy town!',
    description: 'Everyone is yawning! Find words that end in "-eep" to wake them up.',
    detective: characters[3],
    wordFamily: '-eep',
    difficulty: 'medium',
    stars: 0,
    completed: false,
    words: ['sleep', 'deep', 'keep', 'peep', 'sheep', 'beep', 'creep', 'steep'],
    story: [
      { id: 1, text: 'The whole town fell into a deep sleep.', clue: 'How did everyone sleep?' },
      { id: 2, text: 'Even the sheep were counting sheep!', clue: 'Who else was sleeping?' },
      { id: 3, text: 'Misty heard a little peep from a bird.', clue: 'What sound did the bird make?' },
      { id: 4, text: 'A loud beep woke everyone up!', clue: 'What sound saved the day?' }
    ],
    scenes: [
      {
        id: 1,
        title: 'Scene 1',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475838401_96ec55bd.jpg',
        dialogue: [
          { speaker: 'narrator', text: 'Something strange was happening in Tangle Town.' },
          { speaker: 'Misty Cat', text: 'Why is everyone asleep? The whole town fell into a deep sleep!', emotion: 'worried' },
          { speaker: 'detective', text: 'This is very strange. We need to find out why!', emotion: 'thinking' }
        ]
      },
      {
        id: 2,
        title: 'Scene 2',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475857844_e502ac27.jpg',
        dialogue: [
          { speaker: 'narrator', text: 'Even the sheep were fast asleep in the meadow.' },
          { speaker: 'Sheepy the Sheep', text: 'Zzzzz... one sheep... two sheep... three sheep...', emotion: 'happy' },
          { speaker: 'Misty Cat', text: 'The sheep are counting sheep! That must be why everyone is asleep!', emotion: 'surprised' }
        ]
      },
      {
        id: 3,
        title: 'Scene 3',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475876081_963cf93c.png',
        dialogue: [
          { speaker: 'narrator', text: 'Misty Cat heard a tiny sound.' },
          { speaker: 'Misty Cat', text: 'What was that? I heard a little peep!', emotion: 'surprised' },
          { speaker: 'detective', text: 'It came from that little bird! Maybe it can help us!', emotion: 'excited' }
        ]
      },
      {
        id: 4,
        title: 'Scene 4',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475891093_457dcf54.jpg',
        headerText: 'Can you find something that makes a loud beep? Click on it!',
        dialogue: [
          { speaker: 'detective', text: 'We need something loud to wake everyone up!', emotion: 'thinking' },
          { speaker: 'Misty Cat', text: 'Look! An alarm clock! It can make a loud beep!', emotion: 'excited' },
          { speaker: 'narrator', text: 'The detective presses the alarm button.' }
        ],
        isInteractive: true,
        interactiveTarget: {
          description: 'Alarm clock',
          hint: 'Find the alarm clock!',
          position: { x: 25, y: 20, width: 50, height: 60 }
        }

      },
      {
        id: 5,
        title: 'Scene 5',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475891093_457dcf54.jpg',
        dialogue: [
          { speaker: 'narrator', text: 'BEEP! BEEP! BEEP! The alarm rang loud and clear!' },
          { speaker: 'Sheepy the Sheep', text: 'Oh! I am awake! What a deep sleep that was!', emotion: 'surprised' },
          { speaker: 'Misty Cat', text: 'Everyone is waking up! The beep worked!', emotion: 'happy' }
        ]
      },
      {
        id: 6,
        title: 'Scene 6',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475891093_457dcf54.jpg',
        dialogue: [
          { speaker: 'narrator', text: 'The whole town woke up from their deep sleep.' },
          { speaker: 'Sheepy the Sheep', text: 'I will keep my counting to myself from now on!', emotion: 'happy' },
          { speaker: 'Misty Cat', text: 'Great job, Detective! You saved Sleepy Town!', emotion: 'happy' },
          { speaker: 'narrator', text: 'Time to practice your -EEP words!' }
        ]
      }
    ],
    locationId: 'library'
  },

  {
    id: 'rainy-day',
    title: 'The Rainy Day Clue',
    description: 'Something splashed in the rain! Find words that end in "-ain" to investigate.',
    detective: characters[4],
    wordFamily: '-ain',
    difficulty: 'medium',
    stars: 0,
    completed: false,
    words: ['rain', 'train', 'main', 'plain', 'brain', 'drain'],
    story: [
      { id: 1, text: 'The rain fell on the main street.', clue: 'Where did the rain fall?' },
      { id: 2, text: 'Benny used his brain to think.', clue: 'What did Benny use to think?' },
      { id: 3, text: 'He heard a train in the rain!', clue: 'What was making noise?' },
      { id: 4, text: 'Water went down the drain. Mystery solved!', clue: 'Great detective work!' }
    ]
  },
  {
    id: 'sunny-park',
    title: 'The Sunny Park',
    tagline: 'Help Finn Fox find out who left footprints in the park!',
    description: 'Who left footprints in the park? Find words that end in "-un" to find out.',
    detective: characters[5],
    wordFamily: '-un',
    difficulty: 'easy',
    stars: 0,
    completed: false,
    words: ['sun', 'run', 'fun', 'bun', 'pun', 'spun', 'stun', 'begun'],
    story: [
      { id: 1, text: 'The sun was shining bright in the park.', clue: 'What was in the sky?' },
      { id: 2, text: 'Finn Fox found footprints! Someone had fun here.', clue: 'What did they have?' },
      { id: 3, text: 'Bella Bunny loves to run and run around!', clue: 'What did she do?' },
      { id: 4, text: 'Benny Bear dropped a bun from his picnic!', clue: 'What did he drop?' },
      { id: 5, text: 'The mystery has begun! They all had fun in the sun!', clue: 'Case closed!' },
      { id: 6, text: 'Great job, Detective! You solved the Sunny Park mystery!', clue: 'Time to practice your -UN words!' }
    ],
    scenes: [
      {
        id: 1,
        title: 'Scene 1',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773787529427_8e4f8553.png',
        dialogue: [
          { speaker: 'narrator', text: 'It was a beautiful day at Sunny Meadow Park. The sun was shining bright.' },
          { speaker: 'Finn Fox', text: 'What a lovely day! The sun feels so warm. But wait... what are these?', emotion: 'surprised' },
          { speaker: 'detective', text: 'Those look like footprints! Someone was here!', emotion: 'excited' }
        ]
      },
      {
        id: 2,
        title: 'Scene 2',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773787567199_658de9b1.png',
        dialogue: [
          { speaker: 'narrator', text: 'Finn Fox bent down to look at the footprints in the sun.' },
          { speaker: 'Finn Fox', text: 'Someone had a lot of fun here! These footprints go run, run, run all over the park!', emotion: 'thinking' },
          { speaker: 'detective', text: 'Let us follow them and find out who it was!', emotion: 'excited' }
        ]
      },
      {
        id: 3,
        title: 'Scene 3',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773787588629_200caad9.jpg',
        dialogue: [
          { speaker: 'narrator', text: 'They followed the footprints and found Bella Bunny!' },
          { speaker: 'Bella Bunny', text: 'Hi Finn! I love to run in the sun! It is so much fun!', emotion: 'happy' },
          { speaker: 'Finn Fox', text: 'Bella, did you leave all these footprints?', emotion: 'thinking' },
          { speaker: 'Bella Bunny', text: 'Some are mine! But I saw Benny Bear run by too. He had a bun!', emotion: 'surprised' }
        ]
      },
      {
        id: 4,
        title: 'Scene 4',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773787612918_24edcbb5.jpg',
        headerText: 'Can you find the bun that Benny dropped? Click on it!',
        dialogue: [
          { speaker: 'narrator', text: 'They found Benny Bear sitting on a bench with his picnic basket.' },
          { speaker: 'Benny Bear', text: 'Oh no! I was in such a rush to run to my picnic that I dropped a bun!', emotion: 'worried' },
          { speaker: 'detective', text: 'I can see it! Let me help you find your bun!', emotion: 'excited' }
        ],
        isInteractive: true,
        interactiveTarget: {
          description: 'Sticky bun on the ground',
          hint: 'Look near the bench!',
          position: { x: 35, y: 70, width: 20, height: 15 }
        }
      },
      {
        id: 5,
        title: 'Scene 5',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773787640129_b4812a35.png',
        dialogue: [
          { speaker: 'Benny Bear', text: 'You found my bun! Thank you! That was so much fun!', emotion: 'happy' },
          { speaker: 'Finn Fox', text: 'So the mystery has begun and is now done! You both left footprints while having fun in the sun!', emotion: 'happy' },
          { speaker: 'Bella Bunny', text: 'We love to run and play! The park is the best place for fun!', emotion: 'excited' }
        ]
      },
      {
        id: 6,
        title: 'Scene 6',
        image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773787765141_3cc54009.png',
        dialogue: [
          { speaker: 'narrator', text: 'Everyone sat together for a picnic in the sun. They shared buns and had so much fun!' },
          { speaker: 'Benny Bear', text: 'Great job, Detective! You solved the mystery of the Sunny Park!', emotion: 'happy' },
          { speaker: 'Finn Fox', text: 'That was a ton of fun! Now it is time to practice your -UN words!', emotion: 'excited' },
          { speaker: 'narrator', text: 'Time to practice your -UN words!' }
        ]
      }
    ],
    locationId: 'park'
  },

  {
    id: 'bell-tower',
    title: 'The Bell Tower',
    description: 'The bell stopped ringing! Find words that end in "-ell" to fix it.',
    detective: characters[0],
    wordFamily: '-ell',
    difficulty: 'medium',
    stars: 0,
    completed: false,
    words: ['bell', 'tell', 'well', 'sell', 'fell', 'spell'],
    story: [
      { id: 1, text: 'The bell in the tower would not ring.', clue: 'What stopped working?' },
      { id: 2, text: 'Mabel could tell something was wrong.', clue: 'What could Mabel do?' },
      { id: 3, text: 'She looked down the well for clues.', clue: 'Where did she look?' },
      { id: 4, text: 'A magic spell fixed the bell!', clue: 'Ding dong! Success!' }
    ]
  },

  {
    id: 'hop-shop',
    title: 'The Hop Shop',
    description: 'Things are hopping at the shop! Find words that end in "-op" to help.',
    detective: characters[1],
    wordFamily: '-op',
    difficulty: 'easy',
    stars: 0,
    completed: false,
    words: ['hop', 'shop', 'stop', 'top', 'pop', 'mop'],
    story: [
      { id: 1, text: 'Bella went to the shop.', clue: 'Where did Bella go?' },
      { id: 2, text: 'She had to hop over a mop!', clue: 'What did she jump over?' },
      { id: 3, text: 'A balloon went pop at the top!', clue: 'What sound did it make?' },
      { id: 4, text: 'Time to stop and rest!', clue: 'Shopping done!' }
    ]
  },
  {
    id: 'night-light',
    title: 'The Night Light',
    description: 'The lights went out! Find words that end in "-ight" to bring them back.',
    detective: characters[2],
    wordFamily: '-ight',
    difficulty: 'hard',
    stars: 0,
    completed: false,
    words: ['night', 'light', 'right', 'bright', 'sight', 'flight'],
    story: [
      { id: 1, text: 'It was a dark night in the village.', clue: 'What time was it?' },
      { id: 2, text: 'Oliver needed to find the light.', clue: 'What was Oliver looking for?' },
      { id: 3, text: 'He looked right and saw a bright star!', clue: 'What did he see?' },
      { id: 4, text: 'The star took flight and lit up everything!', clue: 'Brilliant work!' }
    ]
  },
  {
    id: 'snowy-day',
    title: 'The Snowy Day',
    description: 'Snow is falling! Find words that end in "-ow" to play in the snow.',
    detective: characters[3],
    wordFamily: '-ow',
    difficulty: 'medium',
    stars: 0,
    completed: false,
    words: ['snow', 'blow', 'grow', 'show', 'glow', 'flow'],
    story: [
      { id: 1, text: 'The snow began to fall.', clue: 'What was falling?' },
      { id: 2, text: 'The wind started to blow.', clue: 'What did the wind do?' },
      { id: 3, text: 'Misty watched the snowflakes glow.', clue: 'What did the snowflakes do?' },
      { id: 4, text: 'Time to show everyone the snow!', clue: 'Snow day fun!' }
    ]
  },
  {
    id: 'king-ring',
    title: 'The King\'s Ring',
    description: 'The king lost his ring! Find words that end in "-ing" to help.',
    detective: characters[4],
    wordFamily: '-ing',
    difficulty: 'hard',
    stars: 0,
    completed: false,
    words: ['king', 'ring', 'sing', 'wing', 'bring', 'swing'],
    story: [
      { id: 1, text: 'The king lost his special ring.', clue: 'What did the king lose?' },
      { id: 2, text: 'A bird with a wing flew by.', clue: 'Who flew past?' },
      { id: 3, text: 'The bird began to sing a song!', clue: 'What did the bird do?' },
      { id: 4, text: 'It wanted to bring back the ring!', clue: 'Royal mystery solved!' }
    ]
  },
  {
    id: 'duck-luck',
    title: 'Lucky Duck',
    description: 'The duck needs luck! Find words that end in "-uck" to help.',
    detective: characters[5],
    wordFamily: '-uck',
    difficulty: 'easy',
    stars: 0,
    completed: false,
    words: ['duck', 'luck', 'truck', 'stuck', 'pluck', 'cluck'],
    story: [
      { id: 1, text: 'A little duck was stuck in the mud.', clue: 'What happened to the duck?' },
      { id: 2, text: 'A big truck came to help!', clue: 'What came to help?' },
      { id: 3, text: 'With a little luck and a pluck...', clue: 'What did they need?' },
      { id: 4, text: 'The duck was free! Cluck cluck!', clue: 'Happy ending!' }
    ]
  }
];

export const badges: Badge[] = [
  {
    id: 'first-mystery',
    name: 'First Case Solved',
    description: 'Solved your very first mystery!',
    icon: '🔍',
    earned: false
  },
  {
    id: 'word-wizard',
    name: 'Word Wizard',
    description: 'Mastered 3 word families!',
    icon: '✨',
    earned: false
  },
  {
    id: 'super-sleuth',
    name: 'Super Sleuth',
    description: 'Solved 5 mysteries!',
    icon: '🌟',
    earned: false
  },
  {
    id: 'star-collector',
    name: 'Star Collector',
    description: 'Earned 10 stars!',
    icon: '⭐',
    earned: false
  },
  {
    id: 'reading-champion',
    name: 'Reading Champion',
    description: 'Read 20 story pages!',
    icon: '📚',
    earned: false
  },
  {
    id: 'detective-master',
    name: 'Detective Master',
    description: 'Solved all mysteries!',
    icon: '🏆',
    earned: false
  }
];

export const heroImage = 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769437274038_769aaef6.jpg';
