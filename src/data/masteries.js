// src/data/masteries.js

export const MASTERIES = {
  // COMBAT
  Mind: {
    type: 'combat',
    description: 'You read before you act. You wait for the gap.',
    bodyResult: 'Still posture. Eyes that move before the body does.',
    pairsWith: {
      Weapon: 'Striker — reads the fight in motion, enters at the right moment',
      Physical: 'Anchor — holds the formation\'s shape, controls the pace',
    },
  },
  Weapon: {
    type: 'combat',
    description: 'You know how to end a confrontation. You have done it before.',
    bodyResult: 'Dominant shoulder lower. Grip calluses. Knife on the correct side.',
    pairsWith: {
      Mind: 'Striker — reads the fight in motion, enters at the right moment',
      Physical: 'Breaker — goes first, draws engagement, creates the opening',
    },
  },
  Physical: {
    type: 'combat',
    description: 'The body has been trained long enough to have its own logic.',
    bodyResult: 'Heavy build. Economy of movement. Does not tire visibly.',
    pairsWith: {
      Weapon: 'Breaker — goes first, draws engagement, creates the opening',
      Mind: 'Anchor — holds the formation\'s shape, controls the pace',
    },
  },

  // AUXILIARY — cannot be paired with each other for combat roles
  Chef: {
    type: 'auxiliary',
    description: 'You know what people need before they ask. You feed the tribe.',
    bodyResult: 'Burn marks on wrists. Small working knife. The smell of smoke.',
  },
  Carrier: {
    type: 'auxiliary',
    description: 'You remember every road you have walked. The pack holds everything together.',
    bodyResult: 'Strap blisters on shoulders. Pack always balanced. Checks load before moving.',
  },
  Tanner: {
    type: 'auxiliary',
    description: 'You know what the material can become. You make things that last.',
    bodyResult: 'Chemical staining on thumb and index. Touches edges when thinking.',
  },
  Scout: {
    type: 'auxiliary',
    description: 'You do not find the road. You create the conditions for roads to exist.',
    bodyResult: 'Boots worn on outside edge. Faces where they came from.',
  },
  Healer: {
    type: 'auxiliary',
    description: 'You keep things functional. You look at wounds before faces.',
    bodyResult: 'Small cuts from plant work. Folded cloth at belt. Counts breathing.',
  },
  Farmer: {
    type: 'auxiliary',
    description: 'You know what will grow and what will not. You root the tribe.',
    bodyResult: 'Soil under nails. Crouches to read the ground. Saves scraps.',
  },
  Blacksmith: {
    type: 'auxiliary',
    description: 'You make the tools the others use. Quality floor for everything.',
    bodyResult: 'Burn scars on forearms. Very wide hands. Taps metal to hear it.',
  },
  Merchant: {
    type: 'auxiliary',
    description: 'You know what things are worth before anyone names a price.',
    bodyResult: 'Smooth palms. Clothing better than context warrants. Names a number first.',
  },
}

// Fate titles generated from Mastery combinations
// These appear after the player's first Mastery selection in ch.15 equivalent
export const FATE_TITLES = {
  'Mind+Weapon': [
    'Sovereign Tide',
    'The Eye Before the Strike',
    'Still Water, Moving Current',
  ],
  'Mind+Physical': [
    'The Shape That Holds',
    'Measured Ground',
    'What Stands When Others Move',
  ],
  'Weapon+Physical': [
    'Stone That Opens Doors',
    'First Through',
    'The Weight of the First Step',
  ],
  'Chef+Mind': [
    'Warm Hands, Cold Morning',
    'What the Fire Knows',
    'The Meal Before the Decision',
  ],
  'Carrier+Physical': [
    'The Weight Remembers',
    'Road Made of Walking',
    'Everything Arrives',
  ],
  'Scout+Mind': [
    'The Road Before the Road',
    'What the Horizon Already Knows',
    'First Light Reader',
  ],
  'Healer+Mind': [
    'Hands That Ask Before They Touch',
    'The Body\'s Honest Account',
    'What Stays Functional',
  ],
  'Tanner+Physical': [
    'What the Hide Becomes',
    'The Shape That Lasts',
    'Made to Bear Weight',
  ],
}

// Player Mastery selection flow
// Player picks primary first, then secondary is offered as contextual choices
export const MASTERY_FLOW = {
  step1_prompt: 'You have been watching what your body does without asking it to. Over fourteen days of small decisions, one pattern keeps showing.',
  step2_prompt: 'The first choice shapes what the second choice becomes. Look at what you have been doing, not what you meant to do.',
  confirmation_prompt: 'This is not a class. It is an observation. The system has been watching you.',
}
