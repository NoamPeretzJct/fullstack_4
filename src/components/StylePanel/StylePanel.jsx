const fontSizeOptions = ['12px', '16px', '20px', '24px', '32px']
const fontFamilyOptions = [
  'Arial',
  'Courier New',
  'Times New Roman',
  'Georgia',
]

function StylePanel({
  currentStyle,
  onStyleChange,
  applyMode,
  onModeChange,
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '15px',
        padding: '10px',
        background: '#f0f0f0',
        borderRadius: '8px',
        marginBottom: '10px',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '5px',
          padding: '6px',
          background: '#d9d9d9',
          borderRadius: '6px',
        }}
      >
        <button
          onClick={() => onModeChange('forward')} // When clicked, it sets the applyMode to 'forward'.
          style={{
            background: applyMode === 'forward' ? '#a0c4ff' : '#fff', 
          }}
        >
          מכאן והלאה
        </button>
        <button
          onClick={() => onModeChange('all')} // When clicked, it sets the applyMode to 'all'.
          style={{
            background: applyMode === 'all' ? '#a0c4ff' : '#fff',
          }}
        >
          על כל הטקסט
        </button>
      </div>
      <div>
        <label>
          Color Picker
          <input
            type="color"
            value={currentStyle.color}
            onChange={(e) => onStyleChange('color', e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Font Size
          <select
            value={currentStyle.fontSize}
            onChange={(e) => onStyleChange('fontSize', e.target.value)}
          >
            {fontSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Font Family
          <select
            value={currentStyle.fontFamily}
            onChange={(e) => onStyleChange('fontFamily', e.target.value)}
          >
            {fontFamilyOptions.map((fontFamily) => (
              <option key={fontFamily} value={fontFamily}>
                {fontFamily}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}

export default StylePanel
