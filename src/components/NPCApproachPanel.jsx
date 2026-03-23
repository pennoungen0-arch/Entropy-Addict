// src/components/NPCApproachPanel.jsx
// The recruitment moment. NPC evaluates the player back.
// They ask what you are building. They decide.

export default function NPCApproachPanel({ npc, relations, onRecruit, onBack }) {
  if (!npc) return null

  const rel = relations[npc.id] || { total: 0, stage: 'stranger' }
  const isReady = rel.total >= 15
  const isStranger = rel.total < 5

  return (
    <div className="fade-in">
      <button className="btn-ghost btn" style={{ marginBottom: '1rem', width: 'auto', padding: '0.4rem 0.75rem', minHeight: 'unset' }}
        onClick={onBack}>
        ← Back
      </button>

      <div className="card card-accent" style={{ marginBottom: '1rem' }}>
        <p className="call-text" style={{ marginBottom: '0.5rem' }}>"{npc.call}"</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text2)' }}>{npc.name}</p>
      </div>

      {isStranger && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <p className="prose">
            You have not built enough for this conversation to mean anything yet.
          </p>
          <p className="prose-dim" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            They pull back without explanation. The relation is not there.
          </p>
        </div>
      )}

      {!isStranger && !isReady && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <p className="prose" style={{ marginBottom: '0.75rem' }}>
            {npc.recruitLine}
          </p>
          <p className="prose-dim" style={{ fontSize: '0.9rem' }}>
            They are not ready. Something is missing from what you have given them.
            You cannot tell what. Read the clues again.
          </p>
          <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'var(--bg3)', borderRadius: '4px' }}>
            <span className="system-text">Relation: {Math.round(rel.total)}/20 · {rel.stage}</span>
          </div>
        </div>
      )}

      {isReady && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <p className="prose" style={{ marginBottom: '1rem' }}>
            {npc.recruitLine}
          </p>
          <p className="prose-dim" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            They are weighing something. The relation is there.
            The decision is theirs.
          </p>
        </div>
      )}

      {isReady && (
        <button className="btn-primary btn" onClick={() => onRecruit(npc.id)}>
          Make the offer
        </button>
      )}

      {!isReady && (
        <button className="btn-ghost btn" onClick={onBack}>
          Step back. Build more.
        </button>
      )}
    </div>
  )
}
