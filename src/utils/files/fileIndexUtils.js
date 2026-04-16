import { normalizeFileName } from './fileNameUtils'
import { getStoredFileIndex } from './fileStorage'

export function hasIndexedFile(fileIndex, currentUser, fileName) {
  const cleanName = normalizeFileName(fileName)
  return fileIndex.some(
    (file) => file.owner === currentUser && file.name === cleanName,
  )
}

export function appendFileIndexEntry(fileIndex, currentUser, fileName) {
  const cleanName = normalizeFileName(fileName)
  return [...fileIndex, { name: cleanName, owner: currentUser }]
}

export function getUserFileNames(currentUser) {
  if (!currentUser) {
    return []
  }

  return getStoredFileIndex()
    .filter((file) => file.owner === currentUser)
    .map((file) => file.name)
}

export function fileExists(currentUser, fileName) {
  const cleanName = normalizeFileName(fileName)
  return getUserFileNames(currentUser).includes(cleanName)
}
