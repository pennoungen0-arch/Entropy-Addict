// src/systems/npcGenerator.js
// Generates a unique NPC each run from the archetype pool.
// Same archetype can appear but with different name, clue selection, and stat variance.

import { CALLS, MASTERY_ROLES } from '../data/npcs.js'

const FIRST_NAMES = [
  'Ossen', 'Maret', 'Ferren', 'Essa', 'Renk', 'Senne', 'Tomas', 'Illen',
  'Deva', 'Branec', 'Halvec', 'Orren', 'Rogic', 'Varek', 'Keld', 'Surra',
  'Amvet', 'Dosse', 'Parn', 'Yllek', 'Cairn', 'Vestri', 'Orath', 'Nuen',
  'Bresk', 'Talven', 'Mirra', 'Gossen', 'Feln', 'Druva', 'Asket', 'Worren',
  'Lisse', 'Cael', 'Harven', 'Drun', 'Sorket', 'Pellin', 'Avran', 'Tessik',
]

const LAST_NAMES = [
  'Dun', 'Ash-Rel', 'Vas', 'Mertacur', 'Dunscal', 'Durn', 'Halsvec',
  'Caldenmere', 'Brine', 'Ironwind', 'Ashveld', 'Flatsborn', 'Steppeson',
  'Oakmark', 'Coldwater', 'Saltmarsh', 'Ridgeborn', 'Plainwalker', 'Farroad',
  'Thornback', 'Greymantle', 'Ember', 'Fellhorn', 'Dustwalker',
]

// Physical description fragments — combined with Mastery-specific clues
const GENERAL_DESCRIPTORS = [
  'lean', 'stocky', 'average height but wider than expected',
  'taller than they appear sitting down', 'shorter than expected but solid',
  'the kind of person who takes up exactly the space they need',
]

const AGE_DESCRIPTORS = {
  young: ['nineteen or twenty', 'younger than the work suggests', 'still growing into it'],
  mid: ['somewhere in their thirties', 'the age where the body has made its decisions', 'past the point of being underestimated'],
  experienced: ['somewhere past forty', 'old enough that the competence is invisible', 'the face does not match how they move'],
}

// Pick randomly from array
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Pick N unique items from array
const pickN = (arr, n) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(n, arr.length))
}

export function generateNPC(archetypeKey, overrides = {}) {
  const archetype = CALLS[archetypeKey]
  if (!archetype) {
    console.warn(`Unknown archetype: ${archetypeKey}`)
    return null
  }

  const id = `${archetypeKey}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const firstName = pick(FIRST_NAMES)
  const lastName = Math.random() > 0.4 ? pick(LAST_NAMES) : null
  const name = lastName ? `${firstName} ${lastName}` : firstName

  // Tier variance — can be ±0 or -1 from archetype tier (never exceed)
  const tierVariance = archetype.tier === 1 ? 0 : (Math.random() > 0.7 ? -1 : 0)
  const actualTier = archetype.tier + tierVariance

  // Select clues randomly — player sees 2 body clues and 1-2 behaviour clues
  const shownBodyClues = pickN(archetype.bodyClues, 2)
  const shownBehaviourClues = pickN(archetype.behaviourClues, Math.random() > 0.5 ? 2 : 1)
  const shownTierClue = pick(archetype.tierClues)

  // Opening dialogue — picked once, shown when player approaches
  const openingDialogue = pick(archetype.dialogue)

  // Age category
  const ageCategory = actualTier === 3 ? 'experienced' : actualTier === 2 ? 'mid' : 'young'
  const ageDescriptor = pick(AGE_DESCRIPTORS[ageCategory])
  const buildDescriptor = pick(GENERAL_DESCRIPTORS)

  // Root stage based on tier
  const rootStageMap = { 1: 'Habit', 2: 'Routine', 3: 'Custom' }
  const rootStage = rootStageMap[actualTier] || 'Habit'

  // Field role from Mastery combination
  const masteryKey = archetype.masteries.join('+')
  const roleData = MASTERY_ROLES[masteryKey] || MASTERY_ROLES[archetype.masteries.reverse().join('+')]

  return {
    id,
    archetypeKey,
    name,

    // VISIBLE BEFORE JOINING — the Call and clues
    call: archetype.call,
    shownBodyClues,           // 2 physical clues shown during observation
    shownBehaviourClues,      // 1-2 behaviour clues shown when player watches
    shownTierClue,            // 1 clue about how long they've been doing this
    openingDialogue,
    ageDescriptor,
    buildDescriptor,
    recruitLine: archetype.recruitLine,
    warningSignal: archetype.warningSignal,

    // HIDDEN UNTIL JOINED — full data
    masteries: archetype.masteries,
    tier: actualTier,
    rootStage,
    fieldRole: roleData?.role || 'Auxiliary',
    roleDescription: roleData?.description || '',
    relationWeights: archetype.relationWeights,
    fullDataVisible: false,   // flips to true on recruitment

    // State
    departureWarning: false,
    assignedTask: null,
    joinedDay: null,

    ...overrides,
  }
}

// Generate a set of NPCs for a new run
// Ensures the critical path is coverable (Tanner → Carrier → Chef available)
export function generateRunNPCs() {
  const criticalArchetypes = ['ESSA_ARCHETYPE', 'OSSEL_ARCHETYPE', 'MARET_ARCHETYPE']
  const optionalArchetypes = Object.keys(CALLS).filter(
    (k) => !criticalArchetypes.includes(k)
  )

  // Always include critical path — randomize spawn location/timing
  const npcs = criticalArchetypes.map((key) => generateNPC(key))

  // Add 3-5 optional NPCs for variety
  const optionalCount = Math.floor(Math.random() * 3) + 3
  const selectedOptional = pickN(optionalArchetypes, optionalCount)
  selectedOptional.forEach((key) => npcs.push(generateNPC(key)))

  // Shuffle spawn order — player won't encounter them in archetype order
  return npcs.sort(() => Math.random() - 0.5)
}

// Generate enemies for combat encounters
export function generateEnemies(threatLevel, count) {
  const enemyTypes = [
    { name: 'Raider', maxHp: 6, attack: 2, description: 'Fast and reckless. Does not hold position.' },
    { name: 'Steppe fighter', maxHp: 8, attack: 2, description: 'Trained. Has been in fights before.' },
    { name: 'Desperate group', maxHp: 5, attack: 1, description: 'Hungry and cornered. Unpredictable.' },
    { name: 'Ironwind scout', maxHp: 7, attack: 2, description: 'Disciplined. Part of something larger.' },
  ]

  return Array.from({ length: count }, () => {
    const base = pick(enemyTypes)
    const hpVariance = Math.floor(Math.random() * 3) - 1
    return {
      ...base,
      id: `enemy_${Math.random().toString(36).slice(2)}`,
      hp: Math.max(1, base.maxHp + hpVariance + threatLevel),
      maxHp: Math.max(1, base.maxHp + hpVariance + threatLevel),
    }
  })
}
