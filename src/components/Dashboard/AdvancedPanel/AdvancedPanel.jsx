import ReplaceBox from './ReplaceBox'
import SearchBox from './SearchBox'
import UndoButton from './UndoButton'
import './AdvancedPanel.css'

function AdvancedPanel({
  searchQuery,
  onSearchChange,
  onReplace,
  onUndo,
  canUndo,
}) {
  return (
    <div className="advanced-panel">
      <span className="panel-label">Advanced</span>

      <div className="advanced-panel__search-row">
        <SearchBox
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <UndoButton canUndo={canUndo} onUndo={onUndo} />
      </div>

      <ReplaceBox onReplace={onReplace} />
    </div>
  )
}

export default AdvancedPanel
