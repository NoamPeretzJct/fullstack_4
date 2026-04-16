import { normalizeFileName } from './fileNameUtils'

const FILE_INDEX_STORAGE_KEY = 'editor_files_index'

export function getStoredFileIndex() {
  return JSON.parse(localStorage.getItem(FILE_INDEX_STORAGE_KEY)) || []
}

export function saveFileIndex(fileIndex) {
  localStorage.setItem(FILE_INDEX_STORAGE_KEY, JSON.stringify(fileIndex))
}

export function formatDocumentForSave(documentToSave) {
  return JSON.stringify(documentToSave?.textElements || [])
}

export function writeDocumentToStorage(fileName, documentToSave) {
  const cleanName = normalizeFileName(fileName)
  localStorage.setItem(
    `editor_file_${cleanName}`,
    formatDocumentForSave(documentToSave),
  )
}

export function readDocumentFromStorage(fileName) {
  const cleanName = normalizeFileName(fileName)
  return localStorage.getItem(`editor_file_${cleanName}`)
}

export function openDocumentFromStorage(fileName) {
  const cleanName = normalizeFileName(fileName)
  if (!cleanName) {
    return { success: false, error: 'Please select a file' }
  }

  const data = readDocumentFromStorage(cleanName)
  if (!data) {
    return { success: false, error: 'File not found' }
  }

  return {
    success: true,
    fileName: cleanName,
    textElements: JSON.parse(data),
  }
}
