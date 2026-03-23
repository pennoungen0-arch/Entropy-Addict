// src/screens/TitleScreen.jsx
import { useGameStore } from '../store/gameStore'

export default function TitleScreen() {
  const { startNewRun, player, screen, setScreen } = useGameStore()
  const hasSave = !!player.name

  return (
    <div className="screen" style={{ justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>

        <p className="system-text" style={{ marginBottom: '0.5rem' }}>
          Throne of the World · Ashveld Flats
        </p>

        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '0.12em' }}>
          ENTROPY ADDICT
        </h1>

        <p className="prose-dim" style={{ marginBottom: '2.5rem', fontStyle: 'italic' }}>
          A survival story dressed as a power fantasy.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button className="btn-primary btn" onClick={startNewRun}>
            New Run
          </button>

          {hasSave && (
            <button className="btn-ghost btn" onClick={() => setScreen('world')}>
              Continue — Day {useGameStore.getState().day}, {player.name}
            </button>
          )}
        </div>

        <p className="system-text" style={{ marginTop: '3rem', opacity: 0.4, fontSize: '0.7rem' }}>
          v0.1.0 · Phase 1
        </p>
      </div>
    </div>
  )
}
