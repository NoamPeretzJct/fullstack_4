import { useState } from 'react'
import './AdvancedPanel.css'

function AdvancedPanel({
  searchQuery,
  onSearchChange,
  onReplace,
  onUndo,
  canUndo,
}) {
  const [findChar, setFindChar] = useState('')
  const [replaceChar, setReplaceChar] = useState('')

  return (
    <div className="advanced-panel">
      <span className="panel-label">Advanced</span>

      <div className="advanced-panel__group">
        <span className="advanced-panel__group-label">Search</span>
        
        {/* העטיפה החדשה שמאגדת את החיפוש וה-Undo יחד */}
        <div className="advanced-panel__search-row">
          <input
            className="advanced-panel__input"
            maxLength={1}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="search"
          />
          
          <button
            className={`advanced-panel__btn advanced-panel__btn--undo ${!canUndo ? 'advanced-panel__btn--disabled' : ''}`}
            onClick={onUndo}
            disabled={!canUndo}
          >
            <span className="advanced-panel__undo-icon">↩</span>
            Undo
          </button>
        </div>
      </div>

      <div className="advanced-panel__group">
        <span className="advanced-panel__group-label">Replace</span>
        <div className="advanced-panel__replace-row">
          <input
            className="advanced-panel__input"
            maxLength={1}
            value={findChar}
            onChange={(e) => setFindChar(e.target.value)}
            placeholder="find"
          />
          <span className="advanced-panel__arrow">→</span>
          <input
            className="advanced-panel__input"
            maxLength={1}
            value={replaceChar}
            onChange={(e) => setReplaceChar(e.target.value)}
            placeholder="new"
          />
          <button
            className="advanced-panel__btn"
            onClick={() => onReplace(findChar, replaceChar)}
          >
            Replace
          </button>
        </div>
      </div>

    </div>
  )
}

export default AdvancedPanel
