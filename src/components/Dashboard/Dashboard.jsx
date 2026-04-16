import { useState } from 'react'
import AdvancedPanel from './AdvancedPanel/AdvancedPanel'
import DeletePanel from './DeletePanel/DeletePanel'
import KeyboardArea from './KeyboardArea/KeyboardArea'
import StylePanel from './StylePanel/StylePanel'
import './Dashboard.css'

const initialStyle = {
  color: '#000000',
  fontSize: '16px',
  fontFamily: 'Arial',
}

function Dashboard({
  onApplyStyleToAll,
  onDeleteChar,
  onDeleteWord,
  onClearAll,
  onAddCharacter,
  searchQuery,
  onSearchChange,
  onReplace,
  onUndo,
  canUndo,
}) {
  const [currentStyle, setCurrentStyle] = useState(initialStyle)
  const [applyMode, setApplyMode] = useState('forward')

  function handleStyleChange(key, value) {
    setCurrentStyle((prev) => ({ ...prev, [key]: value }))

    if (applyMode === 'all') {
      onApplyStyleToAll(key, value)
    }
  }

  function handleAddCharacter(char) {
    onAddCharacter(char, currentStyle)
  }

  return (
    <footer className="dashboard">
      <div className="dashboard__box dashboard__box--left">
        <StylePanel
          currentStyle={currentStyle}
          onStyleChange={handleStyleChange}
          applyMode={applyMode}
          onModeChange={setApplyMode}
        />
        <DeletePanel
          onDeleteChar={onDeleteChar}
          onDeleteWord={onDeleteWord}
          onClearAll={onClearAll}
        />
      </div>

      <div className="dashboard__box dashboard__box--center">
        <KeyboardArea onAddCharacter={handleAddCharacter} />
      </div>

      <div className="dashboard__box dashboard__box--right">
        <AdvancedPanel
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onReplace={onReplace}
          onUndo={onUndo}
          canUndo={canUndo}
        />
      </div>
    </footer>
  )
}

export default Dashboard
