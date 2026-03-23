// src/App.jsx
import { useGameStore } from './store/gameStore'
import TitleScreen from './screens/TitleScreen'
import PrologueScreen from './screens/PrologueScreen'
import CharCreateScreen from './screens/CharCreateScreen'
import WorldScreen from './screens/WorldScreen'
import CombatScreen from './screens/CombatScreen'

export default function App() {
  const screen = useGameStore((s) => s.screen)

  return (
    <>
      {screen === 'title'      && <TitleScreen />}
      {screen === 'prologue'   && <PrologueScreen />}
      {screen === 'charCreate' && <CharCreateScreen />}
      {screen === 'world'      && <WorldScreen />}
      {screen === 'combat'     && <CombatScreen />}
    </>
  )
}
