// src/data/world.js
// YOUR FRIEND WORKS IN THIS FILE TOO.
// Encounter text, location descriptions, event flavour.
// The engine handles the logic. This file handles the words.

export const REGIONS = {
  ASHVELD_FLATS: {
    id: 'ashveld_flats',
    name: 'Ashveld Flats',
    description: 'Cracked pan-flat terrain. Pale scrub at the edges of vision. Everything feels assessed from a distance.',
    dangerLevel: 2,
    unlocked: true,
  },
  NORTHERN_APPROACH: {
    id: 'northern_approach',
    name: 'Northern Approach',
    description: 'The corridor that connects the steppe to the Flats. Something moves on the steppe that was not in the game data.',
    dangerLevel: 3,
    unlocked: false,
  },
}

// Location flavour within the Ashveld
export const LOCATIONS = [
  {
    id: 'open_flat',
    name: 'Open flat',
    descriptions: [
      'Cracked clay in every direction. The sky is the same pale grey it always is here — light that has not decided what kind of day it wants to be.',
      'Nothing breaks the horizon for a long time in any direction. That is both the danger and the advantage of this terrain.',
      'The ground has a sound when you walk on it. Dry. Hollow in places.',
    ],
  },
  {
    id: 'scrub_edge',
    name: 'Scrub edge',
    descriptions: [
      'The scrub here is sparse enough to see through but dense enough to move in. Useful for watching without being watched.',
      'Something uses this cover. You can tell from the compressed ground near the base of the largest clump.',
      'The wind changes character at the scrub line. It has been doing this for a long time.',
    ],
  },
  {
    id: 'cache_point',
    name: 'Cache point',
    descriptions: [
      'A hollow where two rises meet. Invisible from three of the four approaches. Someone was here before you.',
      'Good ground for storing things. Bad ground for fighting. You note this.',
      'The kind of place that becomes important before you mean it to.',
    ],
  },
  {
    id: 'water_source',
    name: 'Water source',
    descriptions: [
      'A seep rather than a spring. Reliable in the wet season. Less so now. Enough.',
      'The ground around it is churned. Multiple groups have been here recently.',
      'Clean water is the difference between staying and moving on. This buys you time.',
    ],
  },
  {
    id: 'abandoned_camp',
    name: 'Abandoned camp',
    descriptions: [
      'Someone left in a hurry or with purpose. The fire is cold. The arrangement of the remaining objects suggests purpose.',
      'Three days old at most. The direction they went is readable from the ground.',
      'What they left behind and what they took tells you something about where they were going.',
    ],
  },
]

// Random encounter events — what the player finds in a location
export const ENCOUNTERS = {
  NPC_ALONE: {
    type: 'npc',
    setup: [
      'Someone at a fire, alone. The fire is small and built right.',
      'A figure working at something near the scrub edge. Not hiding. Not advertising either.',
      'Someone moving through the flat at a pace that is not urgent but is not casual. They stop when they see you.',
      'A camp that has one person in it. Either the others left or there were never others.',
    ],
  },
  NPC_WORKING: {
    type: 'npc',
    setup: [
      'Someone doing work that requires attention. They are giving it that attention.',
      'A figure at a task. You cannot tell immediately what the task is from this distance.',
      'Someone who has been here long enough to have started something. You can see the beginning and middle of it but not the end.',
    ],
  },
  RESOURCE_FIND: {
    type: 'resource',
    setup: [
      'Something useful in a place you did not expect to find it.',
      'The terrain opens into a small area where something grows that should not grow here.',
      'An abandoned cache. Whoever left it is not coming back for it.',
    ],
  },
  THREAT_APPROACH: {
    type: 'threat',
    setup: [
      'Three people moving in a formation that is not casual. They have seen you.',
      'Something has been tracking your movement since the last water source. It is getting closer.',
      'A group that was camped at the next location has spread out. They are covering approaches.',
    ],
  },
  MAP_DIVERGENCE: {
    type: 'mystery',
    setup: [
      'The terrain here does not match your memory of it. Not obviously wrong. Wrong in a specific way.',
      'Something has been done to this area deliberately. You cannot tell what or when.',
      'A point where the ground behaves differently. You note the coordinates. You will come back to this.',
    ],
  },
}

// Day/night cycle flavour
export const TIME_OF_DAY = {
  dawn: [
    'Light arriving. Not committed to the day yet.',
    'The pale that comes before colour. The Flats are quiet in a specific way at this hour.',
    'Cold in the way that will not last. The first decision of the day.',
  ],
  morning: [
    'The light has decided. The day is happening.',
    'The hour when you can see far enough to plan.',
    'Morning in the Flats means visibility. Yours and theirs.',
  ],
  midday: [
    'The flat light that removes shadows. Everything is equally visible.',
    'Hot without mercy. The kind that compounds.',
    'Nothing moves in the middle hours that does not have to.',
  ],
  afternoon: [
    'The shadows return. The terrain gains texture.',
    'The hour when people start thinking about where they will sleep.',
    'Long light. Good for reading the ground.',
  ],
  dusk: [
    'The light is changing its mind about the day.',
    'The hour when decisions need to be made before they are made for you.',
    'The fire becomes necessary at dusk in the Flats. Everyone who has one knows where you are.',
  ],
  night: [
    'The dark here is complete. The stars are the only map.',
    'Night in the Flats is not quiet. It is a different kind of sound.',
    'The hour that belongs to the people who prepared for it.',
  ],
}

// Supply items the player can carry
export const SUPPLY_ITEMS = {
  food_basic: { name: 'Dried provisions', weight: 1, calories: 1, description: 'Enough. Not good.' },
  food_cooked: { name: 'Cooked meal', weight: 2, calories: 3, description: 'Someone made this. It shows.' },
  water: { name: 'Water', weight: 3, calories: 0, description: 'The fundamental calculation.' },
  firewood: { name: 'Firewood', weight: 2, calories: 0, description: 'Warmth and the ability to cook.' },
  hide_raw: { name: 'Raw hide', weight: 3, calories: 0, description: 'Useful to someone who knows what to do with it.' },
  salt: { name: 'Salt', weight: 1, calories: 0, description: 'Preservation. Worth more than it looks.' },
  medicinal_plants: { name: 'Medicinal plants', weight: 1, calories: 0, description: 'Only useful if you know which ones.' },
  route_notes: { name: 'Route notes', weight: 0, calories: 0, description: 'Someone\'s record of a road. Their accuracy is unknown.' },
}
