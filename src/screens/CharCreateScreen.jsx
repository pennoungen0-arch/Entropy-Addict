// src/screens/CharCreateScreen.jsx
import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { MASTERIES, MASTERY_FLOW, FATE_TITLES } from '../data/masteries.js'
import { MASTERY_ROLES } from '../data/npcs.js'

const STEPS = ['name', 'primary', 'secondary', 'fate']

export default function CharCreateScreen() {
  const [step, setStep] = useState('name')
  const [name, setName] = useState('')
  const [primaryMastery, setPrimaryMastery] = useState(null)
  const [fateTitle, setFateTitle] = useState(null)

  const { setPlayerName, selectPrimaryMastery, selectSecondaryMastery, setScreen, receiveFateTitle } = useGameStore()

  const combatMasteries = Object.entries(MASTERIES).filter(([, m]) => m.type === 'combat')
  const auxMasteries = Object.entries(MASTERIES).filter(([, m]) => m.type === 'auxiliary')

  // Secondary mastery options — filtered by what pairs make sense
  const getSecondaryOptions = () => {
    if (!primaryMastery) return []
    // If primary is combat, show all remaining masteries
    // If primary is auxiliary, show only compatible secondaries
    const primary = MASTERIES[primaryMastery]
    if (primary.type === 'combat') {
      return Object.entries(MASTERIES).filter(([k]) => k !== primaryMastery)
    }
    // Auxiliary primaries pair with Mind or Physical for a hybrid role
    return Object.entries(MASTERIES).filter(
      ([k]) => k !== primaryMastery && (k === 'Mind' || k === 'Physical')
    )
  }

  const deriveFateTitle = (primary, secondary) => {
    const key1 = `${primary}+${secondary}`
    const key2 = `${secondary}+${primary}`
    const titles = FATE_TITLES[key1] || FATE_TITLES[key2] || ['The Unnamed']
    return titles[Math.floor(Math.random() * titles.length)]
  }

  const deriveRole = (primary, secondary) => {
    const key1 = `${primary}+${secondary}`
    const key2 = `${secondary}+${primary}`
    return MASTERY_ROLES[key1] || MASTERY_ROLES[key2] || { role: 'Auxiliary', description: '' }
  }

  const handleNameSubmit = () => {
    if (name.trim().length < 1) return
    setPlayerName(name.trim())
    setStep('primary')
  }

  const handlePrimarySelect = (mastery) => {
    setPrimaryMastery(mastery)
    selectPrimaryMastery(mastery)
    setStep('secondary')
  }

  const handleSecondarySelect = (secondary) => {
    const title = deriveFateTitle(primaryMastery, secondary)
    const roleData = deriveRole(primaryMastery, secondary)
    setFateTitle(title)
    selectSecondaryMastery(secondary, title, roleData.role)
    setStep('fate')
  }

  const handleBegin = () => {
    receiveFateTitle()
    setScreen('world')
  }

  return (
    <div className="screen">
      <div className="screen-scroll">

        {/* STEP: NAME */}
        {step === 'name' && (
          <div className="fade-in" style={{ paddingTop: '1rem' }}>
            <p className="system-text" style={{ marginBottom: '0.5rem' }}>Character</p>
            <h2 style={{ marginBottom: '1.5rem' }}>
              You are not Jarger Schamer. You have the same knowledge. The same edge. Your name is your own.
            </h2>
            <p className="prose-dim" style={{ marginBottom: '1.5rem' }}>
              The system will register whatever you give it.
            </p>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                placeholder="Your name"
                maxLength={32}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* STEP: PRIMARY MASTERY */}
        {step === 'primary' && (
          <div className="fade-in">
            <p className="system-text" style={{ marginBottom: '0.5rem' }}>Mastery — Primary</p>
            <h2 style={{ marginBottom: '0.5rem' }}>
              {MASTERY_FLOW.step1_prompt}
            </h2>
            <p className="prose-dim" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              This is not a class. It is an observation.
            </p>

            <div className="divider-text">Combat</div>
            {combatMasteries.map(([key, mastery]) => (
              <button key={key} className="card" style={{ cursor: 'pointer', marginBottom: '0.5rem', textAlign: 'left' }}
                onClick={() => handlePrimarySelect(key)}>
                <div style={{ fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text)' }}>{key}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text2)' }}>{mastery.description}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: '0.3rem', fontStyle: 'italic' }}>{mastery.bodyResult}</div>
              </button>
            ))}

            <div className="divider-text">Auxiliary</div>
            {auxMasteries.map(([key, mastery]) => (
              <button key={key} className="card" style={{ cursor: 'pointer', marginBottom: '0.5rem', textAlign: 'left' }}
                onClick={() => handlePrimarySelect(key)}>
                <div style={{ fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text)' }}>{key}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text2)' }}>{mastery.description}</div>
              </button>
            ))}
          </div>
        )}

        {/* STEP: SECONDARY MASTERY */}
        {step === 'secondary' && (
          <div className="fade-in">
            <p className="system-text" style={{ marginBottom: '0.5rem' }}>Mastery — Secondary</p>
            <h2 style={{ marginBottom: '0.5rem' }}>
              {MASTERY_FLOW.step2_prompt}
            </h2>
            <p className="prose-dim" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Primary: <span style={{ color: 'var(--gold)' }}>{primaryMastery}</span>
            </p>
            <p className="prose-dim" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              The first choice shapes the second.
            </p>

            {getSecondaryOptions().map(([key, mastery]) => {
              const roleData = deriveRole(primaryMastery, key)
              return (
                <button key={key} className="card" style={{ cursor: 'pointer', marginBottom: '0.5rem', textAlign: 'left' }}
                  onClick={() => handleSecondarySelect(key)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{key}</span>
                    {roleData && (
                      <span className="tier-badge">{roleData.role}</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text2)' }}>{mastery.description}</div>
                  {roleData && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: '0.3rem' }}>{roleData.description}</div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* STEP: FATE TITLE */}
        {step === 'fate' && (
          <div className="fade-in">
            <p className="system-text" style={{ marginBottom: '1.5rem' }}>
              [ Fate Title Generated ]
            </p>

            <div className="card card-accent" style={{ textAlign: 'center', padding: '2rem 1rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: '0.75rem', fontFamily: 'var(--font-ui)' }}>
                {useGameStore.getState().player.name}
              </p>
              <h1 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>
                {fateTitle}
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>
                {primaryMastery} · {useGameStore.getState().player.secondaryMastery}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: '0.25rem' }}>
                {deriveRole(primaryMastery, useGameStore.getState().player.secondaryMastery)?.role}
              </p>
            </div>

            <div className="system-notification">
              In the game data, this title appears in the late-arc NPC list. You are building yourself into the person you were supposed to defeat.
            </div>

            <p className="prose-dim" style={{ marginTop: '1rem' }}>
              You finish your push-ups.
            </p>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div className="screen-footer">
        {step === 'name' && (
          <button
            className="btn-primary btn"
            onClick={handleNameSubmit}
            disabled={name.trim().length < 1}
            style={{ opacity: name.trim().length < 1 ? 0.4 : 1 }}
          >
            This is my name
          </button>
        )}
        {step === 'fate' && (
          <button className="btn-primary btn" onClick={handleBegin}>
            The sky has decided. Start thinking.
          </button>
        )}
      </div>
    </div>
  )
}
