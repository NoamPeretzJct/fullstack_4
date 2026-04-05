function DeletePanel({ onDeleteChar, onDeleteWord, onClearAll }) {
  const buttonStyle = {
    padding: '10px 14px',
    cursor: 'pointer',
    background: '#ffd6d6',
    border: '1px solid #f0aaaa',
    borderRadius: '6px',
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '15px',
        padding: '10px',
        background: '#ffe6e6',
        borderRadius: '8px',
        marginBottom: '10px',
        justifyContent: 'center',
      }}
    >
      <button onClick={onDeleteChar} style={buttonStyle}>
        מחק תו
      </button>
      <button onClick={onDeleteWord} style={buttonStyle}>
        מחק מילה
      </button>
      <button onClick={onClearAll} style={buttonStyle}>
        נקה הכל
      </button>
    </div>
  )
}

export default DeletePanel
