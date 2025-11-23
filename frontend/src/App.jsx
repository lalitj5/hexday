import { useState, useEffect} from 'react'
import LandingPage from './components/LandingPage'
import ScrapbooksPage from './components/ScrapbooksPage'
import './App.css'

function App() {
  const [username, setUsername] = useState(null)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    if (username) {
      fetch(`http://localhost:5000/api/user/${username}`)
        .then(response => response.json())
        .then(data => {
          setUserData(data)
          console.log(data)  // Check what you're getting
        })
    }
  }, [username])

  const handleLogout = () => {
    setUsername(null)
    setUserData(null)
  }

  if (!username) {
    return <LandingPage onUsernameSubmit={setUsername} />
  }

  return (
    <ScrapbooksPage
      username={username}
      userData={userData}
      onLogout={handleLogout}
    />
  )
}

export default App

