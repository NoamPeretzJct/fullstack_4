import { useEffect, useState } from 'react'
import AdvancedPanel from './components/AdvancedPanel/AdvancedPanel'
import DeletePanel from './components/DeletePanel/DeletePanel'
import DisplayArea from './components/DisplayArea/DisplayArea'
import FileMenu from './components/FileMenu/FileMenu'
import KeyboardArea from './components/KeyboardArea/KeyboardArea'
import StylePanel from './components/StylePanel/StylePanel'
import Auth from './components/Auth/Auth'
import './App.css'

function createDocument() {
  return {
    id: crypto.randomUUID(),
    textElements: [],
    textHistory: [],
    fileName: '',
    isDirty: false,
  }
}

const initialDocument = createDocument()

function App() {
  const [currentStyle, setCurrentStyle] = useState({
    color: '#000000',
    fontSize: '16px',
    fontFamily: 'Arial',
  })
  const [applyMode, setApplyMode] = useState('forward')
  const [documents, setDocuments] = useState([initialDocument])
  const [activeDocumentId, setActiveDocumentId] = useState(initialDocument.id)
  const [searchQuery, setSearchQuery] = useState('')
  const [fileList, setFileList] = useState([])

  // --- ניהול משתמשים מתקדם ---
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('editor_current_user') || '')

  useEffect(() => {
    if (currentUser) {
      const globalIndex = JSON.parse(localStorage.getItem('editor_files_index')) || []
      const userFiles = globalIndex
        .filter((file) => file.owner === currentUser)
        .map((file) => file.name)

      setFileList(userFiles)
    }
  }, [currentUser])

  function handleLogin(username) {
    localStorage.setItem('editor_current_user', username)
    setCurrentUser(username)
    
    // תיקון באג 1: איפוס הלוח והמסמכים כשנכנס משתמש חדש
    const newDoc = createDocument()
    setDocuments([newDoc])
    setActiveDocumentId(newDoc.id)
  }

  function handleLogout() {
    localStorage.removeItem('editor_current_user')
    setCurrentUser('')
    
    // תיקון באג 1: איפוס הלוח כשיוצאים כדי למנוע זליגת מידע
    const newDoc = createDocument()
    setDocuments([newDoc])
    setActiveDocumentId(newDoc.id)
  }
  // --- סוף ניהול משתמשים ---

  const activeDoc = documents.find((doc) => doc.id === activeDocumentId) || documents[0]

  function updateActiveDocument(updaterFn, saveHistory = true) {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => {
        if (doc.id !== activeDocumentId) {
          return doc
        }

        const newElements = updaterFn(doc.textElements)
        const newHistory = saveHistory
          ? [...doc.textHistory, doc.textElements]
          : doc.textHistory

        return {
          ...doc,
          textElements: newElements,
          textHistory: newHistory,
          isDirty: true,
        }
      }),
    )
  }

  function handleStyleChange(key, value) {
    setCurrentStyle((prev) => ({ ...prev, [key]: value }))
    if (applyMode === 'all') {
      updateActiveDocument((prev) => prev.map((item) => ({ ...item, [key]: value })))
    }
  }

  function handleAddCharacter(char) {
    updateActiveDocument((prev) => [
      ...prev,
      { id: crypto.randomUUID(), char, ...currentStyle },
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
    // Validate that the searched character exists before mutating the active document.
    const hasMatch = activeDoc?.textElements.some((item) => item.char === oldChar)
    if (!hasMatch) {
      return false
    }

    updateActiveDocument((prev) =>
      prev.map((item) => (item.char === oldChar ? { ...item, char: newChar } : item)),
    )
    return true
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

    const cleanName = (fileName || '').trim();

    // 2. בדיקה אם אחרי הניקוי נשארנו עם כלום
    if (!cleanName) {
      alert('Please enter a valid file name');
      return;
    }

    // 3. הגנה מדריסה של קובץ אחר:
    // נזהיר רק אם השם קיים ברשימה, *וגם* זה לא השם של הקובץ הפתוח כרגע.
    if (cleanName !== activeDoc?.fileName && fileList.includes(cleanName)) {
      const wantsToOverwrite = window.confirm(`The file "${cleanName}" already exists. Do you want to overwrite it?`);
      if (!wantsToOverwrite) {
        return; // המשתמש לחץ "ביטול" - עוצרים את השמירה
      }
    }

    // --- מכאן הכל כמו הקוד שלך, רק משתמשים ב-cleanName במקום fileName ---
    
    localStorage.setItem(`editor_file_${cleanName}`, JSON.stringify(activeDoc?.textElements || []));

    if (!fileList.includes(cleanName)) {
      const newList = [...fileList, cleanName];
      setFileList(newList);
      const globalIndex = JSON.parse(localStorage.getItem('editor_files_index')) || [];
      globalIndex.push({ name: cleanName, owner: currentUser }); // הנחתי ש-currentUser קיים אצלך בסקופ
      localStorage.setItem('editor_files_index', JSON.stringify(globalIndex));
    }

    setDocuments((prevDocs) =>
      prevDocs.map((doc) => (doc.id === activeDocumentId ? { ...doc, fileName: cleanName, isDirty: false } : doc)),
    );
    alert('File saved successfully!');
  }

  function handleSave() {
    if (activeDoc?.fileName) {
      handleSaveAs(activeDoc.fileName); // שולח את השם הקיים - זה יעבור את בדיקת הדריסה בשקט בזכות הטריק שלנו
      return;
    }
    alert("Please use 'Save As' to name your file first.");
  }

  function handleOpen(fileName) {
    if (!fileName) return;

    // בונוס UX: אם הקובץ כבר פתוח באחד הטאבים, פשוט נעבור אליו בלי לשכפל!
    const alreadyOpenDoc = documents.find(doc => doc.fileName === fileName);
    if (alreadyOpenDoc) {
      setActiveDocumentId(alreadyOpenDoc.id);
      return;
    }

    const data = localStorage.getItem(`editor_file_${fileName}`);
    if (!data) return;

    const parsedData = JSON.parse(data);

    // בדיקה: האם המסמך הפעיל כרגע ריק לגמרי וחסר שם?
    const isEmptyAndUnnamed = !activeDoc.fileName && activeDoc.textElements.length === 0;

    if (isEmptyAndUnnamed) {
      // המסמך ריק ואין לו שם - נדרוס אותו ונציג בו את הקובץ שנפתח
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === activeDocumentId
            ? { ...doc, textElements: parsedData, textHistory: [], fileName, isDirty: false }
            : doc
        )
      );
    } else {
      // יש לנו עבודה על המסך (או שיש לה שם, או שיש בה טקסט).
      // במקום לדרוס, נוסיף מסמך חדש ונפתח אותו לצידו!
      const newDoc = {
        id: crypto.randomUUID(),
        textElements: parsedData,
        textHistory: [],
        fileName,
        isDirty: false,
      };
      
      setDocuments((prevDocs) => [...prevDocs, newDoc]);
      setActiveDocumentId(newDoc.id); // מעביר את הפוקוס לקובץ החדש שפתחנו
    }
  }

  function handleCloseDocument(id) {
    const docToClose = documents.find((doc) => doc.id === id)
    if (!docToClose) return;

    // התיקון: מקפיצים את שאלת השמירה *רק* אם הקובץ שונה
    if (docToClose.isDirty) {
      const wantsToSave = window.confirm('Do you want to save this document before closing?')

      if (wantsToSave) {
        let fName = docToClose.fileName

        if (!fName) {
          fName = window.prompt('Enter file name to save:')
        }

        // תיקון באג 2: סוגרים רק אם באמת נתנו שם וזה נשמר
        if (fName) {
          localStorage.setItem(`editor_file_${fName}`, JSON.stringify(docToClose.textElements))
          if (!fileList.includes(fName)) {
            const newList = [...fileList, fName]
            setFileList(newList)
            const globalIndex = JSON.parse(localStorage.getItem('editor_files_index')) || []
            globalIndex.push({ name: fName, owner: currentUser })
            localStorage.setItem('editor_files_index', JSON.stringify(globalIndex))
          }
        } else {
          return; // אם המשתמש ביטל את בקשת השם, נעצור ולא נסגור
        }
      } else {
        const confirmClose = window.confirm('Are you sure you want to close without saving? Unsaved changes will be lost.')
        if (!confirmClose) return;
      }
    }

    // --- תהליך סגירת הקובץ המקורי שלך (ללא האנימציות) ---
    let remainingDocs = documents.filter((doc) => doc.id !== id)

    // אם סגרנו את הקובץ האחרון, פותחים מסמך חדש כדי לא להשאיר מסך ריק
    if (remainingDocs.length === 0) {
      remainingDocs = [createDocument()]
    }

    setDocuments(remainingDocs)

    if (activeDocumentId === id) {
      setActiveDocumentId(remainingDocs[0].id)
    }
  }
  // חומת ההגנה של מסך ההתחברות (רינדור מותנה)
  if (!currentUser) {
    return <Auth onLogin={handleLogin} />
  }

  return (
    <div className="app-shell">
      <FileMenu
        fileList={fileList}
        currentFileName={activeDoc?.fileName || ''}
        currentUser={currentUser}
        onLogout={handleLogout}
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
