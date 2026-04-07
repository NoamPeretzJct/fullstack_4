import './DeletePanel.css'

function DeletePanel({ onDeleteChar, onDeleteWord, onClearAll }) {
  return (
    <div className="delete-panel">
      <span className="panel-label">Delete</span>

      <div className="delete-panel__controls">
        <button className="delete-panel__btn" onClick={onDeleteChar}>
          <span className="delete-panel__btn-icon">⌦</span>
          <span className="delete-panel__btn-text">Del Char</span>
        </button>
        <button className="delete-panel__btn" onClick={onDeleteWord}>
          <span className="delete-panel__btn-icon">⌦</span>
          <span className="delete-panel__btn-text">Del Word</span>
        </button>
        <button className="delete-panel__btn delete-panel__btn--danger" onClick={onClearAll}>
          <span className="delete-panel__btn-text">Clear All</span>
        </button>
      </div>
    </div>
  )
}

export default DeletePanel
