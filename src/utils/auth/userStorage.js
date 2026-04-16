const USERS_STORAGE_KEY = 'editor_users_db'

export function getStoredUsers() {
  return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || []
}

export function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}
