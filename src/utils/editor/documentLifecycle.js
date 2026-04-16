export function createDocument(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    textElements: [],
    textHistory: [],
    fileName: '',
    isDirty: false,
    ...overrides,
  }
}

export function updateActiveDocument(documents, activeDocumentId, updaterFn, saveHistory = true) {
  return documents.map((doc) => {
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
  })
}

export function undoActiveDocument(documents, activeDocumentId) {
  return documents.map((doc) => {
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
  })
}

export function markDocumentSaved(documents, documentId, fileName) {
  return documents.map((doc) =>
    doc.id === documentId
      ? { ...doc, fileName: fileName ?? doc.fileName, isDirty: false }
      : doc,
  )
}
