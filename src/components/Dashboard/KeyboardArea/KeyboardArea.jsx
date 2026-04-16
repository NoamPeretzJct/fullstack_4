import { useState } from 'react'
import './KeyboardArea.css'

const keyboardLayouts = {
  hebrew: [
    ['/', "'", 'ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'],
    ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף'],
    [{ char: '', label: '⇧', type: 'action' }, 'ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ', { char: '', label: '⇧', type: 'action' }],
    [{ char: ' ', label: 'Space', type: 'space' }]
  ],
  english: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    [{ char: '', label: 'Caps', type: 'action' }, 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', { char: '', label: 'Enter', type: 'action' }],
    [{ char: '', label: 'Shift', type: 'action-wide' }, 'z', 'x', 'c', 'v', 'b', 'n', 'm', { char: '', label: 'Shift', type: 'action-wide' }],
    [{ char: ' ', label: 'Space', type: 'space' }]
  ],
  symbols: [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['@', '#', '$', '%', '&', '*', '-', '+', '(', ')'],
    [{ char: '', label: '★', type: 'action-wide' }, '!', '"', "'", ':', ';', '/', '?', { char: '', label: '★', type: 'action-wide' }],
    [{ char: ' ', label: 'Space', type: 'space' }]
  ],
  emojis: [
    ['😀', '😂', '🥰', '😎', '🤔', '🙄', '😭', '😡', '🤯', '🥳'],
    ['👍', '👎', '👏', '🙏', '💪', '🤝', '❤️', '💔', '✨', '🔥'],
    [{ char: '', label: '☺', type: 'action-wide' }, '🎉', '💯', '✅', '❌', '🚀', '⭐', '🎈', { char: '', label: '☺', type: 'action-wide' }],
    [{ char: ' ', label: 'Space', type: 'space' }]
  ]
}

export default function KeyboardArea({ onAddCharacter }) {
  const [language, setLanguage] = useState('hebrew')
  const currentLayout = keyboardLayouts[language]

  return (
    <div className="keyboard-modern-container">
      <div className="keyboard-tabs">
        <button className={language === 'hebrew' ? 'active' : ''} onClick={() => setLanguage('hebrew')}>עברית</button>
        <button className={language === 'english' ? 'active' : ''} onClick={() => setLanguage('english')}>English</button>
        <button className={language === 'symbols' ? 'active' : ''} onClick={() => setLanguage('symbols')}>123!?</button>
        <button className={language === 'emojis' ? 'active' : ''} onClick={() => setLanguage('emojis')}>😊</button>
      </div>

      <div className="keyboard-board">
        {currentLayout.map((row, rowIndex) => (
          <div key={rowIndex} className={`keyboard-row row-${rowIndex}`}>
            {row.map((keyItem, keyIndex) => {
              const isObj = typeof keyItem === 'object'
              const char = isObj ? keyItem.char : keyItem
              const label = isObj ? keyItem.label : keyItem
              const keyType = isObj ? keyItem.type : 'standard'

              return (
                <button
                  key={keyIndex}
                  className={`key-btn key-${keyType}`}
                  onClick={() => {
                    if (char !== '') {
                      onAddCharacter(char)
                    }
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}