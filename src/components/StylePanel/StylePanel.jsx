import './StylePanel.css'

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
    <div className="style-panel">
      <span className="panel-label">Style</span>

      <div className="style-panel__mode-toggle">
        <button
          className={`style-panel__mode-btn ${applyMode === 'forward' ? 'style-panel__mode-btn--active' : ''}`}
          onClick={() => onModeChange('forward')} // When clicked, it sets the applyMode to 'forward'.
        >
          מכאן והלאה
        </button>
        <button
          className={`style-panel__mode-btn ${applyMode === 'all' ? 'style-panel__mode-btn--active' : ''}`}
          onClick={() => onModeChange('all')} // When clicked, it sets the applyMode to 'all'.
        >
          על כל הטקסט
        </button>
      </div>

      <div className="style-panel__divider" />

      <label className="style-panel__control">
        <span className="style-panel__control-label">Color</span>
        <div className="style-panel__color-wrap">
          <input
            className="style-panel__color-input"
            type="color"
            value={currentStyle.color}
            onChange={(e) => onStyleChange('color', e.target.value)}
          />
          <span
            className="style-panel__color-swatch"
            style={{ background: currentStyle.color }}
          />
        </div>
      </label>

      <div className="style-panel__divider" />

      <label className="style-panel__control">
        <span className="style-panel__control-label">Size</span>
        <select
          className="style-panel__select"
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

      <div className="style-panel__divider" />

      <label className="style-panel__control">
        <span className="style-panel__control-label">Font</span>
        <select
          className="style-panel__select"
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
  )
}

export default StylePanel