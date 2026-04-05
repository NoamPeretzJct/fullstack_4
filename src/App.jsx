import { useState } from 'react'
import AdvancedPanel from './components/AdvancedPanel/AdvancedPanel'
import DeletePanel from './components/DeletePanel/DeletePanel'
import DisplayArea from './components/DisplayArea/DisplayArea'
import KeyboardArea from './components/KeyboardArea/KeyboardArea'
import StylePanel from './components/StylePanel/StylePanel'

function App() {
  const [currentStyle, setCurrentStyle] = useState({
    color: '#000000',
    fontSize: '16px',
    fontFamily: 'Arial',
  })
  const [applyMode, setApplyMode] = useState('forward') //track the current style application mode, defaulting to 'forward'.
  const [textElements, setTextElements] = useState([]) // hold the text elements, which are objects containing the character and its associated style. Each time a character is added or modified, it's stored in this array with its current style.
  const [textHistory, setTextHistory] = useState([]) // maintain a history of text states to enable the undo functionality. Before any change is made to the textElements, the current state is saved to textHistory.
  const [searchQuery, setSearchQuery] = useState('') // store the current search query for highlighting characters in the DisplayArea. 

  const saveHistory = () => setTextHistory((prev) => [...prev, textElements]) // function to save the current state of textElements to textHistory before making any changes, allowing the user to undo changes later by reverting to previous states stored in textHistory.

  // key is the style property being changed (color, fontSize, or fontFamily), and value is the new value for that style. 
  function handleStyleChange(key, value) {
    if (applyMode === 'all') { 
      saveHistory()
    }

    setCurrentStyle((prev) => ({ ...prev, [key]: value })) // update the currentStyle state with the new style value for the specified key (color, fontSize, or fontFamily). 

    if (applyMode === 'all') {
      // If the applyMode is 'all', it also updates all existing text elements in textElements to have the new style by mapping over the array and applying the new style to each element.
      setTextElements((prev) =>
        prev.map((item) => ({
          ...item,
          [key]: value,
        })),
      )
    }
  }

  function handleAddCharacter(char) {
    saveHistory()
    setTextElements((prev) => [
      ...prev,
      { id: crypto.randomUUID(), char, ...currentStyle },
    ])
  }

  function handleDeleteChar() {
    saveHistory()
    setTextElements((prev) => prev.slice(0, -1))
  }

  function handleDeleteWord() {
    saveHistory()
    setTextElements((prev) => {
      const next = [...prev] // create a copy of the current text elements to modify. because  there is a mutate on prev directly

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
    saveHistory()
    setTextElements([])
  }

  function handleReplace(oldChar, newChar) {
    saveHistory()
    setTextElements((prev) =>
      prev.map((item) =>
        item.char === oldChar ? { ...item, char: newChar } : item,
      ),
    )
  }

  function handleUndo() {
    if (textHistory.length === 0) {
      return
    }

    setTextElements(textHistory[textHistory.length - 1])
    setTextHistory((prev) => prev.slice(0, -1)) //removes that state from textHistory to maintain the correct history stack for future undo operations.
  }

  return (
    <div>
      <h1>Visual Text Editor</h1>
      <DisplayArea textElements={textElements} searchQuery={searchQuery} />
      <StylePanel
        currentStyle={currentStyle}
        onStyleChange={handleStyleChange}
        applyMode={applyMode}
        onModeChange={setApplyMode}
      />
      <DeletePanel
        onDeleteChar={handleDeleteChar}
        onDeleteWord={handleDeleteWord}
        onClearAll={handleClearAll}
      />
      <AdvancedPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onReplace={handleReplace}
        onUndo={handleUndo}
        canUndo={textHistory.length > 0}
      />
      <KeyboardArea onAddCharacter={handleAddCharacter} />
    </div>
  )
}

export default App
