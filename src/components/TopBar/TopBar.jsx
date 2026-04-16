import FileMenu from './FileMenu/FileMenu'
import './TopBar.css'

function TopBar({
  fileList,
  currentFileName,
  currentUser,
  onLogout,
  onSave,
  onSaveAs,
  onOpen,
  onNew,
}) {
  return (
    <header className="topbar">
      <FileMenu
        fileList={fileList}
        currentFileName={currentFileName}
        currentUser={currentUser}
        onLogout={onLogout}
        onSave={onSave}
        onSaveAs={onSaveAs}
        onOpen={onOpen}
        onNew={onNew}
      />
    </header>
  )
}

export default TopBar
