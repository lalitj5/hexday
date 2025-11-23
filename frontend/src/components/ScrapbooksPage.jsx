import { useState, useEffect } from 'react'
import './ScrapbooksPage.css'

function ScrapbooksPage({ username, userData, onLogout }) {
  const [trips, setTrips] = useState([])
  const [expandedTripId, setExpandedTripId] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (username) {
      fetchTrips()
    }
  }, [username])

  const fetchTrips = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${username}/trips`)
      const data = await response.json()
      setTrips(data)
    } catch (error) {
      console.error('Error fetching trips:', error)
    }
  }

  const handleCreateTrip = async () => {
    if (!userData?.user_id) return

    setIsCreating(true)
    try {
      const response = await fetch('http://localhost:5000/api/trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userData.user_id }),
      })
      const newTrip = await response.json()
      setTrips([...trips, newTrip])
    } catch (error) {
      console.error('Error creating trip:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const toggleExpand = (tripId) => {
    setExpandedTripId(expandedTripId === tripId ? null : tripId)
  }

  return (
    <div className="scrapbooks-page">
      <div className="scrapbooks-container">
        <header className="scrapbooks-header">
          <div className="header-content">
            <h1 className="header-title">My Scrapbooks</h1>
            <div className="header-user">
              <span className="username-display">{username}</span>
              <button className="logout-button" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="create-trip-section">
          <button
            className="create-trip-button"
            onClick={handleCreateTrip}
            disabled={isCreating}
          >
            <span className="button-icon">+</span>
            {isCreating ? 'Creating...' : 'Create New Trip'}
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">No trips yet. Start your first adventure!</p>
          </div>
        ) : (
          <div className="trips-grid">
            {trips.map((trip) => (
              <div
                key={trip.trip_id}
                className={`trip-card ${expandedTripId === trip.trip_id ? 'expanded' : ''}`}
                onClick={() => toggleExpand(trip.trip_id)}
              >
                <div className="trip-card-main">
                  <div className="trip-cover">
                    {trip.photos && trip.photos.length > 0 ? (
                      <img
                        src={trip.photos[0]}
                        alt={trip.name}
                        className="cover-image"
                      />
                    ) : (
                      <div className="cover-placeholder">
                        <span className="placeholder-icon">📸</span>
                      </div>
                    )}
                  </div>
                  <div className="trip-info">
                    <h3 className="trip-name">{trip.name}</h3>
                    <div className="trip-stats">
                      <span className="stat">
                        <span className="stat-icon">📷</span>
                        {trip.photos?.length || 0} photos
                      </span>
                      <span className="stat">
                        <span className="stat-icon">📍</span>
                        {trip.locations?.length || 0} locations
                      </span>
                    </div>
                  </div>
                  <div className="expand-indicator">
                    <span className="expand-arrow">
                      {expandedTripId === trip.trip_id ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                {expandedTripId === trip.trip_id && (
                  <div className="trip-card-expanded">
                    <div className="expanded-section">
                      <h4 className="section-title">Locations</h4>
                      {trip.locations && trip.locations.length > 0 ? (
                        <ul className="locations-list">
                          {trip.locations.map((location) => (
                            <li key={location.location_id} className="location-item">
                              {location.name || 'Unnamed Location'}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="empty-text">No locations added yet</p>
                      )}
                    </div>

                    <div className="expanded-section">
                      <h4 className="section-title">Photo Gallery</h4>
                      {trip.photos && trip.photos.length > 0 ? (
                        <div className="photo-grid">
                          {trip.photos.map((photo, index) => (
                            <div key={index} className="photo-thumbnail">
                              <img src={photo} alt={`Photo ${index + 1}`} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="empty-text">No photos added yet</p>
                      )}
                    </div>

                    <div className="trip-actions">
                      <button className="action-button primary">Edit Trip</button>
                      <button className="action-button secondary">Add Photos</button>
                      <button className="action-button secondary">Add Location</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ScrapbooksPage
