import { Character, Mystery, Badge, ComingSoonLesson } from '../types';

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
  },
  {
    id: 'zap',
    name: 'Zap the Squirrel',
    animal: 'Squirrel',
    specialty: 'Snapping words together',
    personality: 'Speedy and kind, Zap runs the Acorn Store and loves to help friends read!',
    image: '/characters/zap_squirrel_detective.png',
    fullBodyImage: '/characters/zap_squirrel_detective.png',
    color: 'bg-green-100'
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
    order: 16,
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
        image: '/stories/ake/scene1.jpg',
        dialogue: [
          { speaker: 'Jake the Snake', text: 'Oh no! I need to bake a cake.', emotion: 'worried' },
          { speaker: 'narrator', text: 'Jake cannot find his recipe.' },
          { speaker: 'Misty the Cat', text: 'I will help you!', emotion: 'excited' }
        ]
      },
      {
        id: 2,
        title: 'Scene 2',
        image: '/stories/ake/scene2.jpg',
        dialogue: [
          { speaker: 'Misty the Cat', text: 'Let me take a look.', emotion: 'thinking' },
          { speaker: 'narrator', text: 'Misty will make a plan.' },
          { speaker: 'Jake the Snake', text: 'I need to make a cake.', emotion: 'sad' }
        ]
      },
      {
        id: 3,
        title: 'Scene 3',
        image: '/stories/ake/scene3.jpg',
        dialogue: [
          { speaker: 'Misty the Cat', text: "Let's think.", emotion: 'thinking' },
          { speaker: 'narrator', text: 'While the friends think... Pancake wakes up!' },
          { speaker: 'Pancake the Cat', text: "I'm awake! I can help!", emotion: 'excited' }
        ]
      },
      {
        id: 4,
        title: 'Scene 4',
        image: '/stories/ake/scene4.jpg',
        dialogue: [
          { speaker: 'narrator', text: 'Pancake looks out at the lake.' },
          { speaker: 'Pancake the Cat', text: 'I saw it fall! Jake tried to make the batter and it slipped away.', emotion: 'surprised' },
          { speaker: 'Misty the Cat', text: 'Follow the clue!', emotion: 'excited' }
        ]
      },
      {
        id: 5,
        title: 'Scene 5',
        image: '/stories/ake/scene5.jpg',
        dialogue: [
          { speaker: 'narrator', text: 'The detectives follow Pancake to the door.' },
          { speaker: 'Misty the Cat', text: 'It must be near the door.', emotion: 'thinking' },
          { speaker: 'Jake the Snake', text: 'Please find my recipe!', emotion: 'worried' }
        ]
      },
      {
        id: 6,
        title: 'Scene 6',
        image: '/stories/ake/scene6.jpg',
        headerText: 'Can you find the missing recipe? Click on the recipe to help Jake the Snake.',
        dialogue: [
          { speaker: 'Misty the Cat', text: 'There it is! The recipe slipped under the mat by mistake.', emotion: 'happy' },
          { speaker: 'narrator', text: 'Misty hands the recipe back to Jake.' },
          { speaker: 'Jake the Snake', text: 'Thank you, Misty!', emotion: 'happy' }
        ],
        isInteractive: true,
        interactiveTarget: {
          description: 'Recipe paper under the doormat',
          hint: 'Look near the door!',
          position: { x: 32, y: 80, width: 28, height: 18 }
        }
      },
      {
        id: 7,
        title: 'Scene 7',
        image: '/stories/ake/scene7.jpg',
        dialogue: [
          { speaker: 'Jake the Snake', text: 'You found it! Now I can bake my cake!', emotion: 'happy' },
          { speaker: 'Pancake the Cat', text: 'Great job, Detective!', emotion: 'happy' },
          { speaker: 'narrator', text: 'You helped Jake find his recipe! Time to practice your -AKE words: bake, cake, make, take, rake, lake, snake, wake.' }
        ]
      }
    ],
    locationId: 'bakery'
  },

  {
    id: 'dancing-can',
    title: 'The Case of the Dancing Can',
    tagline: 'Something is making a can dance!',
    description: 'A little tin can keeps rolling around the town square all by itself! Help Benny Bear and Mabel Mouse find out why with words that end in "-an".',
    detective: characters[4],
    wordFamily: '-an',
    order: 2,
    difficulty: 'easy',
    stars: 0,
    completed: false,
    words: ['an', 'can', 'man', 'pan', 'fan', 'van', 'ran', 'plan', 'tan'],
    story: [
      { id: 1, text: 'A tin can went CLANG in the town square.', clue: 'Find words that end in -an!' },
      { id: 2, text: 'The can ran and Mabel ran after it.', clue: 'We need a plan!' },
      { id: 3, text: 'By the bench, the friends felt cool air.', clue: 'What is making the wind?' },
      { id: 4, text: 'A fan with a loose switch was on!', clue: 'You found the clue!' },
      { id: 5, text: 'Click! The fan went off and the can stopped.', clue: 'Mystery solved!' },
      { id: 6, text: 'Great job, Detective! You read your -an words!', clue: 'Time to practice your -AN words!' }
    ],
    scenes: [
      {
        id: 1,
        title: 'Scene 1',
        image: '/stories/an/scene1.jpg',
        dialogue: [
          { speaker: 'narrator', text: 'I am Willa. Our tale starts in the town square.' },
          { speaker: 'Benny Bear', text: 'Look! A tin can. It went CLANG!', emotion: 'surprised' },
          { speaker: 'Mabel Mouse', text: 'A can cannot dance. What now?', emotion: 'thinking' }
        ]
      },
      {
        id: 2,
        title: 'Scene 2',
        image: '/stories/an/scene2.jpg',
        dialogue: [
          { speaker: 'narrator', text: 'The can ran fast down the lane.' },
          { speaker: 'Mabel Mouse', text: 'I ran and ran. That can is quick!', emotion: 'excited' },
          { speaker: 'Benny Bear', text: 'Wait! We need a plan.', emotion: 'thinking' }
        ]
      },
      {
        id: 3,
        title: 'Scene 3',
        image: '/stories/an/scene3.jpg',
        dialogue: [
          { speaker: 'narrator', text: 'By the bench, the friends felt cool air.' },
          { speaker: 'Benny Bear', text: 'Do you feel that? It is a fan!', emotion: 'surprised' },
          { speaker: 'Mabel Mouse', text: 'A fan can push a can!', emotion: 'excited' }
        ]
      },
      {
        id: 4,
        title: 'Scene 4',
        image: '/stories/an/scene4.jpg',
        headerText: 'Can you find the loose switch behind the bench? Click on it to help Benny and Mabel!',
        dialogue: [
          { speaker: 'narrator', text: 'Mabel looks close with her glass.' },
          { speaker: 'Mabel Mouse', text: 'Yes! Found it! A loose switch.', emotion: 'happy' },
          { speaker: 'Benny Bear', text: 'The switch keeps the fan on!', emotion: 'excited' }
        ],
        isInteractive: true,
        interactiveTarget: {
          description: 'Loose switch on the wire behind the bench',
          hint: 'Look on the wire by the bench!',
          position: { x: 58, y: 60, width: 18, height: 22 }
        }
      },
      {
        id: 5,
        title: 'Scene 5',
        image: '/stories/an/scene5.jpg',
        dialogue: [
          { speaker: 'narrator', text: 'Click! The fan is off now.' },
          { speaker: 'Mabel Mouse', text: 'The can stops. No more dance!', emotion: 'happy' },
          { speaker: 'Benny Bear', text: 'Case closed! Good plan, Mabel.', emotion: 'happy' }
        ]
      },
      {
        id: 6,
        title: 'Scene 6',
        image: '/stories/an/scene6.jpg',
        dialogue: [
          { speaker: 'Benny Bear', text: 'We had a plan and it ran well!', emotion: 'happy' },
          { speaker: 'Mabel Mouse', text: 'You can read -an words now!', emotion: 'excited' },
          { speaker: 'narrator', text: 'Great job, Detective! The wind, not magic, made the can dance. Time to practice your -AN words: an, can, man, pan, fan, van, ran, plan, tan.' }
        ]
      }
    ]
  },

  {
    id: 'flapping-cap',
    title: 'The Case of the Flapping Cap',
    tagline: "Help Farah the Fawn find her missing cap!",
    description: "Farah lost her mama's cap in the woods when she took a nap! Zap the Squirrel and Mitzy the Mole use a map to find it. Read along with words that end in -ap.",
    detective: characters[9],
    wordFamily: '-ap',
    order: 3,
    difficulty: 'easy',
    stars: 0,
    completed: false,
    words: ['cap', 'map', 'nap', 'tap', 'lap', 'zap', 'flap', 'clap', 'snap'],
    story: [
      { id: 1, text: "Farah lost her mama's cap in the woods!", clue: 'Find words that end in -ap!' },
      { id: 2, text: 'Zap and Mitzy look at the map.', clue: 'The map can help us!' },
      { id: 3, text: 'Farah had a nap. Her cap went flap!', clue: 'Where did the cap go?' },
      { id: 4, text: 'Tap, tap, tap! Zap taps the branch.', clue: 'Get the cap down!' },
      { id: 5, text: 'Zap got the cap! It is in her lap.', clue: 'You found it!' },
      { id: 6, text: 'Clap, clap, clap! You can read -ap words!', clue: 'Time to practice your -ap words!' }
    ],
    scenes: [
      {
        id: 1,
        title: 'Scene 1',
        image: '/stories/ap/scene1.jpg',
        dialogue: [
            { speaker: 'Farah the Fawn', text: "Oh no, my mama's cap! I lost it in the woods.", emotion: 'worried' },
            { speaker: 'Willa the Warbler', text: "Farah lost her Mama's cap when she took a nap.", emotion: 'thinking' },
            { speaker: 'Zap the Squirrel', text: 'I can help you!', emotion: 'excited' },
            { speaker: 'Mitzy the Mole', text: "Let's see the map.", emotion: 'thinking' }
        ]
      },
      {
        id: 2,
        title: 'Scene 2',
        image: '/stories/ap/scene2.jpg',
        dialogue: [
          { speaker: 'Mitzy the Mole', text: 'Look! A map!', emotion: 'excited' },
          { speaker: 'narrator', text: 'The map can show us the cap.' },
          { speaker: 'Zap the Squirrel', text: 'To the woods we go!', emotion: 'happy' }
        ]
      },
      {
        id: 3,
        title: 'Scene 3',
        image: '/stories/ap/scene3.jpg',
        headerText: 'Can you find the cap? Click the red cap in the tree to help Farah!',
        dialogue: [
          { speaker: 'Farah the Fawn', text: 'I had a nap here.', emotion: 'thinking' },
          { speaker: 'narrator', text: 'The wind blew. The cap went flap, flap, flap!' },
          { speaker: 'Zap the Squirrel', text: 'It is up in the tree!', emotion: 'surprised' }
        ],
        isInteractive: true,
        interactiveTarget: {
          description: "Farah's red cap hanging on the branch",
          hint: 'Look up in the tree!',
          position: { x: 45, y: 3, width: 16, height: 17 }
        }
      },
      {
        id: 4,
        title: 'Scene 4',
        image: '/stories/ap/scene4.jpg',
        dialogue: [
          { speaker: 'Mitzy the Mole', text: 'Tap, tap, tap!', emotion: 'excited' },
          { speaker: 'Zap the Squirrel', text: 'I can tap the branch.', emotion: 'thinking' },
          { speaker: 'narrator', text: 'Zap will tap it down.' }
        ]
      },
      {
        id: 5,
        title: 'Scene 5',
        image: '/stories/ap/scene5.jpg',
        dialogue: [
          { speaker: 'Zap the Squirrel', text: 'Zap! I got the cap!', emotion: 'happy' },
          { speaker: 'Mitzy the Mole', text: 'Now it is in your lap!', emotion: 'happy' },
            { speaker: 'Farah the Fawn', text: "You found my mama's cap!", emotion: 'happy' }
        ]
      },
      {
        id: 6,
        title: 'Scene 6',
        image: '/stories/ap/scene6.jpg',
        dialogue: [
          { speaker: 'Farah the Fawn', text: 'Clap, clap, clap!', emotion: 'excited' },
          { speaker: 'Zap the Squirrel', text: 'Snap! You did it!', emotion: 'happy' },
          { speaker: 'narrator', text: 'You can read -ap! cap, map, nap, tap, flap, clap, snap, lap, zap!' }
        ]
      }
    ],
    locationId: 'acorn-store'
  },

  {
    id: 'lost-hat',
    title: 'The Case of the Lost Hat',
    tagline: 'Help Bella Bunny find her favorite hat!',
    description: 'Bella\'s favorite hat flew away! Find words that end in "-at" to help.',
    detective: characters[1],
    wordFamily: '-at',
    order: 1,
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
        image: '/stories/at/scene1.jpg',
        dialogue: [
          { speaker: 'narrator', text: 'It was a sunny day at Cozy Cottage Lane.' },
          { speaker: 'Bella Bunny', text: 'What a nice day! I love to sit on my mat with my friend Matt the Cat.', emotion: 'happy' },
          { speaker: 'Matt the Cat', text: 'This is so nice! I could sit here and chat all day.', emotion: 'happy' }
        ]
      },
      {
        id: 2,
        title: 'Scene 2',
        image: '/stories/at/scene2.jpg',
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
        image: '/stories/at/scene3.jpg',
        dialogue: [
          { speaker: 'Matt the Cat', text: 'I will run after that bat! Wait for me!', emotion: 'excited' },
          { speaker: 'narrator', text: 'Matt the Cat ran as fast as he could through the meadow.' },
          { speaker: 'detective', text: 'Go, Matt! You can catch that bat!', emotion: 'excited' }
        ]
      },
      {
        id: 4,
        title: 'Scene 4',
        image: '/stories/at/scene4.jpg',
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
        image: '/stories/at/scene5.png',
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
        image: '/stories/at/scene6.png',
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
    order: 4,
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
    order: 46,
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
    order: 47,
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
    order: 11,
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
    order: 48,
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
    order: 7,
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
    order: 34,
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
    order: 33,
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
    order: 49,
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
    order: 50,
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

// Placeholder lessons for word families in the learning sequence that do not
// have a story yet. These are shown greyed-out in the lesson list and are not
// playable. Real stories carry their own `order` field in the `mysteries`
// array above; these fill the gaps in the sequence.
export const comingSoonLessons: ComingSoonLesson[] = [
  // 1. Short vowel CVC
  { id: 'cs-in', wordFamily: '-in', title: '-in family', order: 5, status: 'coming-soon', group: 'Short Vowel CVC' },
  { id: 'cs-it', wordFamily: '-it', title: '-it family', order: 6, status: 'coming-soon', group: 'Short Vowel CVC' },
  { id: 'cs-ot', wordFamily: '-ot', title: '-ot family', order: 8, status: 'coming-soon', group: 'Short Vowel CVC' },
  { id: 'cs-og', wordFamily: '-og', title: '-og family', order: 9, status: 'coming-soon', group: 'Short Vowel CVC' },
  { id: 'cs-ug', wordFamily: '-ug', title: '-ug family', order: 10, status: 'coming-soon', group: 'Short Vowel CVC' },
  { id: 'cs-ut', wordFamily: '-ut', title: '-ut family', order: 12, status: 'coming-soon', group: 'Short Vowel CVC' },
  { id: 'cs-ed', wordFamily: '-ed', title: '-ed family', order: 13, status: 'coming-soon', group: 'Short Vowel CVC' },
  { id: 'cs-en', wordFamily: '-en', title: '-en family', order: 14, status: 'coming-soon', group: 'Short Vowel CVC' },
  { id: 'cs-et', wordFamily: '-et', title: '-et family', order: 15, status: 'coming-soon', group: 'Short Vowel CVC' },
  // 2. Long vowel silent-e
  { id: 'cs-ame', wordFamily: '-ame', title: '-ame family', order: 17, status: 'coming-soon', group: 'Long Vowel Silent-e' },
  { id: 'cs-ate', wordFamily: '-ate', title: '-ate family', order: 18, status: 'coming-soon', group: 'Long Vowel Silent-e' },
  { id: 'cs-ale', wordFamily: '-ale', title: '-ale family', order: 19, status: 'coming-soon', group: 'Long Vowel Silent-e' },
  { id: 'cs-ide', wordFamily: '-ide', title: '-ide family', order: 20, status: 'coming-soon', group: 'Long Vowel Silent-e' },
  { id: 'cs-ine', wordFamily: '-ine', title: '-ine family', order: 21, status: 'coming-soon', group: 'Long Vowel Silent-e' },
  { id: 'cs-ike', wordFamily: '-ike', title: '-ike family', order: 22, status: 'coming-soon', group: 'Long Vowel Silent-e' },
  { id: 'cs-ope', wordFamily: '-ope', title: '-ope family', order: 23, status: 'coming-soon', group: 'Long Vowel Silent-e' },
  { id: 'cs-one', wordFamily: '-one', title: '-one family', order: 24, status: 'coming-soon', group: 'Long Vowel Silent-e' },
  { id: 'cs-ose', wordFamily: '-ose', title: '-ose family', order: 25, status: 'coming-soon', group: 'Long Vowel Silent-e' },
  { id: 'cs-ute', wordFamily: '-ute', title: '-ute family', order: 26, status: 'coming-soon', group: 'Long Vowel Silent-e' },
  { id: 'cs-une', wordFamily: '-une', title: '-une family', order: 27, status: 'coming-soon', group: 'Long Vowel Silent-e' },
  // 3. Vowel teams
  { id: 'cs-ay', wordFamily: '-ay', title: '-ay family', order: 28, status: 'coming-soon', group: 'Vowel Teams' },
  { id: 'cs-ai', wordFamily: '-ai', title: '-ai family', order: 29, status: 'coming-soon', group: 'Vowel Teams' },
  { id: 'cs-ee', wordFamily: '-ee', title: '-ee family', order: 30, status: 'coming-soon', group: 'Vowel Teams' },
  { id: 'cs-ea', wordFamily: '-ea', title: '-ea family', order: 31, status: 'coming-soon', group: 'Vowel Teams' },
  { id: 'cs-oa', wordFamily: '-oa', title: '-oa family', order: 32, status: 'coming-soon', group: 'Vowel Teams' },
  // 4. R-controlled vowels
  { id: 'cs-ar', wordFamily: '-ar', title: '-ar family', order: 35, status: 'coming-soon', group: 'R-Controlled Vowels' },
  { id: 'cs-or', wordFamily: '-or', title: '-or family', order: 36, status: 'coming-soon', group: 'R-Controlled Vowels' },
  { id: 'cs-er', wordFamily: '-er', title: '-er family', order: 37, status: 'coming-soon', group: 'R-Controlled Vowels' },
  { id: 'cs-ir', wordFamily: '-ir', title: '-ir family', order: 38, status: 'coming-soon', group: 'R-Controlled Vowels' },
  { id: 'cs-ur', wordFamily: '-ur', title: '-ur family', order: 39, status: 'coming-soon', group: 'R-Controlled Vowels' },
  // 5. Diphthongs and less common patterns
  { id: 'cs-oy', wordFamily: '-oy', title: '-oy family', order: 40, status: 'coming-soon', group: 'Diphthongs & Less Common' },
  { id: 'cs-oi', wordFamily: '-oi', title: '-oi family', order: 41, status: 'coming-soon', group: 'Diphthongs & Less Common' },
  { id: 'cs-ow-diphthong', wordFamily: '-ow', title: '-ow family (as in cow)', order: 42, status: 'coming-soon', group: 'Diphthongs & Less Common' },
  { id: 'cs-ou', wordFamily: '-ou', title: '-ou family', order: 43, status: 'coming-soon', group: 'Diphthongs & Less Common' },
  { id: 'cs-aw', wordFamily: '-aw', title: '-aw family', order: 44, status: 'coming-soon', group: 'Diphthongs & Less Common' },
  { id: 'cs-au', wordFamily: '-au', title: '-au family', order: 45, status: 'coming-soon', group: 'Diphthongs & Less Common' },
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

export const heroImage = '/cozy-village.webp';
