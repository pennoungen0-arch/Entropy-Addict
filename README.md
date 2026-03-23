# Entropy Addict — Game

A turn-based RPG set in the Ashveld Flats. You have the protagonist's knowledge. You are not the protagonist.

---

## Zero cost. Everything here is free.

| Tool | Cost |
|------|------|
| GitHub (repo + collaboration) | Free |
| GitHub Pages (hosting + auto-deploy) | Free |
| GitHub Actions (build pipeline) | Free |
| React + Vite | Open source |
| Zustand (state) | Open source |
| localStorage (save system) | Built into every browser |
| PWA (install on Android) | No app store needed |

---

## Setup — do this once

### 1. Create the GitHub repo

1. Go to github.com → New repository
2. Name it `entropy-addict`
3. Set to **Public** (required for free GitHub Pages)
4. Do NOT initialise with README (you already have one)

### 2. Push this code

```bash
git init
git add .
git commit -m "init: phase 1 codebase"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/entropy-addict.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repo → Settings → Pages
2. Source: **GitHub Actions**
3. Save

That's it. Every push to `main` auto-deploys. Your game will be live at:
`https://YOUR_USERNAME.github.io/entropy-addict/`

### 4. Install on Android (PWA)

1. Open the URL in Chrome on Android
2. Tap the three-dot menu → "Add to Home screen"
3. It installs like a real app. No app store. No cost.

---

## Running locally for development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173` — works on your phone if both devices are on the same WiFi:
`http://YOUR_COMPUTER_IP:5173`

---

## Working together on GitHub

### Repo structure

```
entropy-addict/
├── src/
│   ├── data/           ← CONTENT WRITER WORKS HERE
│   │   ├── npcs.js     ← All NPC archetypes, calls, clues, dialogue
│   │   ├── world.js    ← Locations, encounters, flavour text
│   │   └── masteries.js← Mastery descriptions and fate titles
│   ├── systems/        ← Game logic (npcGenerator.js)
│   ├── components/     ← React UI pieces
│   ├── store/          ← Game state (gameStore.js)
│   └── screens/        ← Full screens (Title, Prologue, World, Combat...)
└── .github/workflows/  ← Auto-deploy on push (do not edit)
```

### Branch workflow

- `main` → stable, auto-deploys to GitHub Pages
- `dev` → working branch, push here during development
- When ready to release: merge `dev` into `main`

```bash
# Start working
git checkout -b dev
git push -u origin dev

# Daily work
git add .
git commit -m "add: new NPC archetype for Blacksmith"
git push

# Release
git checkout main
git merge dev
git push
```

---

## For the content writer (no coding needed)

You only need to edit files in `src/data/`. Everything else is handled by the engine.

### Adding a new NPC archetype — `src/data/npcs.js`

Copy an existing entry in `CALLS` and fill in:

```js
YOUR_NPC_NAME: {
  masteries: ['Blacksmith', 'Physical'],   // two Masteries
  call: 'The Shape Before the Fire',       // poetic label — player sees this immediately
  tier: 3,                                 // 1, 2, or 3
  bodyClues: [
    // Write 4-5 options. Engine picks 2 per run.
    'Burn scars on both forearms, inside and out.',
    'His hands are very wide. The grip never fully relaxes.',
  ],
  behaviourClues: [
    // Write 3-4 options. Engine picks 1-2 per run.
    'He taps metal before he touches it. Listening.',
    'He looks at tools before he looks at the person holding them.',
  ],
  tierClues: [
    // Write 2 options. Engine picks 1.
    'The scars have their own texture. He has been at this for a very long time.',
    'He does not check his work. The work is right.',
  ],
  dialogue: [
    // Write 3 options. Engine picks 1 per run.
    'He does not look up when you arrive.',
    'He asks what you need made. Not who you are.',
  ],
  recruitLine: 'He asks: what is it for?',
  warningSignal: 'He starts working on his own projects instead of the party\'s.',
  relationWeights: { value: 3, debt: 2, demonstration: 4, recognition: 3, words: 2 },
  // Higher number = this currency moves them more
  // value = offerings, debt = help unprompted, demonstration = show competence
  // recognition = see them clearly, words = say the true thing
},
```

### Adding encounter text — `src/data/world.js`

Add entries to `ENCOUNTERS`, `LOCATIONS`, or `TIME_OF_DAY`. All text arrays work the same way — the engine picks randomly.

### Adding dialogue lines

All NPC dialogue, warnings, and recruit lines live in `src/data/npcs.js`. Add more variants to any array to increase variety across runs.

---

## Build phases

| Phase | What it adds | Status |
|-------|-------------|--------|
| 1 — Core | Name, Mastery, Fate title, Ashveld exploration, NPC observation, relation system, basic recruitment | ✅ Done |
| 2 — Combat | Full Breaker/Striker/Anchor combat loop, formation consequences, supply drain | 🔲 Next |
| 3 — Inventory | Tanner → pack → Carrier unlock chain, route memory, supply estimation | 🔲 Planned |
| 4 — Factions | 8 regions, faction contacts, pressure system, Halvec and Orren Vas encounters | 🔲 Planned |

---

## Known Phase 1 limitations

- Combat is stubbed — actions resolve simply, full system comes in Phase 2
- Inventory unlock works logically but supply items are not yet consumed
- Civilisation stage checks run but do not yet gate content
- Root development advances randomly — Phase 2 will tie it to specific tasks
- No icons yet — add `icon-192.png` and `icon-512.png` to `/public/` for full PWA support

---

## Questions

Open a GitHub Issue. That's what they're for.
