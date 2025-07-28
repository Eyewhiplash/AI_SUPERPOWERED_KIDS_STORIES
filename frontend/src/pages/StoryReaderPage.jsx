import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const themes = {
  candy: {
    background: 'linear-gradient(135deg, #fce7f3 0%, #e0e7ff 50%, #dbeafe 100%)',
    textColor: '#374151'
  },
  tropical: {
    background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 50%, #fbbf24 100%)',
    textColor: '#1f2937'
  },
  space: {
    background: 'linear-gradient(135deg, #312e81 0%, #581c87 50%, #000000 100%)',
    textColor: '#f9fafb'
  },
  rainbow: {
    background: 'linear-gradient(90deg, #f87171 0%, #fbbf24 25%, #34d399 50%, #60a5fa 75%, #a78bfa 100%)',
    textColor: '#1f2937'
  },
  ocean: {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
    textColor: '#f9fafb'
  }
}

const StoryReaderPage = ({ selectedTheme = 'candy' }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentTheme = themes[selectedTheme] || themes.candy
  const { story, storyData } = location.state || {}
  const [isSaved, setIsSaved] = useState(false)

  if (!story) {
    return (
      <div style={{
        minHeight: '100vh',
        background: currentTheme.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>Ingen saga hittades</h2>
          <button
            onClick={() => navigate('/create-story')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Skapa en ny saga
          </button>
        </div>
      </div>
    )
  }

  const mainStyle = {
    minHeight: '100vh',
    background: currentTheme.background,
    padding: '100px 20px 120px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }

  const containerStyle = {
    maxWidth: '800px',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '30px',
    textAlign: 'center',
    lineHeight: '1.2'
  }

  const storyStyle = {
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#374151',
    marginBottom: '40px',
    textAlign: 'left',
    whiteSpace: 'pre-line'
  }

  const buttonContainerStyle = {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  }

  const secondaryButtonStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#1f2937',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }

  return (
    <div style={mainStyle}>
      <button
        onClick={() => navigate('/create-story')}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#1f2937',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '20px',
          alignSelf: 'flex-start'
        }}
      >
        <span>←</span>
        <span>Tillbaka</span>
      </button>

      <div style={containerStyle}>
        <h1 style={titleStyle}>{story.title}</h1>
        
        <div style={storyStyle}>
          {story.content}
        </div>

        <div style={buttonContainerStyle}>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: isSaved ? '#10b981' : '#f59e0b'
            }}
            onClick={async () => {
              if (isSaved) return
              
              try {
                // Save story to user's library (already saved by backend)
                setIsSaved(true)
                setTimeout(() => {
                  navigate('/create-story', { state: { showLibrary: true } })
                }, 1000)
              } catch (err) {
                alert('Kunde inte spara saga')
              }
            }}
            onMouseEnter={(e) => {
              if (!isSaved) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaved) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)'
              }
            }}
          >
            {isSaved ? '✅ Sparad!' : '💾 Spara i bibliotek'}
          </button>

          <button
            style={buttonStyle}
            onClick={() => navigate('/create-story')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            📝 Skapa ny saga
          </button>
          
          <button
            style={secondaryButtonStyle}
            onClick={() => navigate('/')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.backgroundColor = '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
            }}
          >
            🏠 Hem
          </button>
        </div>
      </div>
    </div>
  )
}

export default StoryReaderPage 