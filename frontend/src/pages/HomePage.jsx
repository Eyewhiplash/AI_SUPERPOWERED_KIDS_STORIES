import React, { useState } from 'react'

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

const HomePage = ({ selectedTheme = 'candy' }) => {
  const currentTheme = themes[selectedTheme] || themes.candy

  const mainStyle = {
    background: currentTheme.background,
    minHeight: '100vh',
    paddingTop: '48px',
    paddingBottom: '60px',
    margin: 0,
    width: '100vw',
    transition: 'all 0.5s ease'
  }

  const containerStyle = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    textAlign: 'center'
  }

  const titleStyle = {
    fontSize: '48px',
    color: currentTheme.textColor,
    marginBottom: '16px',
    fontWeight: '700',
    textShadow: selectedTheme === 'space' || selectedTheme === 'ocean' ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none'
  }

  const subtitleStyle = {
    fontSize: '20px',
    color: currentTheme.textColor,
    marginBottom: '40px',
    opacity: 0.8,
    fontWeight: '400'
  }

  const cardContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginTop: '60px'
  }

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    padding: '32px 24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }

  const cardTitleStyle = {
    fontSize: '24px',
    color: '#1f2937',
    marginBottom: '12px',
    fontWeight: '600'
  }

  const cardTextStyle = {
    fontSize: '16px',
    color: '#4b5563',
    lineHeight: '1.6'
  }

  const emojiStyle = {
    fontSize: '48px',
    marginBottom: '16px',
    display: 'block'
  }

  return (
    <div style={mainStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>AI Berättelser för Barn</h1>
        <p style={subtitleStyle}>Skapa magiska äventyr med artificiell intelligens</p>
        
        <div style={cardContainerStyle}>
          <div 
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
            <span style={emojiStyle}>📚</span>
            <h3 style={cardTitleStyle}>Skapa Berättelser</h3>
            <p style={cardTextStyle}>
              Använd AI för att skapa unika och personliga berättelser för ditt barn
            </p>
          </div>

          <div 
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
            <span style={emojiStyle}>🎨</span>
            <h3 style={cardTitleStyle}>Anpassa Äventyr</h3>
            <p style={cardTextStyle}>
              Välj karaktärer, miljöer och teman som passar ditt barns intressen
            </p>
          </div>

          <div 
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
            <span style={emojiStyle}>💾</span>
            <h3 style={cardTitleStyle}>Spara Favoritberättelser</h3>
            <p style={cardTextStyle}>
              Spara och återbesök dina favoritberättelser när som helst
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage 