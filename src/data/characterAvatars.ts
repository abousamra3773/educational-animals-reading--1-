// Character avatar images for Tangle Town
// These are used to show character portraits next to dialogue

export interface CharacterAvatar {
  id: string;
  name: string;
  image: string;
  role?: string;
  color: string; // Background color for avatar ring
  textColor: string; // Text color for the character name
}

// Main characters in Tangle Town
export const characterAvatars: Record<string, CharacterAvatar> = {
  // Jake the Snake - Baker (Missing Cake story)
  'jake_snake': {
    id: 'jake_snake',
    name: 'Jake the Snake',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769472964638_b47941b3.jpg',
    role: 'Baker',
    color: 'ring-green-400 bg-green-100',
    textColor: 'text-green-700'
  },
  
  // Pancake the Cat (Missing Cake story)
  'pancake_cat': {
    id: 'pancake_cat',
    name: 'Pancake the Cat',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769472981250_bd86040a.png',
    role: 'Helper',
    color: 'ring-orange-400 bg-orange-100',
    textColor: 'text-orange-700'
  },
  
  // Ted the Turtle - Narrator / Mayor of Tangle Town
  'ted_turtle': {
    id: 'ted_turtle',
    name: 'Ted the Turtle',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769473001216_eaace213.png',
    role: 'Mayor & Narrator',
    color: 'ring-teal-400 bg-teal-100',
    textColor: 'text-teal-700'
  },
  
  // Detective placeholder (user's avatar)
  'detective': {
    id: 'detective',
    name: 'Detective',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769473019181_6f714d0d.png',
    role: 'Detective',
    color: 'ring-purple-400 bg-purple-100',
    textColor: 'text-purple-700'
  },

  // Bella Bunny - Lost Hat story

  'bella_bunny': {
    id: 'bella_bunny',
    name: 'Bella Bunny',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773789792705_aa68440c.png',

    role: 'Adventurer',
    color: 'ring-pink-400 bg-pink-100',
    textColor: 'text-pink-700'
  },


  // Batty the Bat - Lost Hat story
  'batty_bat': {
    id: 'batty_bat',
    name: 'Batty the Bat',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475383037_3c339acb.png',
    role: 'Mischief Maker',
    color: 'ring-purple-400 bg-purple-100',
    textColor: 'text-purple-700'
  },

  // Matt the Cat - Lost Hat story
  'matt_cat': {
    id: 'matt_cat',
    name: 'Matt the Cat',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475395512_bd1aed12.jpg',
    role: 'Helper',
    color: 'ring-orange-400 bg-orange-100',
    textColor: 'text-orange-700'
  },

  // Oliver Owl - Various stories
  'oliver_owl': {
    id: 'oliver_owl',
    name: 'Oliver Owl',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769437242816_6e3ecfe5.jpg',
    role: 'Wise Helper',
    color: 'ring-blue-400 bg-blue-100',
    textColor: 'text-blue-700'
  },

  // Misty Cat - Various stories
  'misty_cat': {
    id: 'misty_cat',
    name: 'Misty Cat',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769437298337_b9d2c3f3.jpg',
    role: 'Puzzle Solver',
    color: 'ring-gray-400 bg-gray-100',
    textColor: 'text-gray-700'
  },

  // Benny Bear - Various stories
  'benny_bear': {
    id: 'benny_bear',
    name: 'Benny Bear',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769437312882_52f67591.jpg',
    role: 'Memory Expert',
    color: 'ring-amber-400 bg-amber-100',
    textColor: 'text-amber-700'
  },

  // Mabel Mouse - Various stories (replaced Felix Fox)
  'mabel_mouse': {
    id: 'mabel_mouse',
    name: 'Mabel Mouse',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1773788765040_b33a1ecc.jpg',
    role: 'Rhyme Finder',
    color: 'ring-rose-400 bg-rose-100',
    textColor: 'text-rose-700'
  },

  // Finn Fox - Various stories
  'finn_fox': {
    id: 'finn_fox',
    name: 'Finn Fox',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769437188158_5c52274f.jpg',
    role: 'Word Builder',
    color: 'ring-orange-300 bg-orange-50',
    textColor: 'text-orange-600'
  },

  // Piggy the Pig - Garden Mystery
  'piggy_pig': {
    id: 'piggy_pig',
    name: 'Piggy the Pig',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475713718_0bcc2455.png',
    role: 'Garden Digger',
    color: 'ring-pink-400 bg-pink-100',
    textColor: 'text-pink-700'
  },

  // Sheepy the Sheep - Sleepy Town
  'sheepy_sheep': {
    id: 'sheepy_sheep',
    name: 'Sheepy the Sheep',
    image: 'https://d64gsuwffb70l.cloudfront.net/697777a0c70121e08d0a73b2_1769475729811_961db31d.jpg',
    role: 'Sleep Expert',
    color: 'ring-gray-300 bg-gray-50',
    textColor: 'text-gray-600'
  }
};

// Helper function to get character avatar by speaker name
export function getCharacterAvatar(speaker: string): CharacterAvatar | null {
  if (speaker === 'narrator') return characterAvatars['ted_turtle'];
  if (speaker === 'detective') return characterAvatars['detective'];
  
  const speakerLower = speaker.toLowerCase();
  
  if (speakerLower.includes('jake') && speakerLower.includes('snake')) return characterAvatars['jake_snake'];
  if (speakerLower.includes('pancake')) return characterAvatars['pancake_cat'];
  if (speakerLower.includes('ted') && speakerLower.includes('turtle')) return characterAvatars['ted_turtle'];
  if (speakerLower.includes('bella') && speakerLower.includes('bunny')) return characterAvatars['bella_bunny'];
  if (speakerLower.includes('batty')) return characterAvatars['batty_bat'];
  if (speakerLower.includes('matt') && speakerLower.includes('cat')) return characterAvatars['matt_cat'];
  if (speakerLower.includes('oliver') && speakerLower.includes('owl')) return characterAvatars['oliver_owl'];
  if (speakerLower.includes('misty')) return characterAvatars['misty_cat'];
  if (speakerLower.includes('benny') && speakerLower.includes('bear')) return characterAvatars['benny_bear'];
  if (speakerLower.includes('mabel') && speakerLower.includes('mouse')) return characterAvatars['mabel_mouse'];
  if (speakerLower.includes('finn') && speakerLower.includes('fox')) return characterAvatars['finn_fox'];
  if (speakerLower.includes('piggy') || (speakerLower.includes('pig') && !speakerLower.includes('cat'))) return characterAvatars['piggy_pig'];
  if (speakerLower.includes('sheepy') || speakerLower.includes('sheep')) return characterAvatars['sheepy_sheep'];
  
  // Generic animal matches (fallback)
  if (speakerLower.includes('snake')) return characterAvatars['jake_snake'];
  if (speakerLower.includes('bunny') || speakerLower.includes('rabbit')) return characterAvatars['bella_bunny'];
  if (speakerLower.includes('bat')) return characterAvatars['batty_bat'];
  if (speakerLower.includes('owl')) return characterAvatars['oliver_owl'];
  if (speakerLower.includes('bear')) return characterAvatars['benny_bear'];
  if (speakerLower.includes('mouse')) return characterAvatars['mabel_mouse'];
  if (speakerLower.includes('fox')) return characterAvatars['finn_fox'];
  if (speakerLower.includes('cat')) return characterAvatars['matt_cat'];

  if (speakerLower.includes('cat')) {
    return characterAvatars['matt_cat'];
  }
  
  // Default to detective for unknown speakers
  return characterAvatars['detective'];
}

// Get display name for a speaker (with avatar name substitution)
export function getSpeakerDisplayName(speaker: string, avatarName?: string): string {
  if (speaker === 'narrator') {
    return 'Ted the Turtle';
  }
  if (speaker === 'detective') {
    return `Detective ${avatarName || 'You'}`;
  }
  return speaker;
}
