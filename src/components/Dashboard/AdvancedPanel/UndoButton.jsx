import './UndoButton.css'

function UndoButton({ canUndo, onUndo }) {
  return (
    <div className="undo-button-box">
      <span className="undo-button-box__label">Undo</span>
      <button
        className={`undo-button-box__button ${!canUndo ? 'undo-button-box__button--disabled' : ''}`}
        onClick={onUndo}
        disabled={!canUndo}
      >
        <span className="undo-button-box__icon"></span>
        Undo
      </button>
    </div>
  )
}

export default UndoButton
