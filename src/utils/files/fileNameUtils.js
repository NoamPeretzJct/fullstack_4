export function normalizeFileName(fileName) {
  return (fileName || '').trim()
}

export function isValidFileName(fileName) {
  return normalizeFileName(fileName).length > 0
}

export function shouldConfirmOverwrite(requestedName, currentFileName, existsForUser) {
  const cleanRequestedName = normalizeFileName(requestedName)
  return cleanRequestedName !== currentFileName && existsForUser
}
