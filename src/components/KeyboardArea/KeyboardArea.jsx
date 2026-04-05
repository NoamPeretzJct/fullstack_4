import { useState } from 'react'

const keyboardLayouts = {
  hebrew:'םןףץתשרקצפעסנמלכיטחזוהדגבא'.split(''),
  english: 'abcdefghijklmnopqrstuvwxyz'.split(''),
  symbols: '0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'.split(''),
  emojis: ['😀', '😂', '😍', '😎', '🤔', '👍', '❤️', '🔥', '✨', '🎉', '✅', '❌'],
}

function KeyboardArea({ onAddCharacter }) {
  const [layout, setLayout] = useState('hebrew') // State to track the current keyboard layout, defaulting to Hebrew
  const activeKeys = keyboardLayouts[layout] ?? keyboardLayouts.hebrew // Fallback to Hebrew if layout is not found

  return (
    <div
      style={{
        padding: '15px',
        background: '#e0e0e0',
        borderRadius: '8px',
        marginTop: '10px',
      }}
    >
      <div
        style={{
          marginBottom: '10px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
        }}
        
      //here we have buttons to switch between different keyboard layouts (Hebrew, English, Symbols, Emojis). When a button is clicked, it updates the layout state, which in turn updates the activeKeys that are displayed on the keyboard.
      >
        <button onClick={() => setLayout('hebrew')}>עברית</button>
        <button onClick={() => setLayout('english')}>English</button>
        <button onClick={() => setLayout('symbols')}>123!@</button>
        <button onClick={() => setLayout('emojis')}>Emojis</button>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '5px',
          justifyContent: 'center',
        }}
      >
        {activeKeys.map((letter) => (
          <button
            key={letter}
            onClick={() => onAddCharacter(letter)}
            style={{
              padding: '10px 14px',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            {letter}
          </button>
        ))}
      </div>
      <button
        onClick={() => onAddCharacter(' ')}
        style={{
          display: 'block',
          width: '100%',
          marginTop: '10px',
          padding: '12px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Space
      </button>
    </div>
  )
}

export default KeyboardArea
