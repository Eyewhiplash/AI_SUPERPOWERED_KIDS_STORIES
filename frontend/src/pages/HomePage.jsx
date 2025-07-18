import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
  const currentTheme = themes[selectedTheme] || themes.candy

  const mainStyle = {
    background: currentTheme.background,
    minHeight: '100vh',
    paddingTop: '48px',
    paddingBottom: '60px',
    margin: 0,
    width: '100vw',
    transition: 'all 0.5s ease',
    
  }

  const containerStyle = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    textAlign: 'center'
  }

  const titleStyle = {
    fontSize: '32px',
    color: currentTheme.textColor,
    marginBottom: '10px',
    fontWeight: '700',
    textShadow: selectedTheme === 'space' || selectedTheme === 'ocean' ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none',
    fontFamily: 'Comic Sans MS, cursive'
  }

  const subtitleStyle = {
    fontSize: '20px',
    color: currentTheme.textColor,
    marginBottom: '20px',
    opacity: 0.8,
    fontWeight: '400',
    fontFamily: 'Comic Sans MS, cursive'
  }

  const cardContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginTop: '60px',
    flexWrap: 'wrap'
  }

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '12px',
    padding: '20px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    cursor: 'pointer',
    margin: '0',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    width: '280px',
    height: '180px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }

  const cardTitleStyle = {
    fontSize: '16px',
    color: '#1f2937',
    marginBottom: '6px',
    fontWeight: '700',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0',
    margin: '0 0 6px 0'
  }

  const cardTextStyle = {
    fontSize: '12px',
    color: '#6b7280',
    lineHeight: '1.3',
    backgroundColor: 'transparent !important',
    border: 'none',
    padding: '0',
    margin: '0',
    boxShadow: 'none',
    outline: 'none'
  }

  const emojiStyle = {
    fontSize: '32px',
    marginBottom: '10px',
    display: 'block',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0',
    margin: '0 0 10px 0'
  }

  return (
    <div style={mainStyle}>
      <div style={containerStyle}>
        <div style={titleStyle}>AI Berättelser för Barn</div>
        <div style={subtitleStyle}>Skapa magiska äventyr med artificiell intelligens</div>
        
        <div style={cardContainerStyle}>
          <div 
            style={cardStyle}
            onClick={() => navigate('/create-story')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ 
              fontSize: '32px', 
              marginBottom: '10px',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0',
              margin: '0 0 10px 0',
              fontFamily: 'Comic Sans MS, cursive'
            }}>📚</div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              marginBottom: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0',
              margin: '0 0 6px 0',
              fontFamily: 'Comic Sans MS, cursive'
            }}>
              Sagor
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              lineHeight: '1.3',
              backgroundColor: 'transparent !important',
              border: 'none',
              padding: '0',
              margin: '0',
              boxShadow: 'none',
              outline: 'none',
              fontFamily: 'Comic Sans MS, cursive'
            }}>
              Läs sparade sagor eller skapa nya magiska berättelser för ditt barn
            </div>
          </div>

          <div 
            style={cardStyle}
            onClick={() => navigate('/calculator')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ 
              fontSize: '32px', 
              marginBottom: '10px',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0',
              margin: '0 0 10px 0',
              fontFamily: 'Comic Sans MS, cursive'
            }}>🧮</div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              marginBottom: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0',
              margin: '0 0 6px 0',
              fontFamily: 'Comic Sans MS, cursive'
            }}>
              Miniräknare
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              lineHeight: '1.3',
              backgroundColor: 'transparent !important',
              border: 'none',
              padding: '0',
              margin: '0',
              boxShadow: 'none',
              outline: 'none',
              fontFamily: 'Comic Sans MS, cursive'
            }}>
              Lär dig matematik på ett roligt sätt med färgglad miniräknare
            </div>
          </div>

          <div 
            style={cardStyle}
            onClick={() => navigate('/drawing')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
                         <div style={{ 
               fontSize: '32px', 
               marginBottom: '10px',
               backgroundColor: 'transparent',
               border: 'none',
               padding: '0',
               margin: '0 0 10px 0',
               fontFamily: 'Comic Sans MS, cursive'
             }}>✏️</div>
             <div style={{ 
               fontSize: '16px', 
               fontWeight: '700', 
               marginBottom: '6px',
               backgroundColor: 'transparent',
               border: 'none',
               padding: '0',
               margin: '0 0 6px 0',
               fontFamily: 'Comic Sans MS, cursive'
             }}>
               Ritplatta
             </div>
             <div style={{ 
               fontSize: '12px', 
               color: '#6b7280', 
               lineHeight: '1.3',
               backgroundColor: 'transparent !important',
               border: 'none',
               padding: '0',
               margin: '0',
               boxShadow: 'none',
               outline: 'none',
               fontFamily: 'Comic Sans MS, cursive'
             }}>
               Rita och måla med färger, verktyg och magiska stämplar
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage 