import './DisplayArea.css'

function DisplayArea({ textElements, searchQuery, isActive, onClick, onClose }) {
  return (
    <div
      className={`display-area ${isActive ? 'display-area--active' : ''}`}
      onClick={onClick}
    >
      <button
        className="display-area__close"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      >
        ×
      </button>

      <div className="display-area__content" dir="auto">
        {textElements.map((item) => (
          <span
            key={item.id}
            className={`display-area__char ${searchQuery && item.char === searchQuery ? 'display-area__char--highlight' : ''}`}
            style={{
              color: item.color,
              fontSize: item.fontSize,
              fontFamily: item.fontFamily,
            }}
          >
            {item.char}
          </span>
        ))}
      </div>
    </div>
  )
}

export default DisplayArea