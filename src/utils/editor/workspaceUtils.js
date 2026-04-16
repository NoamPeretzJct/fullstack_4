import { createDocument } from './documentLifecycle'

export function getActiveDocument(documents, activeDocumentId) {
  return documents.find((doc) => doc.id === activeDocumentId) || documents[0]
}

export function findDocumentById(documents, documentId) {
  return documents.find((doc) => doc.id === documentId)
}

export function findDocumentByFileName(documents, fileName) {
  return documents.find((doc) => doc.fileName === fileName)
}

export function appendNewDocument(documents) {
  const newDoc = createDocument()
  return {
    documents: [...documents, newDoc],
    activeDocumentId: newDoc.id,
  }
}

export function createInitialWorkspaceState() {
  const newDoc = createDocument()
  return {
    documents: [newDoc],
    activeDocumentId: newDoc.id,
  }
}

export function loadDocumentIntoWorkspace(documents, activeDocumentId, docData) {
  const normalizedDocument = {
    textElements: docData?.textElements || [],
    fileName: docData?.fileName || '',
  }

  const activeDoc = getActiveDocument(documents, activeDocumentId)
  const isEmptyAndUnnamed =
    !activeDoc?.fileName && activeDoc?.textElements.length === 0

  if (isEmptyAndUnnamed) {
    return {
      documents: documents.map((doc) =>
        doc.id === activeDocumentId
          ? {
              ...doc,
              textElements: normalizedDocument.textElements,
              textHistory: [],
              fileName: normalizedDocument.fileName,
              isDirty: false,
            }
          : doc,
      ),
      activeDocumentId,
    }
  }

  const newDoc = createDocument({
    textElements: normalizedDocument.textElements,
    textHistory: [],
    fileName: normalizedDocument.fileName,
    isDirty: false,
  })

  return {
    documents: [...documents, newDoc],
    activeDocumentId: newDoc.id,
  }
}

export function removeDocumentFromWorkspace(documents, activeDocumentId, documentId) {
  let remainingDocs = documents.filter((doc) => doc.id !== documentId)

  if (remainingDocs.length === 0) {
    remainingDocs = [createDocument()]
  }

  return {
    documents: remainingDocs,
    activeDocumentId:
      activeDocumentId === documentId ? remainingDocs[0].id : activeDocumentId,
  }
}
