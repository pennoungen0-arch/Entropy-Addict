// src/data/npcs.js
// YOUR FRIEND WORKS IN THIS FILE.
// No coding needed — just edit the text content.
// Each NPC entry is one possible character the engine can spawn.
// The engine picks randomly each run. Add as many as you want.

export const CALLS = {
  // FORMAT:
  // masteries: [primary, secondary] — drives field role derivation
  // call: the poetic label the player sees immediately
  // tier: 1, 2, or 3 — hidden until player deduces it
  // bodyClues: array of physical descriptions — engine picks 2 randomly
  // behaviourClues: array of observed actions — engine picks 1-2 randomly
  // tierClues: how the tier shows in their body/wear — engine picks 1
  // dialogue: what they say when player initiates contact (before relation is built)
  // recruitLine: what they ask/say at the unlock moment
  // warningSignal: the one observable thing that shows they're about to leave
  // relationWeights: which currencies move them most { value, debt, demonstration, recognition, words }

  MARET_ARCHETYPE: {
    masteries: ['Chef', 'Mind'],
    call: 'Warm Hands, Cold Morning',
    tier: 3,
    bodyClues: [
      'Burn marks circle both her wrists. Old ones, layered over each other.',
      'Her fingers move with the specific economy of someone who has repeated the same motion ten thousand times.',
      'The skin on her palms is smooth in patches where calluses have worn through and reformed.',
      'There is a small knife on her belt, handle turned inward. A working knife, not a fighting one.',
    ],
    behaviourClues: [
      'She checks what others are eating before she eats herself.',
      'She feeds the fire in a specific sequence. She has reasons for the sequence.',
      'When someone in her sight looks cold, she adjusts what she is doing without being asked.',
      'She smells the ingredients before she uses them. Always.',
    ],
    tierClues: [
      'The burn marks are old enough to have their own texture. She has been doing this for a long time.',
      'She works without looking at her hands. Her attention is always on the people around her.',
    ],
    dialogue: [
      'She already knew you were watching. She says this in the same tone she uses to describe wood not being dry enough.',
      'She does not look up when you approach. She says: sit down or keep moving.',
      'She offers you a cup before you say anything. She waits to see what you do with it.',
    ],
    recruitLine: 'She asks: what do you need from me? Not what she will get. What you need.',
    warningSignal: 'She cooks enough for everyone but eats last and eats less. She has done this before when she was about to leave somewhere.',
    relationWeights: { value: 2, debt: 3, demonstration: 2, recognition: 4, words: 3 },
  },

  OSSEL_ARCHETYPE: {
    masteries: ['Carrier', 'Physical'],
    call: 'The Weight Remembers',
    tier: 2,
    bodyClues: [
      'Deep strap blisters on both shoulders, the kind that have healed and reopened so many times they have become part of the shoulder\'s shape.',
      'His hands are broad and the grip never fully relaxes, even when he is sitting still.',
      'His boots are worn evenly on both soles. He distributes weight without thinking about it.',
      'There is a faded line across his forehead where a tumpline has pressed for years.',
    ],
    behaviourClues: [
      'He checks the balance of his pack before moving, not after.',
      'He looks at the ground before he looks at the horizon.',
      'When he sets something down, he notes where he set it.',
      'He counts things. Quietly. You can see his lips move sometimes.',
    ],
    tierClues: [
      'The pack he carries has been repaired in three places, all of them cleanly. He did not buy a new pack.',
      'He moves through rough terrain without looking at his feet. The body has done this long enough to know.',
    ],
    dialogue: [
      'He evaluates you the way people who move through dangerous territory evaluate every variable. Then he keeps walking.',
      'He says very little. He asks where you are going. He waits for the answer.',
      'He sits at a distance and eats. He is not being unfriendly. He is observing.',
    ],
    recruitLine: 'He says: I have been where you are going. Some of it is not what you think it is.',
    warningSignal: 'He starts packing his things in the evening instead of the morning. He has not said he is leaving.',
    relationWeights: { value: 3, debt: 2, demonstration: 4, recognition: 3, words: 1 },
  },

  FERREN_ARCHETYPE: {
    masteries: ['Scout', 'Mind'],
    call: 'The Road Before the Road',
    tier: 3,
    bodyClues: [
      'His boots are worn on the outside edge of each sole. Forty years of roads have shaped the way he walks.',
      'His hands carry no tool marks, no calluses from gripping. Clean hands on a hard-lived body.',
      'He is older than he first appears. The face does not match the way he moves.',
      'He carries a walking stick he does not lean on. It is something else.',
    ],
    behaviourClues: [
      'He faces the direction he just came from, not the direction he is going.',
      'He reads the sky before he reads you.',
      'He stops moving when something changes. Not a sound. Something you cannot identify.',
      'He finds water without looking for it. He simply walks toward it.',
    ],
    tierClues: [
      'He does not find the road. He arrives where the road will be. Forty years of this.',
      'He has the stillness of someone who has survived by not being seen for a very long time.',
    ],
    dialogue: [
      'He asks where you are going. He already knows some of what you will say.',
      'He says: some of those places are not what they used to be.',
      'He sits down first. He waits to see if you will sit too.',
    ],
    recruitLine: 'He stands up, picks up his stick, and follows. You are not sure what you offered.',
    warningSignal: 'He mentions a road he has not been down in a long time. He is thinking about walking it again.',
    relationWeights: { value: 1, debt: 2, demonstration: 3, recognition: 5, words: 3 },
  },

  ESSA_ARCHETYPE: {
    masteries: ['Tanner', 'Physical'],
    call: 'What the Hide Becomes',
    tier: 2,
    bodyClues: [
      'Chemical staining on her thumb and the side of her index finger. It does not wash out.',
      'She smells of salt and something organic underneath it. Not unpleasant. Specific.',
      'Her forearms are strong in the way that comes from pulling and stretching, not from lifting.',
      'There are small crescent marks on her fingertips from a curved blade used thousands of times.',
    ],
    behaviourClues: [
      'She touches the edge of any material she picks up. Assessing it.',
      'When she is thinking, she runs her thumb across her fingers in sequence.',
      'She looks at your pack straps before she looks at your face.',
      'She does not waste. She folds things. She uses the whole of what she has.',
    ],
    tierClues: [
      'The work in her hands is at Custom level. Things she makes do not require repair.',
      'She is not fast. She is precise. Those are not the same thing and she knows it.',
    ],
    dialogue: [
      'She does not ask what you want. She waits to see if you know how to ask for it.',
      'She says: what do you need it to hold?',
      'She is already working when you arrive. She does not stop.',
    ],
    recruitLine: 'She asks for the measurements. She does not ask why you need specific load-bearing geometry.',
    warningSignal: 'She finishes the current piece of work and does not start the next one. She is deciding something.',
    relationWeights: { value: 4, debt: 2, demonstration: 3, recognition: 3, words: 1 },
  },

  RENK_ARCHETYPE: {
    masteries: ['Weapon', 'Physical'],
    call: 'Stone That Moves First',
    tier: 2,
    bodyClues: [
      'His knuckles are scarred across all four of the right hand and three of the left. Old scars.',
      'His dominant shoulder sits lower than the other. Years of leading with it.',
      'He is very large in a way that does not read as threatening from a distance. Up close it does.',
      'His knife is on his dominant side, handle forward. A working placement, not a display.',
    ],
    behaviourClues: [
      'He watches exits. Not conspicuously. But he always knows where they are.',
      'He adjusts his stance when anyone new enters his sight line.',
      'He does not move unless he has decided to move. When he moves, he is already committed.',
      'He eats facing outward.',
    ],
    tierClues: [
      'The scars on his hands are layered. He has been doing this long enough to have healed damage multiple times.',
      'He does not look ready. He simply is ready. There is a difference.',
    ],
    dialogue: [
      'He listens with the stillness of someone who has been disappointed by offers before.',
      'He does not fill the silence. He waits to see what you do with it.',
      'He looks at you the way someone looks at a load they are estimating.',
    ],
    recruitLine: 'He says: what is the gap? Not yes. Not no. He wants to understand the job.',
    warningSignal: 'He stops asking about the plan. He has been asking every morning. When he stops, he is reconsidering.',
    relationWeights: { value: 2, debt: 3, demonstration: 5, recognition: 2, words: 3 },
  },

  SENNE_ARCHETYPE: {
    masteries: ['Healer', 'Mind'],
    call: 'Hands That Ask Before They Touch',
    tier: 1,
    bodyClues: [
      'Small cuts on her fingers, the kind that come from plant preparation. They are always at different stages of healing.',
      'She carries a small cloth, folded in a specific way, at her belt. She has not used it today.',
      'Her hands are still when she is not working. She rests them deliberately.',
      'There are faint herb stains under her fingernails that she does not bother to remove.',
    ],
    behaviourClues: [
      'She looks at wounds before she looks at faces.',
      'She counts breathing. She is not obvious about it but she does it.',
      'When someone is hurt, she moves without hesitation but does not rush. Those are different things.',
      'She asks before she touches anyone. She has reasons for this.',
    ],
    tierClues: [
      'Her technique is right but she still thinks through each step. She is not automatic yet.',
      'She is young enough that the confidence is real but the experience is still building.',
    ],
    dialogue: [
      'She is direct in the way that people are when they have seen enough of what happens when you are not.',
      'She asks what is wrong before she asks who you are.',
      'Her brother is with her. She does not pretend otherwise.',
    ],
    recruitLine: 'She says: I will come if my brother comes. She does not make this sound like a condition. It is a fact.',
    warningSignal: 'She starts carrying her full kit at all times instead of leaving part of it at camp. She is ready to move.',
    relationWeights: { value: 3, debt: 4, demonstration: 2, recognition: 3, words: 3 },
  },

  BRANEC_ARCHETYPE: {
    masteries: ['Mind', 'Physical'],
    call: 'Iron Left at the Threshold',
    tier: 3,
    bodyClues: [
      'Ink stains on his right hand, the kind that come from sustained writing rather than occasional use.',
      'He is solid in a way that is not primarily about fighting. The body of someone who has carried responsibility for a long time.',
      'His eyes move before the rest of him does. He reads the room before he enters it.',
      'He keeps his hands visible when talking to someone new. He learned this somewhere.',
    ],
    behaviourClues: [
      'He maps spaces when he enters them. Not conspicuously. But he knows where everything is.',
      'He reads the shape of situations the same way he reads the shape of rooms.',
      'When something is about to go wrong, he is already adjusting his position before it does.',
      'He carries something folded in his coat. He has not opened it.',
    ],
    tierClues: [
      'He has been doing this for long enough that the competence is invisible. You only see what he produces.',
      'He left something behind. The weight of it shows in how carefully he moves now.',
    ],
    dialogue: [
      'He says: you have been watching me. It is not an accusation.',
      'He does not ask who you are. He asks what you have seen.',
      'He is mapping you the same way he maps everything. You can see it if you look.',
    ],
    recruitLine: 'He says: then I want to see if it holds.',
    warningSignal: 'He starts spending time at the perimeter of camp, looking outward. He is remembering that the world is larger than this.',
    relationWeights: { value: 1, debt: 2, demonstration: 3, recognition: 4, words: 5 },
  },
}

// Relation currency types — what builds the relationship
export const RELATION_CURRENCIES = {
  value: {
    label: 'Value exchange',
    description: 'You give them something real. Food, intelligence, protection.',
    actions: ['share_food', 'share_route_intel', 'offer_protection', 'trade_fairly'],
  },
  debt: {
    label: 'Debt',
    description: 'You help when they did not ask. They do not forget.',
    actions: ['help_unprompted', 'cover_them_in_danger', 'solve_problem_they_had'],
  },
  demonstration: {
    label: 'Demonstration',
    description: 'You do something competent in front of them. They reassess.',
    actions: ['handle_threat_well', 'make_correct_call', 'predict_something_accurately'],
  },
  recognition: {
    label: 'Recognition',
    description: 'You see them clearly. You act on the read. They notice.',
    actions: ['correct_call_read', 'acknowledge_their_skill', 'ask_the_right_question'],
  },
  words: {
    label: 'The right words',
    description: 'Not charm. The true thing, at the right moment. One sentence.',
    actions: ['honest_answer', 'correct_framing', 'say_what_they_needed_to_hear'],
  },
}

// Mastery combinations and derived field roles
export const MASTERY_ROLES = {
  'Weapon+Physical': { role: 'Breaker', description: 'Goes first. Creates the opening.' },
  'Weapon+Mind': { role: 'Striker', description: 'Reads the fight. Enters at the right moment.' },
  'Mind+Physical': { role: 'Anchor', description: 'Holds the shape. Controls the pace.' },
  'Chef+Mind': { role: 'Auxiliary', description: 'Morale spine. The party holds because of them.' },
  'Chef+Physical': { role: 'Auxiliary', description: 'Feeds and sustains. Endurance base.' },
  'Carrier+Physical': { role: 'Auxiliary', description: 'Logistics spine. Nothing moves without them.' },
  'Carrier+Mind': { role: 'Auxiliary', description: 'Logistics and intelligence. Route memory.' },
  'Tanner+Physical': { role: 'Auxiliary', description: 'Crafts what the party carries. Gear quality.' },
  'Tanner+Mind': { role: 'Auxiliary', description: 'Precision craft. Load-bearing geometry.' },
  'Scout+Mind': { role: 'Auxiliary', description: 'Creates roads. Forty years of this.' },
  'Scout+Physical': { role: 'Auxiliary', description: 'Fast range. Can hold their own.' },
  'Healer+Mind': { role: 'Auxiliary', description: 'Keeps the party functional after damage.' },
  'Farmer+Physical': { role: 'Auxiliary', description: 'Long-term food security. Roots the tribe.' },
  'Farmer+Mind': { role: 'Auxiliary', description: 'Seasonal intuition. Knows what will grow.' },
  'Blacksmith+Physical': { role: 'Auxiliary', description: 'Weapon and tool production. Quality floor.' },
}

// Root development stages
export const ROOT_STAGES = ['Habit', 'Routine', 'Custom', 'Skill']

// Tier descriptions — visible in clue writing, not shown to player directly
export const TIER_TELLS = {
  1: 'Fresh. The technique is right but still conscious. They think through each step.',
  2: 'Established. The body knows. They have stopped thinking about the basics.',
  3: 'Crystallised. Decades in. The skill is inseparable from the person.',
}
