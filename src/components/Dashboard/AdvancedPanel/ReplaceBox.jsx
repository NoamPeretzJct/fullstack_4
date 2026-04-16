import { useState } from 'react'
import './ReplaceBox.css'

function ReplaceBox({ onReplace }) {
  const [findChar, setFindChar] = useState('')
  const [replaceChar, setReplaceChar] = useState('')
  const [toastMsg, setToastMsg] = useState('')

  function handleReplaceClick() {
    const replaced = onReplace(findChar, replaceChar)

    if (replaced === false) {
      setToastMsg('Not found')
      setTimeout(() => {
        setToastMsg('')
      }, 2000)
      return
    }

    setToastMsg('')
  }

  return (
    <div className="replace-box">
      <span className="replace-box__label">Replace</span>
      <div className="replace-box__row">
        <input
          className="replace-box__input"
          maxLength={1}
          value={findChar}
          onChange={(e) => setFindChar(e.target.value)}
          placeholder="find"
        />
        <span className="replace-box__arrow">-</span>
        <input
          className="replace-box__input"
          maxLength={1}
          value={replaceChar}
          onChange={(e) => setReplaceChar(e.target.value)}
          placeholder="new"
        />
        <button
          className="replace-box__button"
          onClick={handleReplaceClick}
        >
          Replace All
          {toastMsg && <span className="replace-box__toast">{toastMsg}</span>}
        </button>
      </div>
    </div>
  )
}

export default ReplaceBox
