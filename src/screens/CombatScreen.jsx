// src/screens/CombatScreen.jsx
import { useGameStore } from '../store/gameStore'

export default function CombatScreen() {
  const { combat, combatAction, player, party } = useGameStore()

  if (!combat) return null

  const { round, phase, playerTeam, enemies, log, window: strikerWindow, formationIntact } = combat

  const aliveEnemies = enemies.filter((e) => e.hp > 0)
  const playerAlive = playerTeam.some((p) => p.hp > 0)

  const hasBreaker = playerTeam.some((p) => p.role === 'Breaker')
  const hasAnchor = playerTeam.some((p) => p.role === 'Anchor')

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="system-text">Round {round}</span>
          <span style={{ color: strikerWindow ? 'var(--gold)' : 'var(--text3)', fontFamily: 'var(--font-ui)', fontSize: '0.8rem' }}>
            {strikerWindow ? '[ WINDOW OPEN ]' : '[ READING ]'}
          </span>
          <span className="system-text">{phase.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="screen-scroll">

        {/* Enemy side */}
        <div style={{ marginBottom: '1rem' }}>
          <p className="system-text" style={{ marginBottom: '0.5rem' }}>Threat</p>
          {aliveEnemies.map((enemy) => (
            <div key={enemy.id} className="card" style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{enemy.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{enemy.hp}/{enemy.maxHp}</span>
              </div>
              <div className="combat-hp-bar">
                <div className="combat-hp-fill" style={{
                  width: `${(enemy.hp / enemy.maxHp) * 100}%`,
                  background: enemy.hp / enemy.maxHp < 0.3 ? 'var(--danger2)' : 'var(--danger)',
                }} />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: '0.3rem' }}>{enemy.description}</p>
            </div>
          ))}
        </div>

        {/* Formation side */}
        <div style={{ marginBottom: '1rem' }}>
          <p className="system-text" style={{ marginBottom: '0.5rem' }}>Formation</p>
          {playerTeam.map((member) => (
            <div key={member.name} className="card" style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 600, color: member.name === player.name ? 'var(--gold)' : 'var(--text)' }}>
                  {member.name}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="tier-badge">{member.role || member.fieldRole}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{member.hp}/{member.maxHp}</span>
                </div>
              </div>
              <div className="combat-hp-bar">
                <div className={`combat-hp-fill ${member.hp / member.maxHp < 0.3 ? 'low' : ''}`}
                  style={{ width: `${(member.hp / member.maxHp) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Combat log */}
        <div className="combat-log">
          {[...log].reverse().map((entry, i) => (
            <p key={i} style={{ marginBottom: '0.2rem', opacity: 1 - i * 0.15 }}>{entry}</p>
          ))}
        </div>

        {/* Formation integrity note */}
        {!formationIntact && (
          <div className="system-notification" style={{ color: 'var(--danger2)' }}>
            Formation compromised. The shape is broken.
          </div>
        )}

        {strikerWindow && (
          <div className="system-notification fade-in">
            [ The window is open. Enter now or it closes. ]
          </div>
        )}

      </div>

      {/* Action footer */}
      <div className="screen-footer">
        {phase === 'player_turn' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {hasBreaker && !strikerWindow && (
              <button className="btn" onClick={() => combatAction({ type: 'breaker_engage' })}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Breaker: engage</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Draw contact. Open the gap.</div>
              </button>
            )}
            {strikerWindow && (
              <button className="btn-primary btn" onClick={() => combatAction({ type: 'striker_enter' })}>
                <div style={{ fontWeight: 600 }}>Enter the window</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.6)' }}>You read the variable. Strike now.</div>
              </button>
            )}
            {!strikerWindow && (
              <button className="btn-ghost btn" onClick={() => combatAction({ type: 'striker_enter' })}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Striker: read and enter</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Without the window, timing is everything.</div>
              </button>
            )}
            {hasAnchor && (
              <button className="btn" onClick={() => combatAction({ type: 'anchor_hold' })}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Anchor: hold the shape</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Protect the formation. Control the pace.</div>
              </button>
            )}
            <button className="btn-ghost btn" onClick={() => combatAction({ type: 'end_turn' })}>
              End turn
            </button>
          </div>
        )}

        {phase === 'enemy_turn' && (
          <p className="system-text" style={{ textAlign: 'center', padding: '0.5rem' }}>
            The enemy moves...
          </p>
        )}
      </div>
    </div>
  )
}
