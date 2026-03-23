// src/store/gameStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateNPC } from '../systems/npcGenerator'

const SAVE_KEY = 'entropy-addict-save'

const initialState = {
  // Meta
  screen: 'title',         // title | prologue | charCreate | world | combat | party | inventory
  day: 1,
  timeOfDay: 'dawn',       // dawn | morning | midday | afternoon | dusk | night
  runId: null,             // unique per run — roguelike resets

  // Player character
  player: {
    name: '',
    primaryMastery: null,
    secondaryMastery: null,
    fateTitle: null,
    fieldRole: null,       // Breaker | Striker | Anchor | null (if Auxiliary)
    codex: [],             // up to 5 slots + 1 blank
    rootStages: {},        // { masteryName: 'Habit'|'Routine'|'Custom'|'Skill' }
    callVisible: true,     // player can always see Calls
    stats: {
      physicalConditioning: { stage: 'Habit', ticks: 1 },
    },
  },

  // Party
  party: [],               // array of joined NPC objects (full data visible)
  partyMax: 5,

  // World NPCs — discovered but not yet joined
  discoveredNPCs: [],      // array of NPC objects (limited data visible)

  // Current encounter
  activeEncounter: null,   // { type, npc, location, options }
  activeNPC: null,         // NPC being observed/approached

  // Inventory
  inventory: {
    locked: true,          // unlocks when Carrier with Tanner-pack joins
    items: [],
    carrier: null,         // party member id with Carrier mastery + pack
    hasQualifiedPack: false,
    routeMemory: [],
    supplyEstimate: null,
  },

  // Relation tracking — stored by NPC id
  relations: {},           // { npcId: { value, debt, demonstration, recognition, words, total, stage } }

  // Formation
  formation: {
    breaker: null,         // party member id
    striker: null,         // player is always Striker if Weapon+Mind
    anchor: null,
    auxiliaries: [],
  },

  // Civilisation stage
  civStage: 'Nomad',       // Nomad | Tribe | Community | Domain | Kingdom | Empire

  // Mystery threads — player notes accumulate here
  playerNotes: [],

  // Combat state (when screen === 'combat')
  combat: null,

  // Flags
  flags: {
    masterySelected: false,
    fateTitleReceived: false,
    firstNPCEncountered: false,
    inventoryUnlocked: false,
    firstCombat: false,
    tribalStageReached: false,
  },
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // ─── NAVIGATION ───────────────────────────────────────────────
      setScreen: (screen) => set({ screen }),

      // ─── NEW RUN ──────────────────────────────────────────────────
      startNewRun: () => {
        const runId = Date.now().toString(36)
        set({
          ...initialState,
          screen: 'prologue',
          runId,
        })
      },

      // ─── PLAYER SETUP ─────────────────────────────────────────────
      setPlayerName: (name) =>
        set((s) => ({ player: { ...s.player, name } })),

      selectPrimaryMastery: (mastery) =>
        set((s) => ({
          player: { ...s.player, primaryMastery: mastery },
        })),

      selectSecondaryMastery: (mastery, fateTitle, fieldRole) =>
        set((s) => ({
          player: {
            ...s.player,
            secondaryMastery: mastery,
            fateTitle,
            fieldRole,
          },
          flags: { ...s.flags, masterySelected: true },
        })),

      receiveFateTitle: () =>
        set((s) => ({
          flags: { ...s.flags, fateTitleReceived: true },
        })),

      // ─── NPC DISCOVERY ────────────────────────────────────────────
      discoverNPC: (npcData) =>
        set((s) => ({
          discoveredNPCs: [...s.discoveredNPCs, npcData],
          flags: { ...s.flags, firstNPCEncountered: true },
          activeNPC: npcData,
        })),

      setActiveNPC: (npc) => set({ activeNPC: npc }),

      observeNPC: (npcId) => {
        // Spending time watching an NPC — costs time, reveals more behaviour clues
        const { discoveredNPCs, relations } = get()
        const npc = discoveredNPCs.find((n) => n.id === npcId)
        if (!npc) return
        const rel = relations[npcId] || initRelation()
        set((s) => ({
          relations: {
            ...s.relations,
            [npcId]: { ...rel, observeCount: (rel.observeCount || 0) + 1 },
          },
          timeOfDay: advanceTime(s.timeOfDay),
        }))
      },

      // ─── RELATION BUILDING ────────────────────────────────────────
      addRelation: (npcId, currency, amount) => {
        const { relations, discoveredNPCs } = get()
        const npc = discoveredNPCs.find((n) => n.id === npcId)
          || get().party.find((n) => n.id === npcId)
        if (!npc) return

        const rel = relations[npcId] || initRelation()
        const weighted = amount * (npc.relationWeights?.[currency] || 1)
        const updated = {
          ...rel,
          [currency]: (rel[currency] || 0) + weighted,
          total: (rel.total || 0) + weighted,
        }
        updated.stage = deriveRelationStage(updated.total)

        set((s) => ({
          relations: { ...s.relations, [npcId]: updated },
        }))
      },

      // ─── RECRUITMENT ──────────────────────────────────────────────
      recruitNPC: (npcId) => {
        const { discoveredNPCs, party, relations, inventory } = get()
        const npc = discoveredNPCs.find((n) => n.id === npcId)
        if (!npc) return false

        const rel = relations[npcId] || initRelation()
        if (rel.stage !== 'recruit_ready') return false

        // Full data now visible after joining
        const joinedNPC = { ...npc, fullDataVisible: true }

        const newParty = [...party, joinedNPC]
        const newDiscovered = discoveredNPCs.filter((n) => n.id !== npcId)

        // Check inventory unlock
        let newInventory = inventory
        if (
          joinedNPC.masteries.includes('Carrier') &&
          inventory.hasQualifiedPack &&
          inventory.locked
        ) {
          newInventory = { ...inventory, locked: false, carrier: npcId }
        }

        set({
          party: newParty,
          discoveredNPCs: newDiscovered,
          inventory: newInventory,
          flags: {
            ...get().flags,
            inventoryUnlocked: !newInventory.locked,
          },
        })

        // Check civilisation stage
        get().checkCivStage()
        return true
      },

      // ─── NPC DEPARTURE WARNING ────────────────────────────────────
      triggerDepartureWarning: (npcId) => {
        set((s) => ({
          party: s.party.map((n) =>
            n.id === npcId ? { ...n, departureWarning: true } : n
          ),
        }))
      },

      // NPC actually leaves if player ignores warning
      departNPC: (npcId) => {
        const { party, relations } = get()
        const npc = party.find((n) => n.id === npcId)
        if (!npc) return

        set((s) => ({
          party: s.party.filter((n) => n.id !== npcId),
          // Put them back in discovered pool at reduced relation
          discoveredNPCs: [...s.discoveredNPCs, { ...npc, fullDataVisible: false, departureWarning: false }],
          relations: {
            ...s.relations,
            [npcId]: { ...(relations[npcId] || initRelation()), total: 0, stage: 'stranger' },
          },
        }))
      },

      // ─── NPC DEVELOPMENT ──────────────────────────────────────────
      developNPC: (npcId, task) => {
        set((s) => ({
          party: s.party.map((n) => {
            if (n.id !== npcId) return n
            const root = n.rootStage || 'Habit'
            const nextRoot = advanceRoot(root, task)
            return { ...n, rootStage: nextRoot, assignedTask: task }
          }),
        }))
      },

      // ─── INVENTORY ────────────────────────────────────────────────
      qualifyPack: () => {
        const { inventory, party } = get()
        const carrier = party.find((n) => n.masteries?.includes('Carrier'))
        set({
          inventory: {
            ...inventory,
            hasQualifiedPack: true,
            locked: !carrier, // unlocks immediately if Carrier already in party
            carrier: carrier?.id || null,
          },
          flags: { ...get().flags, inventoryUnlocked: !!carrier },
        })
      },

      addItem: (item) =>
        set((s) => ({
          inventory: {
            ...s.inventory,
            items: [...s.inventory.items, item],
          },
        })),

      // ─── COMBAT ───────────────────────────────────────────────────
      startCombat: (enemies) => {
        const { player, party, formation } = get()
        set({
          screen: 'combat',
          combat: initCombat(player, party, formation, enemies),
          flags: { ...get().flags, firstCombat: true },
        })
      },

      combatAction: (action) => {
        const { combat } = get()
        if (!combat) return
        const result = resolveCombatAction(combat, action)
        set({ combat: result.newState })
        if (result.ended) {
          set({ screen: 'world', combat: null })
        }
      },

      // ─── TIME ─────────────────────────────────────────────────────
      advanceDay: () =>
        set((s) => ({
          day: s.day + 1,
          timeOfDay: 'dawn',
        })),

      advanceTime: () =>
        set((s) => ({ timeOfDay: advanceTime(s.timeOfDay) })),

      // ─── CIVILISATION STAGE ───────────────────────────────────────
      checkCivStage: () => {
        const { party, civStage } = get()
        const hasChef = party.some((n) => n.masteries?.includes('Chef'))
        const hasCarrier = party.some((n) => n.masteries?.includes('Carrier'))
        const hasHealer = party.some((n) => n.masteries?.includes('Healer'))
        const hasFarmer = party.some((n) => n.masteries?.includes('Farmer'))
        const population = party.length + 1 // +1 for player

        if (civStage === 'Nomad' && hasChef && hasCarrier && population >= 4) {
          set({ civStage: 'Tribe', flags: { ...get().flags, tribalStageReached: true } })
        }
        if (civStage === 'Tribe' && hasHealer && hasFarmer && population >= 10) {
          set({ civStage: 'Community' })
        }
      },

      // ─── NOTES ────────────────────────────────────────────────────
      addNote: (note) =>
        set((s) => ({
          playerNotes: [...s.playerNotes, { text: note, day: s.day }],
        })),

      // ─── RESET ────────────────────────────────────────────────────
      resetGame: () => set({ ...initialState, screen: 'title' }),
    }),
    {
      name: SAVE_KEY,
      partialize: (s) => ({
        // Only persist what matters for save/load
        screen: s.screen,
        day: s.day,
        timeOfDay: s.timeOfDay,
        runId: s.runId,
        player: s.player,
        party: s.party,
        discoveredNPCs: s.discoveredNPCs,
        inventory: s.inventory,
        relations: s.relations,
        formation: s.formation,
        civStage: s.civStage,
        flags: s.flags,
        playerNotes: s.playerNotes,
      }),
    }
  )
)

// ─── HELPERS ────────────────────────────────────────────────────────────────

function initRelation() {
  return { value: 0, debt: 0, demonstration: 0, recognition: 0, words: 0, total: 0, stage: 'stranger', observeCount: 0 }
}

function deriveRelationStage(total) {
  if (total <= 0) return 'stranger'
  if (total < 5) return 'noticed'
  if (total < 12) return 'known'
  if (total < 20) return 'trusted'
  return 'recruit_ready'
}

function advanceTime(current) {
  const order = ['dawn', 'morning', 'midday', 'afternoon', 'dusk', 'night']
  const idx = order.indexOf(current)
  return idx >= order.length - 1 ? 'dawn' : order[idx + 1]
}

function advanceRoot(current, task) {
  const stages = ['Habit', 'Routine', 'Custom', 'Skill']
  const idx = stages.indexOf(current)
  // Task must be relevant to advance — simplified here
  if (idx >= stages.length - 1) return current
  // 30% chance of advancing per task (simplified; real system would track ticks)
  return Math.random() < 0.3 ? stages[idx + 1] : current
}

function initCombat(player, party, formation, enemies) {
  return {
    round: 1,
    phase: 'player_turn',   // player_turn | enemy_turn | resolution
    playerTeam: [
      { ...player, hp: 10, maxHp: 10, role: player.fieldRole },
      ...party
        .filter((n) => n.masteries?.some((m) => ['Weapon', 'Mind', 'Physical'].includes(m)))
        .map((n) => ({ ...n, hp: 8, maxHp: 8 })),
    ],
    enemies: enemies.map((e, i) => ({ ...e, id: `enemy_${i}`, hp: e.maxHp })),
    log: ['The formation takes shape.'],
    formationIntact: true,
    window: false,          // Striker window open
  }
}

function resolveCombatAction(combat, action) {
  // Simplified combat resolution — expand in Phase 2
  const newLog = [...combat.log]
  let newState = { ...combat }

  if (action.type === 'breaker_engage') {
    newLog.push('The Breaker opens contact. The enemy responds.')
    newState = { ...newState, window: true, log: newLog, phase: 'striker_turn' }
  } else if (action.type === 'striker_enter') {
    if (!combat.window) {
      newLog.push('The window is not open. You wait.')
      newState = { ...newState, log: newLog }
    } else {
      const damage = Math.floor(Math.random() * 3) + 2
      newLog.push(`You find the gap. ${damage} damage.`)
      const enemies = newState.enemies.map((e, i) =>
        i === 0 ? { ...e, hp: Math.max(0, e.hp - damage) } : e
      )
      newState = { ...newState, enemies, window: false, log: newLog, phase: 'anchor_hold' }
    }
  } else if (action.type === 'anchor_hold') {
    newLog.push('The Anchor holds the shape. The formation does not break.')
    newState = { ...newState, log: newLog, phase: 'enemy_turn' }
  } else if (action.type === 'end_turn') {
    // Enemy acts
    newLog.push('The enemy moves.')
    newState = { ...newState, log: newLog, round: newState.round + 1, phase: 'player_turn' }
  }

  const ended = newState.enemies.every((e) => e.hp <= 0) ||
    newState.playerTeam.every((p) => p.hp <= 0)

  return { newState, ended }
}
