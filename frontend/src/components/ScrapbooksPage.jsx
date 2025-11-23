import { useState, useEffect, useRef } from 'react'
import Slideshow from './Slideshow'
import './ScrapbooksPage.css'

function ScrapbooksPage({ username, userData, onLogout }) {
  const [trips, setTrips] = useState([])
  const [expandedTripId, setExpandedTripId] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [uploadingTripId, setUploadingTripId] = useState(null)
  const [slideshowOpen, setSlideshowOpen] = useState(false)
  const [slideshowPhotos, setSlideshowPhotos] = useState([])
  const [slideshowStartIndex, setSlideshowStartIndex] = useState(0)
  const [editingTripId, setEditingTripId] = useState(null)
  const [editedName, setEditedName] = useState('')
  const [addingLocationToTrip, setAddingLocationToTrip] = useState(null)
  const [newLocationName, setNewLocationName] = useState('')
  const [newLocationDate, setNewLocationDate] = useState('')
  const fileInputRef = useRef(null)

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

  const handleAddPhotos = (tripId, e) => {
    e.stopPropagation()
    setUploadingTripId(tripId)
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0 || !uploadingTripId) return

    const formData = new FormData()
    files.forEach(file => {
      formData.append('photos', file)
    })

    try {
      const response = await fetch(`http://localhost:5000/api/trip/${uploadingTripId}/photos`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (data.success) {
        // Update the trips list with the new trip data
        setTrips(trips.map(trip =>
          trip.trip_id === uploadingTripId ? data.trip : trip
        ))
      }
    } catch (error) {
      console.error('Error uploading photos:', error)
    } finally {
      setUploadingTripId(null)
      e.target.value = '' // Reset file input
    }
  }

  const openSlideshow = (photos, startIndex, e) => {
    e.stopPropagation()
    setSlideshowPhotos(photos)
    setSlideshowStartIndex(startIndex)
    setSlideshowOpen(true)
  }

  const closeSlideshow = () => {
    setSlideshowOpen(false)
  }

  const startEditingTrip = (trip, e) => {
    e.stopPropagation()
    setEditingTripId(trip.trip_id)
    setEditedName(trip.name)
  }

  const cancelEditingName = (e) => {
    e.stopPropagation()
    setEditingTripId(null)
    setEditedName('')
  }

  const saveEditedName = async (tripId, e) => {
    e.stopPropagation()

    if (!editedName.trim()) {
      cancelEditingName(e)
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/trip/${tripId}/name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedName.trim() }),
      })
      const updatedTrip = await response.json()

      // Update the trips list with the updated trip
      setTrips(trips.map(trip =>
        trip.trip_id === tripId ? updatedTrip : trip
      ))
      setEditingTripId(null)
      setEditedName('')
    } catch (error) {
      console.error('Error updating trip name:', error)
    }
  }

  const handleNameKeyPress = (tripId, e) => {
    if (e.key === 'Enter') {
      saveEditedName(tripId, e)
    } else if (e.key === 'Escape') {
      cancelEditingName(e)
    }
  }

  const startAddingLocation = (tripId, e) => {
    e.stopPropagation()
    setAddingLocationToTrip(tripId)
    setNewLocationName('')
    setNewLocationDate('')
  }

  const cancelAddingLocation = (e) => {
    e.stopPropagation()
    setAddingLocationToTrip(null)
    setNewLocationName('')
    setNewLocationDate('')
  }

  const saveNewLocation = async (tripId, e) => {
    e.stopPropagation()

    if (!newLocationName.trim()) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/trip/${tripId}/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newLocationName.trim(),
          date_visited: newLocationDate
        }),
      })
      const updatedTrip = await response.json()

      setTrips(trips.map(trip =>
        trip.trip_id === tripId ? updatedTrip : trip
      ))
      setAddingLocationToTrip(null)
      setNewLocationName('')
      setNewLocationDate('')
    } catch (error) {
      console.error('Error adding location:', error)
    }
  }

  const deleteLocation = async (tripId, locationId, e) => {
    e.stopPropagation()

    if (!confirm('Delete this location?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/trip/${tripId}/locations/${locationId}`, {
        method: 'DELETE',
      })
      const updatedTrip = await response.json()

      setTrips(trips.map(trip =>
        trip.trip_id === tripId ? updatedTrip : trip
      ))
    } catch (error) {
      console.error('Error deleting location:', error)
    }
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
                        src={`http://localhost:5000/api/photo/${trip.photos[0]}`}
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
                        <span className="stat-icon"></span>
                        {trip.photos?.length || 0} photos
                      </span>
                      <span className="stat">
                        <span className="stat-icon"></span>
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
                    {/* Trip Name Editing */}
                    {editingTripId === trip.trip_id && (
                      <div className="expanded-section">
                        <h4 className="section-title">Edit Trip Name</h4>
                        <div className="trip-name-edit">
                          <input
                            type="text"
                            className="trip-name-input"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            onKeyDown={(e) => handleNameKeyPress(trip.trip_id, e)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Enter trip name"
                            autoFocus
                          />
                          <button
                            className="name-edit-save"
                            onClick={(e) => saveEditedName(trip.trip_id, e)}
                            title="Save (Enter)"
                          >
                            ✓
                          </button>
                          <button
                            className="name-edit-cancel"
                            onClick={cancelEditingName}
                            title="Cancel (Escape)"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="expanded-section">
                      <h4 className="section-title">Locations</h4>
                      {trip.locations && trip.locations.length > 0 ? (
                        <ul className="locations-list">
                          {trip.locations.map((location) => (
                            <li key={location.location_id} className="location-item">
                              <div className="location-info">
                                <span className="location-name">{location.name || 'Unnamed Location'}</span>
                                {location.date_visited && (
                                  <span className="location-date">{location.date_visited}</span>
                                )}
                              </div>
                              <button
                                className="location-delete"
                                onClick={(e) => deleteLocation(trip.trip_id, location.location_id, e)}
                                title="Delete location"
                              >
                                ✕
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="empty-text">No locations added yet</p>
                      )}

                      {/* Add Location Form */}
                      {addingLocationToTrip === trip.trip_id && (
                        <div className="add-location-form">
                          <input
                            type="text"
                            className="location-name-input"
                            placeholder="Location name"
                            value={newLocationName}
                            onChange={(e) => setNewLocationName(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <input
                            type="date"
                            className="location-date-input"
                            value={newLocationDate}
                            onChange={(e) => setNewLocationDate(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            className="location-save"
                            onClick={(e) => saveNewLocation(trip.trip_id, e)}
                            title="Save location"
                          >
                            ✓
                          </button>
                          <button
                            className="location-cancel"
                            onClick={cancelAddingLocation}
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="expanded-section">
                      <h4 className="section-title">Photo Gallery</h4>
                      {trip.photos && trip.photos.length > 0 ? (
                        <div className="photo-grid">
                          {trip.photos.map((photoId, index) => (
                            <div
                              key={index}
                              className="photo-thumbnail"
                              onClick={(e) => openSlideshow(trip.photos, index, e)}
                            >
                              <img
                                src={`http://localhost:5000/api/photo/${photoId}`}
                                alt={`Photo ${index + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="empty-text">No photos added yet</p>
                      )}
                    </div>

                    <div className="trip-actions">
                      <button
                        className="action-button primary"
                        onClick={(e) => startEditingTrip(trip, e)}
                      >
                        {editingTripId === trip.trip_id ? 'Editing...' : 'Edit Trip'}
                      </button>
                      <button
                        className="action-button secondary"
                        onClick={(e) => handleAddPhotos(trip.trip_id, e)}
                        disabled={uploadingTripId === trip.trip_id}
                      >
                        {uploadingTripId === trip.trip_id ? 'Uploading...' : 'Add Photos'}
                      </button>
                      <button
                        className="action-button secondary"
                        onClick={(e) => startAddingLocation(trip.trip_id, e)}
                      >
                        {addingLocationToTrip === trip.trip_id ? 'Adding...' : 'Add Location'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden file input for photo uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Slideshow Overlay */}
      <Slideshow
        photoIds={slideshowPhotos}
        isOpen={slideshowOpen}
        onClose={closeSlideshow}
        startIndex={slideshowStartIndex}
      />
    </div>
  )
}

export default ScrapbooksPage
