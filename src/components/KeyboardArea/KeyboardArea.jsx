import { useState } from 'react'
import './KeyboardArea.css'

const keyboardLayouts = {
  hebrew:'םןףץתשרקצפעסנמלכיטחזוהדגבא'.split(''),
  english: 'abcdefghijklmnopqrstuvwxyz'.split(''),
  symbols: '0123456789!@#%&()+-=[]:,.?'.split(''),
  emojis: ['😀', '😂', '😍', '😎', '🤔', '👍', '❤️', '🔥', '✨', '🎉', '✅',
         '🥳', '😇', '🤩', '😜', '😡', '😭', '🤯', '😴', '👀', '💪', '🚀'],
}

function KeyboardArea({ onAddCharacter }) {
  const [layout, setLayout] = useState('hebrew') // State to track the current keyboard layout, defaulting to Hebrew
  const activeKeys = keyboardLayouts[layout] ?? keyboardLayouts.hebrew // Fallback to Hebrew if layout is not found

  return (
    <div className="keyboard-area">
      <div className="keyboard-area__layout-switcher">
        {/*here we have buttons to switch between different keyboard layouts (Hebrew, English, Symbols, Emojis). When a button is clicked, it updates the layout state, which in turn updates the activeKeys that are displayed on the keyboard.*/}
        <button
          className={`keyboard-area__layout-btn ${layout === 'hebrew' ? 'keyboard-area__layout-btn--active' : ''}`}
          onClick={() => setLayout('hebrew')}
        >
          עברית
        </button>
        <button
          className={`keyboard-area__layout-btn ${layout === 'english' ? 'keyboard-area__layout-btn--active' : ''}`}
          onClick={() => setLayout('english')}
        >
          English
        </button>
        <button
          className={`keyboard-area__layout-btn ${layout === 'symbols' ? 'keyboard-area__layout-btn--active' : ''}`}
          onClick={() => setLayout('symbols')}
        >
          123!@
        </button>
        <button
          className={`keyboard-area__layout-btn ${layout === 'emojis' ? 'keyboard-area__layout-btn--active' : ''}`}
          onClick={() => setLayout('emojis')}
        >
          ✦ Emoji
        </button>
      </div>

      <div className="keyboard-area__keys">
        {activeKeys.map((letter) => (
          <button
            key={letter}
            className={`keyboard-area__key ${layout === 'emojis' ? 'keyboard-area__key--emoji' : ''}`}
            onClick={() => onAddCharacter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      <button
        className="keyboard-area__space"
        onClick={() => onAddCharacter(' ')}
      >
        <span className="keyboard-area__space-icon">⎵</span>
        Space
      </button>
    </div>
  )
}

export default KeyboardArea