import { useEffect, useState } from 'react'
import AdvancedPanel from './components/AdvancedPanel/AdvancedPanel'
import DeletePanel from './components/DeletePanel/DeletePanel'
import DisplayArea from './components/DisplayArea/DisplayArea'
import FileMenu from './components/FileMenu/FileMenu'
import KeyboardArea from './components/KeyboardArea/KeyboardArea'
import StylePanel from './components/StylePanel/StylePanel'
import './App.css'

function createDocument() { // create a new document with default values
  return {
    id: crypto.randomUUID(),
    textElements: [], // array of { id, char, color, fontSize, fontFamily }
    textHistory: [], // array of previous textElements states for undo functionality
    fileName: '', 
  }
}

const initialDocument = createDocument() // create an initial document to display when the app loads

function App() { 
  const [currentStyle, setCurrentStyle] = useState({ 
    color: '#000000',
    fontSize: '16px',
    fontFamily: 'Arial',
  })
  const [applyMode, setApplyMode] = useState('forward') // forwoard or all
  const [documents, setDocuments] = useState([initialDocument]) // array of document objects, each with its own text and history
  const [activeDocumentId, setActiveDocumentId] = useState(initialDocument.id) // track which document is currently active for editing
  const [searchQuery, setSearchQuery] = useState('') // for the search functionality in the advanced panel
  const [fileList, setFileList] = useState([]) 
  //the difference between fileList and documents is that fileList is just an array of file names that exist in localStorage, while documents is an array of document objects that are currently open in the editor.
  //  fileList is used to populate the dropdown for opening files, while documents contains the actual text and history data for each open document.

  useEffect(() => { // on app load, read the list of saved files from localStorage and populate the fileList state
    const savedFiles = JSON.parse(localStorage.getItem('editor_files_index')) || []
    setFileList(savedFiles) // this allows the file menu to show which files are available to open, even if they haven't been opened in the current session
  }, [])

  const activeDoc =
    documents.find((doc) => doc.id === activeDocumentId) || documents[0]

  function updateActiveDocument(updaterFn, saveHistory = true) { 
    //updateerfn: function that takes the current state of textElements and returns the new state after applying the desired change (like adding a character, deleting, etc.)
    // saveHistory: boolean flag to determine whether to save the current state of textElements to the history before applying the update (used for undo functionality)
    setDocuments((prevDocs) => 
      prevDocs.map((doc) => { //run through all documents and find the active one to update, while leaving the others unchanged
        if (doc.id !== activeDocumentId) {
          return doc
        }

        const newElements = updaterFn(doc.textElements) // call the updater function with the current textElements to get the new state after the change
        const newHistory = saveHistory // if saavehistory is true, add the state before the update, for the undo functionality.
          ? [...doc.textHistory, doc.textElements]
          : doc.textHistory // if false,  If false, keep the history unchanged (used for style changes that don't affect the text content)

        return {
          ...doc,
          textElements: newElements,
          textHistory: newHistory,
        }
      }),
    )
  }

  function handleStyleChange(key, value) {
    // key is one of 'color', 'fontSize', or 'fontFamily'
    // value is the new value for that style property

    setCurrentStyle((prev) => ({ ...prev, [key]: value })) // update is here

    if (applyMode === 'all') { // if the mode is all, apply the style change to all text elements in the active document 
      updateActiveDocument(
        (prev) => prev.map((item) => ({ ...item, [key]: value })),
      )
    }
  }

  function handleAddCharacter(char) {
    updateActiveDocument((prev) => [
      ...prev,
      { id: crypto.randomUUID(), char, ...currentStyle }, // create a new text element with the character and the current style, and add it to the end of the textElements array for the active document
    ])
  }

  function handleDeleteChar() {
    updateActiveDocument((prev) => prev.slice(0, -1))
  }

  function handleDeleteWord() {
    updateActiveDocument((prev) => {
      const next = [...prev]

      while (next.length > 0 && next[next.length - 1].char === ' ') {
        next.pop()
      }

      while (next.length > 0 && next[next.length - 1].char !== ' ') {
        next.pop()
      }

      return next
    })
  }

  function handleClearAll() {
    updateActiveDocument(() => [])
  }

  function handleReplace(oldChar, newChar) {
    updateActiveDocument((prev) =>
      prev.map((item) =>
        item.char === oldChar ? { ...item, char: newChar } : item,
      ),
    )
  }

  function handleUndo() {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => {
        if (doc.id !== activeDocumentId || doc.textHistory.length === 0) {
          return doc
        }

        const previousText = doc.textHistory[doc.textHistory.length - 1]
        const newHistory = doc.textHistory.slice(0, -1)

        return {
          ...doc,
          textElements: previousText,
          textHistory: newHistory,
        }
      }),
    )
  }

  function handleNewDocument() {
    const newDoc = createDocument()
    setDocuments((prev) => [...prev, newDoc])
    setActiveDocumentId(newDoc.id)
  }

  function handleSaveAs(fileName) {
    if (!fileName) {
      alert('Please enter a file name')
      return
    }

    localStorage.setItem(
      `editor_file_${fileName}`,
      JSON.stringify(activeDoc?.textElements || []),
    )

    if (!fileList.includes(fileName)) { 
      const newList = [...fileList, fileName]
      setFileList(newList)
      localStorage.setItem('editor_files_index', JSON.stringify(newList))
    }

    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === activeDocumentId ? { ...doc, fileName } : doc, 
      ),
    )
    alert('File saved successfully!')
  }

  function handleSave() {
    if (activeDoc?.fileName) {
      handleSaveAs(activeDoc.fileName)
      return
    }

    alert("Please use 'Save As' to name your file first.")
  }

  function handleOpen(fileName) {
    if (!fileName) {
      return
    }

    const data = localStorage.getItem(`editor_file_${fileName}`)

    if (!data) {
      return
    }

    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === activeDocumentId
          ? {
              ...doc,
              textElements: JSON.parse(data), // load the text elements from localStorage for the selected file
              textHistory: [], // clear the history when opening a file, since it's a new state that we haven't made any changes to yet
              fileName, // update the fileName in the document state to reflect the opened file
            }
          : doc, 
      ),
    )
  }

  function handleCloseDocument(id) {
    const docToClose = documents.find((doc) => doc.id === id)
    const wantsToSave = window.confirm('Do you want to save this document before closing?')

    if (wantsToSave) {
      let fName = docToClose.fileName

      if (!fName) {
        fName = window.prompt('Enter file name to save:')
      }

      if (fName) { // if we have a file name (either existing or new), save the document to localStorage before closing
        localStorage.setItem(
          `editor_file_${fName}`,
          JSON.stringify(docToClose.textElements),
        )

        if (!fileList.includes(fName)) { // if this file name is not already in the fileList, add it and update localStorage
          const newList = [...fileList, fName]
          setFileList(newList)
          localStorage.setItem('editor_files_index', JSON.stringify(newList))
        }
      }

      if (!fName) { 
        return
      }
    }

    if (!wantsToSave) {
      const confirmClose = window.confirm(
        'Are you sure you want to close without saving? Unsaved changes will be lost.',
      )

      if (!confirmClose) {
        return
      }
    }

    const remainingDocs = documents.filter((doc) => doc.id !== id) // remove the document with the specified id from the documents array

    if (remainingDocs.length === 0) { // if there are no documents left after closing, create a new blank document to ensure the editor always has at least one document open
      remainingDocs.push(createDocument())
    }

    setDocuments(remainingDocs) 

    if (activeDocumentId === id) { 
      setActiveDocumentId(remainingDocs[0].id)
    }
  }

  return (
    <div className="app-shell">
      <FileMenu
        fileList={fileList}
        currentFileName={activeDoc?.fileName || ''}
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        onOpen={handleOpen}
        onNew={handleNewDocument}
      />

      <main className="app-workspace">
        <div className="app-documents">
          {documents.map((doc) => (
            <DisplayArea
              key={doc.id}
              textElements={doc.textElements}
              searchQuery={searchQuery}
              isActive={doc.id === activeDocumentId}
              onClick={() => setActiveDocumentId(doc.id)}
              onClose={() => handleCloseDocument(doc.id)}
            />
          ))}
        </div>
      </main>

      <footer className="app-control-dashboard">
        <div className="floating-box box-left">
          <StylePanel currentStyle={currentStyle} onStyleChange={handleStyleChange} applyMode={applyMode} onModeChange={setApplyMode} />
          <DeletePanel onDeleteChar={handleDeleteChar} onDeleteWord={handleDeleteWord} onClearAll={handleClearAll} />
        </div>
        <div className="floating-box box-center">
          <KeyboardArea onAddCharacter={handleAddCharacter} />
        </div>
        <div className="floating-box box-right">
          <AdvancedPanel searchQuery={searchQuery} onSearchChange={setSearchQuery} onReplace={handleReplace} onUndo={handleUndo} canUndo={activeDoc ? activeDoc.textHistory.length > 0 : false} />
        </div>
      </footer>
    </div>
  )
}

export default App
