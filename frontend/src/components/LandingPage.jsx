import { useState } from 'react'
import './LandingPage.css'

function LandingPage({ onUsernameSubmit }) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters')
      return
    }

    setError('')
    onUsernameSubmit(username.trim())
  }

  return (
    <div className="landing-page">
      <div className="landing-content">
        <div className="logo-container">
          <h1 className="logo">Vacation Scrapbook</h1>
          <p className="tagline">Capture your adventures, one trip at a time</p>
        </div>

        <form className="username-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              className="username-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              autoFocus
            />
            {error && <p className="error-message">{error}</p>}
          </div>
          
          <button type="submit" className="submit-button">
            Start Your Journey
            <span className="button-arrow">→</span>
          </button>
        </form>

        <div className="features-preview">
          <div className="feature-card">
            <p>Plan Trips</p>
          </div>
          <div className="feature-card">
            <p>Add Locations</p>
          </div>
          <div className="feature-card">
            <p>Create Memories</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

