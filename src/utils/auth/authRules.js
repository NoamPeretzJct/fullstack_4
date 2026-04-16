export function validateRequiredCredentials(username, password) {
  if (!username || !password) {
    return { success: false, error: 'Please fill in all fields' }
  }

  return { success: true }
}

export function validateLogin(users, username, password) {
  const user = users.find(
    (candidate) =>
      candidate.username === username && candidate.password === password,
  )

  if (!user) {
    return { success: false, error: 'Invalid username or password' }
  }

  return { success: true, username }
}

export function registerUser(users, username, password) {
  const existingUser = users.find(
    (candidate) => candidate.username === username,
  )

  if (existingUser) {
    return { success: false, error: 'Username already exists' }
  }

  return {
    success: true,
    username,
    users: [...users, { username, password }],
  }
}
