import { useState } from 'react'
import {
  validateRequiredCredentials,
  validateLogin,
  registerUser,
} from '../../utils/auth/authRules'
import {
  getStoredUsers,
  saveUsers,
} from '../../utils/auth/userStorage'
import { setCurrentSessionUser } from '../../utils/auth/sessionStorage'
import './Auth.css'

export default function Auth({ onAuthenticated }) {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleModeToggle() {
    setIsLoginMode((prev) => !prev)
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()

    const requiredResult = validateRequiredCredentials(username, password)
    if (!requiredResult.success) {
      setError(requiredResult.error)
      return
    }

    const users = getStoredUsers()
    const authResult = isLoginMode
      ? validateLogin(users, username, password)
      : registerUser(users, username, password)

    if (!authResult.success) {
      setError(authResult.error)
      return
    }

    if (!isLoginMode) {
      saveUsers(authResult.users)
    }

    setCurrentSessionUser(authResult.username)
    setError('')
    onAuthenticated(authResult.username)
  }

  return (
    <div className="auth-wrapper">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>{isLoginMode ? 'Welcome Back' : 'Create Account'}</h2>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>

        <div className="auth-input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <button type="submit" className="auth-submit-btn">
          {isLoginMode ? 'Login' : 'Register'}
        </button>

        <p className="auth-switch-mode" onClick={handleModeToggle}>
          {isLoginMode ? "Don't have an account? Register" : 'Already have an account? Login'}
        </p>
      </form>
    </div>
  )
}
