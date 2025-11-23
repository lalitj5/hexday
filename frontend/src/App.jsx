import { useState } from 'react'
import LandingPage from './components/LandingPage'
import './App.css'

function App() {
  const [username, setUsername] = useState(null)

  if (!username) {
    return <LandingPage onUsernameSubmit={setUsername} />
  }

  return (
    <div className="app">
      <h1>Welcome, {username}!</h1>
      {/* Future: Add trip planning components here */}
    </div>
  )
}

export default App

