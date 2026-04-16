import DisplayArea from './DisplayArea/DisplayArea'
import './Workspace.css'

function Workspace({
  documents,
  activeDocumentId,
  searchQuery,
  onDocumentSelect,
  onDocumentClose,
}) {
  return (
    <main className="workspace">
      <div className="workspace__documents">
        {documents.map((doc) => (
          <DisplayArea
            key={doc.id}
            textElements={doc.textElements}
            searchQuery={searchQuery}
            isActive={doc.id === activeDocumentId}
            onClick={() => onDocumentSelect(doc.id)}
            onClose={() => onDocumentClose(doc.id)}
          />
        ))}
      </div>
    </main>
  )
}

export default Workspace
