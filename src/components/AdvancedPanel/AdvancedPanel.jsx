import { useState } from 'react'

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
    <div
      style={{
        display: 'flex',
        gap: '20px',
        padding: '10px',
        background: '#e6f7ff',
        borderRadius: '8px',
        marginBottom: '10px',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div>
        <input
          maxLength={1}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="חפש תו"
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <input
          maxLength={1}
          value={findChar}
          onChange={(e) => setFindChar(e.target.value)}
          placeholder="מצא"
        />
        <input
          maxLength={1}
          value={replaceChar}
          onChange={(e) => setReplaceChar(e.target.value)}
          placeholder="החלף"
        />
        <button onClick={() => onReplace(findChar, replaceChar)}>החלף תו</button>
      </div>
      <div>
        <button onClick={onUndo} disabled={!canUndo}>
          Undo
        </button>
      </div>
    </div>
  )
}

export default AdvancedPanel
