import { useState } from 'react'
import './Auth.css'

export default function Auth({ onLogin }) {
  // מצב שקובע האם אנחנו במסך התחברות או הרשמה
  const [isLoginMode, setIsLoginMode] = useState(true)
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault() // מונע מהטופס לרענן את הדף
    
    if (!username || !password) {
      setError('Please fill in all fields')
      return
    }

    // מביאים את "מסד הנתונים" שלנו מה-Local Storage
    const users = JSON.parse(localStorage.getItem('editor_users_db')) || []

    if (isLoginMode) {
      // תהליך התחברות
      const user = users.find(u => u.username === username && u.password === password)
      if (user) {
        onLogin(username)
      } else {
        setError('Invalid username or password')
      }
    } else {
      // תהליך הרשמה
      const exists = users.find(u => u.username === username)
      if (exists) {
        setError('Username already exists')
      } else {
        users.push({ username, password })
        localStorage.setItem('editor_users_db', JSON.stringify(users))
        onLogin(username) // מחברים את המשתמש מיד אחרי ההרשמה
      }
    }
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

        <p className="auth-switch-mode" onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}>
          {isLoginMode ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </form>
    </div>
  )
}