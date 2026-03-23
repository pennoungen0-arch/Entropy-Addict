// src/screens/PrologueScreen.jsx
import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

const PROLOGUE_BEATS = [
  {
    id: 'loading',
    system: true,
    text: null,
    systemText: 'Loading: 97%',
  },
  {
    id: 'apartment',
    text: 'The apartment smelled the same as it always smelled. Closed windows and the particular staleness of a space that gets used without being inhabited.',
  },
  {
    id: 'beer',
    text: 'You opened the beer before you took your shoes off. The hand knew where to go.',
  },
  {
    id: 'noodles',
    text: 'You reached for the instant noodles. Your hand found the cupboard, found the shelf, found nothing. You stood in front of the open cupboard for a moment. Then closed the door.',
  },
  {
    id: 'laptop',
    text: 'The laptop opened the same way the beer opened. Without deciding to. The loading screen. The mountain. The bar at 97% where it always stalled.',
  },
  {
    id: 'quiet',
    text: 'The quiet got in. Not through one clear memory. Through accumulation. The unread message. The folded paper with the plans in the correct order. The version of yourself you could almost see.',
  },
  {
    id: 'chest',
    text: 'Your chest did something. You had been attributing it to tiredness. You thought: not tonight. You thought: the mountain. You thought —',
  },
  {
    id: 'white',
    system: true,
    text: null,
    systemText: 'Loading: 98% · 99% · 100%',
  },
  {
    id: 'spawn',
    text: 'You were on your back. Cracked clay under your shoulders. A sky above you that was the exact shade of pale the game used for dawn in the badlands.',
  },
  {
    id: 'smell',
    text: 'You could smell the earth. That was not in the preview.',
  },
  {
    id: 'verify',
    text: 'You sat up. The Ashveld Flats. Exactly as described. You needed to verify the system before you built anything on top of the assumption that it worked.',
  },
  {
    id: 'pushups',
    text: 'You got down on the cracked clay and started doing push-ups. Not because something had shifted inside you. You were running a diagnostic.',
  },
  {
    id: 'system',
    system: true,
    text: null,
    systemText: 'Habit In Development: Physical Conditioning +1',
  },
  {
    id: 'right',
    text: 'You finished the set at fifteen. You stood. You brushed the clay from your palms. You looked at the mountain.',
  },
  {
    id: 'final',
    isLast: true,
    text: '"Right," you said.',
  },
]

export default function PrologueScreen() {
  const [beatIndex, setBeatIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const setScreen = useGameStore((s) => s.setScreen)

  const beat = PROLOGUE_BEATS[beatIndex]

  const advance = () => {
    if (beat.isLast) {
      setScreen('charCreate')
      return
    }
    setVisible(false)
    setTimeout(() => {
      setBeatIndex((i) => i + 1)
      setVisible(true)
    }, 200)
  }

  // Auto-advance system beats
  useEffect(() => {
    if (beat.system) {
      const t = setTimeout(advance, 1800)
      return () => clearTimeout(t)
    }
  }, [beatIndex])

  return (
    <div
      className="screen"
      style={{ justifyContent: 'center', padding: '2rem', cursor: 'pointer' }}
      onClick={beat.system ? undefined : advance}
    >
      <div
        style={{
          maxWidth: 480,
          width: '100%',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        {beat.system ? (
          <p className="system-text" style={{ color: 'var(--text3)' }}>
            [ {beat.systemText} ]
          </p>
        ) : (
          <p className="prose" style={{ fontSize: '1.05rem', lineHeight: 1.85 }}>
            {beat.text}
          </p>
        )}

        {!beat.system && (
          <p
            className="system-text"
            style={{ marginTop: '2rem', opacity: 0.3 }}
          >
            {beat.isLast ? 'tap to begin' : 'tap to continue'}
          </p>
        )}
      </div>

      {/* Progress dots */}
      <div style={{ position: 'absolute', bottom: '2rem', display: 'flex', gap: '4px' }}>
        {PROLOGUE_BEATS.map((b, i) => (
          <div
            key={b.id}
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: i === beatIndex ? 'var(--gold)' : 'var(--border2)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
