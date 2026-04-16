import { useState } from 'react'
import Auth from './components/Auth/Auth'
import Dashboard from './components/Dashboard/Dashboard'
import TopBar from './components/TopBar/TopBar'
import Workspace from './components/Workspace/Workspace'
import {
  clearCurrentSession,
  getCurrentSessionUser,
} from './utils/auth/sessionStorage'
import {
  markDocumentSaved,
  undoActiveDocument,
  updateActiveDocument,
} from './utils/editor/documentLifecycle'
import {
  addCharacter,
  applyStyleToText,
  clearText,
  deleteLastCharacter,
  deleteLastWord,
  replaceCharacters,
} from './utils/editor/textTransforms'
import {
  appendNewDocument,
  createInitialWorkspaceState,
  findDocumentByFileName,
  findDocumentById,
  getActiveDocument,
  loadDocumentIntoWorkspace,
  removeDocumentFromWorkspace,
} from './utils/editor/workspaceUtils'
import {
  appendFileIndexEntry,
  fileExists,
  getUserFileNames,
  hasIndexedFile,
} from './utils/files/fileIndexUtils'
import {
  isValidFileName,
  normalizeFileName,
  shouldConfirmOverwrite,
} from './utils/files/fileNameUtils'
import {
  getStoredFileIndex,
  openDocumentFromStorage,
  saveFileIndex,
  writeDocumentToStorage,
} from './utils/files/fileStorage'
import './App.css'

const initialCurrentUser = getCurrentSessionUser()
const initialWorkspaceState = createInitialWorkspaceState()

function App() {
  const [currentUser, setCurrentUser] = useState(initialCurrentUser)
  const [documents, setDocuments] = useState(initialWorkspaceState.documents)
  const [activeDocumentId, setActiveDocumentId] = useState(initialWorkspaceState.activeDocumentId)
  const [searchQuery, setSearchQuery] = useState('')
  const [fileList, setFileList] = useState(() => getUserFileNames(initialCurrentUser))

  const activeDoc = getActiveDocument(documents, activeDocumentId)

  // Session and App Initialization
  
  function resetEditorState() {
    const nextWorkspaceState = createInitialWorkspaceState()
    setDocuments(nextWorkspaceState.documents)
    setActiveDocumentId(nextWorkspaceState.activeDocumentId)
  }

  function handleAuthenticated(username) {
    setCurrentUser(username)
    setFileList(getUserFileNames(username))
    resetEditorState()
  }

  function handleLogout() {
    clearCurrentSession()
    setCurrentUser('')
    setFileList([])
    resetEditorState()
  }

  // Text Editing and Document Mutations
  function handleApplyStyleToAll(key, value) {
    setDocuments((prevDocs) =>
      updateActiveDocument(
        prevDocs,
        activeDocumentId,
        (textElements) => applyStyleToText(textElements, key, value),
      ),
    )
  }

  function handleAddCharacter(char, currentStyle) {
    setDocuments((prevDocs) =>
      updateActiveDocument(
        prevDocs,
        activeDocumentId,
        (textElements) => addCharacter(textElements, char, currentStyle),
      ),
    )
  }

  function handleDeleteChar() {
    setDocuments((prevDocs) =>
      updateActiveDocument(prevDocs, activeDocumentId, deleteLastCharacter),
    )
  }

  function handleDeleteWord() {
    setDocuments((prevDocs) =>
      updateActiveDocument(prevDocs, activeDocumentId, deleteLastWord),
    )
  }

  function handleClearAll() {
    setDocuments((prevDocs) =>
      updateActiveDocument(prevDocs, activeDocumentId, clearText),
    )
  }

  function handleReplace(oldChar, newChar) {
    const result = replaceCharacters(activeDoc?.textElements || [], oldChar, newChar)
    if (!result.success) {
      return false
    }

    setDocuments((prevDocs) =>
      updateActiveDocument(prevDocs, activeDocumentId, () => result.textElements),
    )
    return true
  }

  function handleUndo() {
    setDocuments((prevDocs) => undoActiveDocument(prevDocs, activeDocumentId))
  }

  // Workspace and Document Tabs
  function handleNewDocument() {
    const nextWorkspaceState = appendNewDocument(documents)
    setDocuments(nextWorkspaceState.documents)
    setActiveDocumentId(nextWorkspaceState.activeDocumentId)
  }

  // File Persistence
  function persistDocumentForUser(documentToSave, fileName) {
    if (!currentUser) {
      return { success: false, error: 'No active user' }
    }

    const cleanName = normalizeFileName(fileName || documentToSave?.fileName)
    if (!isValidFileName(cleanName)) {
      return { success: false, error: 'Please enter a valid file name' }
    }

    writeDocumentToStorage(cleanName, documentToSave)

    const fileIndex = getStoredFileIndex()
    const alreadyIndexed = hasIndexedFile(fileIndex, currentUser, cleanName)
    if (!alreadyIndexed) {
      const nextFileIndex = appendFileIndexEntry(fileIndex, currentUser, cleanName)
      saveFileIndex(nextFileIndex)
    }

    return { success: true, fileName: cleanName }
  }

  function handleSaveAs(fileName) {
    const cleanName = normalizeFileName(fileName)
    if (!isValidFileName(cleanName)) {
      alert('Please enter a valid file name')
      return
    }

    if (shouldConfirmOverwrite(cleanName, activeDoc?.fileName, fileExists(currentUser, cleanName))) {
      const wantsToOverwrite = window.confirm(
        `The file "${cleanName}" already exists. Do you want to overwrite it?`,
      )
      if (!wantsToOverwrite) {
        return
      }
    }

    const result = persistDocumentForUser(activeDoc, cleanName)
    if (!result.success) {
      alert(result.error)
      return
    }

    setDocuments((prevDocs) =>
      markDocumentSaved(prevDocs, activeDocumentId, result.fileName),
    )
    setFileList(getUserFileNames(currentUser))
    alert('File saved successfully!')
  }

  function handleSave() {
    if (activeDoc?.fileName) {
      handleSaveAs(activeDoc.fileName)
      return
    }

    alert("Please use 'Save As' to name your file first.")
  }

  // File Opening and Document Closing Workflow
  function handleOpen(fileName) {
    if (!fileName) return

    const alreadyOpenDoc = findDocumentByFileName(documents, fileName)
    if (alreadyOpenDoc) {
      setActiveDocumentId(alreadyOpenDoc.id)
      return
    }

    const result = openDocumentFromStorage(fileName)
    if (!result.success) return

    const workspaceState = loadDocumentIntoWorkspace(
      documents,
      activeDocumentId,
      result,
    )
    setDocuments(workspaceState.documents)
    setActiveDocumentId(workspaceState.activeDocumentId)
  }

  function handleCloseDocument(id) {
    const docToClose = findDocumentById(documents, id)
    if (!docToClose) return

    if (docToClose.isDirty) {
      const wantsToSave = window.confirm('Do you want to save this document before closing?')

      if (wantsToSave) {
        let fName = docToClose.fileName

        if (!fName) {
          fName = window.prompt('Enter file name to save:')
        }

        if (fName) {
          const saveResult = persistDocumentForUser(docToClose, fName)
          if (!saveResult.success) {
            alert(saveResult.error)
            return
          }

          setFileList(getUserFileNames(currentUser))
        } else {
          return
        }
      } else {
        const confirmClose = window.confirm(
          'Are you sure you want to close without saving? Unsaved changes will be lost.',
        )
        if (!confirmClose) return
      }
    }

    const workspaceState = removeDocumentFromWorkspace(
      documents,
      activeDocumentId,
      id,
    )
    setDocuments(workspaceState.documents)
    setActiveDocumentId(workspaceState.activeDocumentId)
  }

  if (!currentUser) {
    return <Auth onAuthenticated={handleAuthenticated} />
  }

  return (
    <div className="app-shell">
      <TopBar
        fileList={fileList}
        currentFileName={activeDoc?.fileName || ''}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        onOpen={handleOpen}
        onNew={handleNewDocument}
      />

      <Workspace
        documents={documents}
        activeDocumentId={activeDocumentId}
        searchQuery={searchQuery}
        onDocumentSelect={setActiveDocumentId}
        onDocumentClose={handleCloseDocument}
      />

      <Dashboard
        onApplyStyleToAll={handleApplyStyleToAll}
        onDeleteChar={handleDeleteChar}
        onDeleteWord={handleDeleteWord}
        onClearAll={handleClearAll}
        onAddCharacter={handleAddCharacter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onReplace={handleReplace}
        onUndo={handleUndo}
        canUndo={activeDoc ? activeDoc.textHistory.length > 0 : false}
      />
    </div>
  )
}

export default App
