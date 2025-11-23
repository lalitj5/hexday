import { useState, useEffect } from 'react'
import './Slideshow.css'

function Slideshow({ photoIds, isOpen, onClose, startIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex)

  useEffect(() => {
    setCurrentIndex(startIndex)
  }, [startIndex])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen, currentIndex, photoIds])

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === photoIds.length - 1 ? 0 : prevIndex + 1
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photoIds.length - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  if (!isOpen || !photoIds || photoIds.length === 0) {
    return null
  }

  return (
    <div className="slideshow-overlay" onClick={onClose}>
      <div className="slideshow-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="slideshow-close" onClick={onClose} aria-label="Close slideshow">
          ×
        </button>

        <div className="slideshow-content">
          {/* Previous Button */}
          {photoIds.length > 1 && (
            <button
              className="slideshow-arrow prev"
              onClick={goToPrevious}
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}

          {/* Photo Display */}
          <div className="slideshow-image-container">
            <img
              src={`http://localhost:5000/api/photo/${photoIds[currentIndex]}`}
              alt={`Photo ${currentIndex + 1}`}
              className="slideshow-image"
            />
          </div>

          {/* Next Button */}
          {photoIds.length > 1 && (
            <button
              className="slideshow-arrow next"
              onClick={goToNext}
              aria-label="Next photo"
            >
              ›
            </button>
          )}
        </div>

        {/* Dot Indicators */}
        {photoIds.length > 1 && (
          <div className="slideshow-dots">
            {photoIds.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Photo Counter */}
        <div className="slideshow-counter">
          {currentIndex + 1} / {photoIds.length}
        </div>
      </div>
    </div>
  )
}

export default Slideshow
