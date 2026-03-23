// src/components/NPCObservePanel.jsx
// What the player sees BEFORE the NPC joins.
// Call visible. Body clues visible. Behaviour clues unlock with observation.
// Mastery, tier, and full data are NOT shown here.

import { useState } from 'react'
import { RELATION_CURRENCIES } from '../data/npcs.js'

export default function NPCObservePanel({ npc, relations, onObserve, onRelationAction, onApproach, onBack }) {
  const [observeCount, setObserveCount] = useState(0)
  const [actionFeedback, setActionFeedback] = useState(null)

  if (!npc) return null

  const rel = relations[npc.id] || { total: 0, stage: 'stranger' }
  const relationPercent = Math.min(100, (rel.total / 20) * 100)
  const canApproach = rel.stage === 'recruit_ready' || rel.total >= 15

  const visibleBehaviourClues = npc.shownBehaviourClues?.slice(0, Math.min(observeCount + 1, npc.shownBehaviourClues?.length || 1)) || []

  const handleObserve = () => {
    setObserveCount((c) => Math.min(c + 1, (npc.shownBehaviourClues?.length || 1)))
    onObserve(npc.id)
    onRelationAction(npc.id, 'demonstration') // watching counts as mild relation building
  }

  const handleAction = (currency) => {
    onRelationAction(npc.id, currency)
    setActionFeedback(RELATION_CURRENCIES[currency].description)
    setTimeout(() => setActionFeedback(null), 2000)
  }

  return (
    <div className="fade-in">
      {/* Back */}
      <button className="btn-ghost btn" style={{ marginBottom: '1rem', width: 'auto', padding: '0.4rem 0.75rem', minHeight: 'unset' }}
        onClick={onBack}>
        ← Back
      </button>

      {/* Call — always visible */}
      <div className="card card-accent" style={{ marginBottom: '1rem' }}>
        <p className="system-text" style={{ marginBottom: '0.3rem' }}>Call</p>
        <p className="call-text" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          "{npc.call}"
        </p>
        <p className="prose-dim" style={{ fontSize: '0.85rem' }}>
          {npc.ageDescriptor} · {npc.buildDescriptor}
        </p>
      </div>

      {/* Relation meter */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
          <span className="system-text">Relation</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text3)', fontFamily: 'var(--font-ui)' }}>
            {rel.stage}
          </span>
        </div>
        <div className="relation-bar">
          <div className="relation-bar-fill" style={{ width: `${relationPercent}%` }} />
        </div>
      </div>

      {/* Body clues — always visible */}
      <div className="card" style={{ marginBottom: '0.75rem' }}>
        <p className="system-text" style={{ marginBottom: '0.5rem' }}>Physical</p>
        {npc.shownBodyClues?.map((clue, i) => (
          <div key={i} className="clue">
            {clue}
          </div>
        ))}
      </div>

      {/* Behaviour clues — unlock with observation */}
      <div className="card" style={{ marginBottom: '0.75rem' }}>
        <p className="system-text" style={{ marginBottom: '0.5rem' }}>
          Behaviour {observeCount === 0 && <span style={{ color: 'var(--text3)' }}>— watch to reveal</span>}
        </p>
        {visibleBehaviourClues.map((clue, i) => (
          <div key={i} className="clue fade-in">
            {clue}
          </div>
        ))}
        {observeCount > 0 && npc.shownTierClue && (
          <div className="clue fade-in" style={{ color: 'var(--text2)', fontStyle: 'italic' }}>
            {npc.shownTierClue}
          </div>
        )}
      </div>

      {/* Opening dialogue — appears after first observation */}
      {observeCount > 0 && (
        <div className="card fade-in" style={{ marginBottom: '0.75rem' }}>
          <p className="system-text" style={{ marginBottom: '0.5rem' }}>Encounter</p>
          <p className="prose" style={{ fontSize: '0.95rem' }}>
            {npc.openingDialogue}
          </p>
        </div>
      )}

      {/* Relation actions */}
      <div className="divider-text">Build relation</div>

      {actionFeedback && (
        <div className="system-notification fade-in" style={{ marginBottom: '0.75rem' }}>
          {actionFeedback}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        <button className="btn" onClick={() => handleAction('value')}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>Offer something</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Food, intelligence, protection</div>
        </button>
        <button className="btn" onClick={() => handleAction('debt')}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>Help without being asked</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Create debt. They do not forget.</div>
        </button>
        <button className="btn" onClick={() => handleAction('demonstration')}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>Do something competent</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>In front of them. They reassess.</div>
        </button>
        <button className="btn" onClick={() => handleAction('recognition')}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>See them clearly</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Act on what the Call tells you. If you are right, they notice.</div>
        </button>
        <button className="btn" onClick={() => handleAction('words')}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>Say the true thing</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Not charm. One honest sentence at the right moment.</div>
        </button>
      </div>

      <button className="btn" onClick={handleObserve}>
        Watch longer
      </button>
    </div>
  )
}
