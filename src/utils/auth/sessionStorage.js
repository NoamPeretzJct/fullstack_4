const SESSION_STORAGE_KEY = 'editor_current_user'

export function getCurrentSessionUser() {
  return localStorage.getItem(SESSION_STORAGE_KEY) || ''
}

export function setCurrentSessionUser(username) {
  localStorage.setItem(SESSION_STORAGE_KEY, username)
}

export function clearCurrentSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY)
}
