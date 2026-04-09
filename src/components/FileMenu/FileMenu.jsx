import { useState } from 'react'
import './FileMenu.css'

function FileMenu({
  fileList,
  currentFileName,
  currentUser, // <-- חדש
  onLogout,    // <-- חדש
  onSave,
  onSaveAs,
  onOpen,
  onNew,
}) {
  const [inputName, setInputName] = useState('')
  const [selectedFile, setSelectedFile] = useState('')

  return (
    <div className="filemenu">
      <div className="filemenu__group">
        <button className="filemenu__btn filemenu__btn--accent" onClick={onNew}>New</button>
        <input
          className="filemenu__input"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="New file name..."
        />
        <button
          className="filemenu__btn"
          onClick={() => {
            onSaveAs(inputName)
            setInputName('')
          }}
        >
          Save As
        </button>
        <button className="filemenu__btn" onClick={onSave}>Save</button>
      </div>

     <div className="filemenu__brand">
        <span className="filemenu__brand-dot" />
        Visual Text Editor
        {currentUser && (
          <span style={{ fontSize: '0.6rem', marginLeft: '15px', color: 'var(--color-accent)' }}>
            | User: {currentUser}
          </span>
        )}
      </div>

      <div className="filemenu__group filemenu__group--right">
        <button className="filemenu__btn" onClick={onLogout} style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
          Logout
        </button>
        <select
          className="filemenu__select"
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
        >
          <option disabled hidden value="">Select a file...</option>
          {fileList.map((fileName) => (
            <option key={fileName} value={fileName}>
              {fileName}
            </option>
          ))}
        </select>
        <button className="filemenu__btn" onClick={() => onOpen(selectedFile)}>Open</button>
        <div className="filemenu__current-file">
          <span className="filemenu__current-file-label">active</span>
          <span className="filemenu__current-file-name">
            {currentFileName || 'Untitled'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default FileMenu