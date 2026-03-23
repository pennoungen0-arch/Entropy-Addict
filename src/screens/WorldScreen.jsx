// src/screens/WorldScreen.jsx
import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { generateNPC, generateRunNPCs, generateEnemies } from '../systems/npcGenerator'
import { LOCATIONS, TIME_OF_DAY, ENCOUNTERS } from '../data/world.js'
import NPCObservePanel from '../components/NPCObservePanel'
import NPCApproachPanel from '../components/NPCApproachPanel'

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export default function WorldScreen() {
  const {
    player, party, discoveredNPCs, day, timeOfDay,
    setScreen, discoverNPC, observeNPC, addRelation,
    recruitNPC, relations, advanceTime, advanceDay,
    inventory, flags, civStage, startCombat,
  } = useGameStore()

  const [view, setView] = useState('explore')  // explore | observe | approach | party | inventory | notes
  const [location, setLocation] = useState(() => pick(LOCATIONS))
  const [encounter, setEncounter] = useState(null)
  const [actionLog, setActionLog] = useState([
    `Day ${day}. ${pick(TIME_OF_DAY[timeOfDay])} The Ashveld Flats. Inventory: ${inventory.locked ? 'locked' : 'active'}.`,
  ])

  const log = (text) => setActionLog((prev) => [text, ...prev].slice(0, 20))

  // Generate initial run NPCs if none exist
  useEffect(() => {
    if (discoveredNPCs.length === 0 && party.length === 0) {
      const runNPCs = generateRunNPCs()
      // Don't discover them all immediately — they'll appear through exploration
      useGameStore.setState({ _runNPCPool: runNPCs })
    }
  }, [])

  const handleExplore = () => {
    const newLocation = pick(LOCATIONS)
    setLocation(newLocation)
    advanceTime()

    // Check for encounter
    const roll = Math.random()
    const pool = useGameStore.getState()._runNPCPool || []
    const undiscovered = pool.filter(
      (n) => !discoveredNPCs.find((d) => d.id === n.id) && !party.find((p) => p.id === n.id)
    )

    if (roll < 0.4 && undiscovered.length > 0) {
      // NPC encounter
      const npc = undiscovered[Math.floor(Math.random() * undiscovered.length)]
      const encounterText = pick(ENCOUNTERS.NPC_ALONE.setup)
      setEncounter({ type: 'npc', npc, text: encounterText })
      log(encounterText)
    } else if (roll < 0.55 && day > 3) {
      // Combat encounter
      const enemies = generateEnemies(1, Math.floor(Math.random() * 2) + 1)
      const text = pick(ENCOUNTERS.THREAT_APPROACH.setup)
      setEncounter({ type: 'combat', enemies, text })
      log(text)
    } else if (roll < 0.7) {
      // Map divergence
      const text = pick(ENCOUNTERS.MAP_DIVERGENCE.setup)
      log(text)
      setEncounter({ type: 'mystery', text })
    } else {
      log(`${pick(newLocation.descriptions)}`)
      setEncounter(null)
    }
  }

  const handleDiscoverNPC = () => {
    if (!encounter?.npc) return
    discoverNPC(encounter.npc)
    setView('observe')
    setEncounter(null)
  }

  const handleObserve = (npcId) => {
    observeNPC(npcId)
    log('You watch. Time passes.')
  }

  const handleRelationAction = (npcId, currency) => {
    addRelation(npcId, currency, 2)
    log(`You ${currency === 'value' ? 'offer something' : currency === 'debt' ? 'help without being asked' : currency === 'demonstration' ? 'handle something well' : currency === 'recognition' ? 'see them clearly' : 'say the true thing'}.`)
  }

  const handleCombatEncounter = () => {
    if (!encounter?.enemies) return
    startCombat(encounter.enemies)
    setEncounter(null)
  }

  const handlePassDay = () => {
    advanceDay()
    log(`Day ${day + 1}. ${pick(TIME_OF_DAY.dawn)}`)
    setEncounter(null)

    // Check departure warnings
    party.forEach((npc) => {
      const rel = relations[npc.id]
      if (rel && rel.total < 5 && !npc.departureWarning) {
        useGameStore.getState().triggerDepartureWarning(npc.id)
        log(`${npc.name}: ${npc.warningSignal}`)
      }
    })
  }

  const activeNPC = view === 'observe' || view === 'approach'
    ? discoveredNPCs[0]
    : null

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-ui)', fontSize: '0.8rem' }}>
            {player.name}
          </span>
          <span className="system-text" style={{ marginLeft: '0.75rem' }}>
            Day {day} · {timeOfDay} · {civStage}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {party.some((n) => n.departureWarning) && (
            <span style={{ color: 'var(--danger2)', fontSize: '0.75rem', fontFamily: 'var(--font-ui)' }}>⚠</span>
          )}
          <span className="system-text">
            {inventory.locked ? '📦 locked' : '📦 active'}
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        {['explore', 'party', 'inventory'].map((tab) => (
          <button key={tab}
            onClick={() => setView(tab)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              borderBottom: view === tab ? '2px solid var(--gold)' : '2px solid transparent',
              borderRadius: 0,
              color: view === tab ? 'var(--gold)' : 'var(--text3)',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              padding: '0.6rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              minHeight: 'unset',
              cursor: 'pointer',
            }}
          >
            {tab}
            {tab === 'party' && party.length > 0 && ` (${party.length})`}
          </button>
        ))}
      </div>

      <div className="screen-scroll">

        {/* EXPLORE VIEW */}
        {view === 'explore' && (
          <div className="fade-in">
            {/* Location */}
            <div className="card" style={{ marginBottom: '0.75rem' }}>
              <p className="system-text" style={{ marginBottom: '0.3rem' }}>{location.name}</p>
              <p className="prose-dim" style={{ fontSize: '0.95rem' }}>
                {pick(location.descriptions)}
              </p>
            </div>

            {/* Active encounter */}
            {encounter && (
              <div className="card card-accent fade-in" style={{ marginBottom: '0.75rem' }}>
                <p className="prose" style={{ marginBottom: '0.75rem' }}>{encounter.text}</p>
                {encounter.type === 'npc' && (
                  <button onClick={handleDiscoverNPC} className="btn">
                    Approach and observe
                  </button>
                )}
                {encounter.type === 'combat' && (
                  <button onClick={handleCombatEncounter} className="btn btn-danger">
                    Engage
                  </button>
                )}
                {encounter.type === 'mystery' && (
                  <button onClick={() => { useGameStore.getState().addNote(encounter.text); setEncounter(null); log('Noted.') }} className="btn-ghost btn">
                    Note the coordinates
                  </button>
                )}
              </div>
            )}

            {/* Discovered NPCs waiting */}
            {discoveredNPCs.length > 0 && (
              <>
                <div className="divider-text">Observed</div>
                {discoveredNPCs.map((npc) => {
                  const rel = relations[npc.id] || {}
                  return (
                    <button key={npc.id} className="card" style={{ cursor: 'pointer', textAlign: 'left' }}
                      onClick={() => { useGameStore.getState().setActiveNPC(npc); setView('observe') }}>
                      <div className="card-header">
                        <span className="call-text">{npc.call}</span>
                        <span className="tier-badge">{rel.stage || 'stranger'}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>{npc.name}</p>
                      <div className="relation-bar">
                        <div className="relation-bar-fill" style={{ width: `${Math.min(100, ((rel.total || 0) / 20) * 100)}%` }} />
                      </div>
                    </button>
                  )
                })}
              </>
            )}

            {/* Action log */}
            <div className="divider-text">Log</div>
            {actionLog.map((entry, i) => (
              <p key={i} className="prose-dim" style={{ fontSize: '0.85rem', opacity: 1 - i * 0.08, marginBottom: '0.3rem' }}>
                {entry}
              </p>
            ))}
          </div>
        )}

        {/* OBSERVE VIEW */}
        {view === 'observe' && (
          <NPCObservePanel
            npc={useGameStore.getState().activeNPC || discoveredNPCs[0]}
            relations={relations}
            onObserve={handleObserve}
            onRelationAction={handleRelationAction}
            onApproach={() => setView('approach')}
            onBack={() => setView('explore')}
          />
        )}

        {/* APPROACH / RECRUIT VIEW */}
        {view === 'approach' && (
          <NPCApproachPanel
            npc={useGameStore.getState().activeNPC || discoveredNPCs[0]}
            relations={relations}
            onRecruit={(id) => {
              const success = recruitNPC(id)
              if (success) {
                log(`${useGameStore.getState().activeNPC?.name} joins.`)
                setView('explore')
              } else {
                log('Not yet.')
              }
            }}
            onBack={() => setView('observe')}
          />
        )}

        {/* PARTY VIEW */}
        {view === 'party' && (
          <div className="fade-in">
            <p className="system-text" style={{ marginBottom: '1rem' }}>
              Formation · {civStage}
            </p>

            {/* Formation display */}
            <div className="formation-grid">
              {['Breaker', 'Striker', 'Anchor'].map((role) => {
                const member = party.find((n) => n.fieldRole === role)
                const isPlayer = role === player.fieldRole
                return (
                  <div key={role} className={`formation-slot ${member || isPlayer ? 'filled' : 'empty'}`}>
                    <span className="formation-slot-role">{role}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>
                      {isPlayer ? player.name : member ? member.name : '—'}
                    </span>
                  </div>
                )
              })}
            </div>

            {party.length === 0 ? (
              <p className="prose-dim" style={{ textAlign: 'center', padding: '2rem 0' }}>
                No one has joined yet.
              </p>
            ) : (
              <>
                <div className="divider-text">Party</div>
                {party.map((npc) => (
                  <div key={npc.id} className={`card ${npc.departureWarning ? 'card-danger' : ''}`}>
                    <div className="party-slot" style={{ padding: 0, border: 'none' }}>
                      <div className={`party-slot-icon ${npc.departureWarning ? 'warning' : ''}`}>
                        {npc.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{npc.name}</span>
                          <span className="tier-badge">T{npc.tier} · {npc.rootStage}</span>
                        </div>
                        <div className="call-text" style={{ fontSize: '0.85rem' }}>{npc.call}</div>
                        {npc.fullDataVisible && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: '0.25rem' }}>
                            {npc.masteries.join(' · ')} · {npc.fieldRole}
                          </div>
                        )}
                        {npc.departureWarning && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--danger2)', marginTop: '0.3rem' }}>
                            {npc.warningSignal}
                          </div>
                        )}
                      </div>
                    </div>
                    {npc.departureWarning && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                        <button className="btn" style={{ fontSize: '0.8rem', minHeight: 36, padding: '0.4rem 0.75rem' }}
                          onClick={() => { addRelation(npc.id, 'recognition', 5); log(`You see ${npc.name} clearly.`) }}>
                          Address it
                        </button>
                        <button className="btn btn-ghost" style={{ fontSize: '0.8rem', minHeight: 36, padding: '0.4rem 0.75rem' }}
                          onClick={() => { useGameStore.getState().departNPC(npc.id); log(`${npc.name} leaves.`) }}>
                          Let them go
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* INVENTORY VIEW */}
        {view === 'inventory' && (
          <div className="fade-in">
            <p className="system-text" style={{ marginBottom: '1rem' }}>Inventory</p>
            {inventory.locked ? (
              <div className="inventory-locked">
                <div className="system-notification">
                  <strong>[ SYSTEM ]</strong><br />
                  Inventory Status: LOCKED<br />
                  Reason: No qualified Carrier in active party<br />
                  Prerequisite: Carrier with crafted load-bearing pack (Tanner/Weaver Mastery, min. Routine level)
                </div>
                <p className="prose-dim" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                  Find a Tanner. Commission the pack. Find a Carrier. The order matters.
                </p>
              </div>
            ) : (
              <div>
                <div className="system-notification">
                  <strong>[ SYSTEM ]</strong> Inventory: ACTIVE · Route memory: {
                    party.find((n) => n.masteries?.includes('Carrier'))?.rootStage || 'Habit'
                  }
                </div>
                {inventory.items.length === 0 ? (
                  <p className="prose-dim" style={{ textAlign: 'center', padding: '2rem 0' }}>Nothing carried yet.</p>
                ) : (
                  inventory.items.map((item, i) => (
                    <div key={i} className="card">
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>{item.description}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer actions */}
      <div className="screen-footer">
        {view === 'explore' && (
          <div className="btn-row">
            <button className="btn-primary btn" onClick={handleExplore}>
              Move through the Flats
            </button>
            <button className="btn-ghost btn" style={{ flex: '0 0 auto', width: 'auto', padding: '0.6rem 1rem' }}
              onClick={handlePassDay}>
              Rest
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
