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

const CreateStoryPage = ({ selectedTheme = 'candy' }) => {
  const navigate = useNavigate()
  const currentTheme = themes[selectedTheme] || themes.candy
  const [currentView, setCurrentView] = useState('main') // 'main', 'bibliotek', 'ny-saga', 'sparade-sagor', 'universella-sagor'

  const mainStyle = {
    minHeight: '100vh',
    background: currentTheme.background,
    padding: '40px 20px',
    fontFamily: 'Comic Sans MS, cursive',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
    width: '100%'
  }

  const buttonStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '16px',
    padding: '60px 60px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    cursor: 'pointer',
    margin: '0',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    width: '400px',
    height: '250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',

    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }



  const renderMainView = () => (
    <>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '24px',
        flexWrap: 'nowrap',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <button 
          style={buttonStyle}
          onClick={() => setCurrentView('bibliotek')}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px)'
            e.target.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📖</div>
          <div>Bibliotek</div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>
            Läs sparade & universella sagor
          </div>
        </button>
        
        <button 
          style={buttonStyle}
          onClick={() => setCurrentView('ny-saga')}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px)'
            e.target.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>✨</div>
          <div>Ny saga</div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>
            Skapa en ny magisk berättelse
          </div>
        </button>
      </div>
    </>
  )

  const renderBibliotekView = () => (
    <>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '24px',
        flexWrap: 'nowrap',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <button 
          style={buttonStyle}
          onClick={() => setCurrentView('sparade-sagor')}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px)'
            e.target.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>💾</div>
          <div>Sparade sagor</div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>
            Dina egna skapade berättelser
          </div>
        </button>
        
        <button 
          style={buttonStyle}
          onClick={() => setCurrentView('universella-sagor')}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px)'
            e.target.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🌟</div>
          <div>Universella sagor</div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>
            Klassiska sagor för alla barn
          </div>
        </button>
      </div>
    </>
  )

  const renderNySagaView = () => (
    <>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '24px'
      }}>
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          borderRadius: '20px', 
          padding: '40px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚧</div>
          <p style={{ fontSize: '18px', color: '#1f2937', marginBottom: '15px', fontWeight: '600' }}>
            Magisk sagoskapare
          </p>
          <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.5' }}>
            Snart kan du skapa fantastiska sagor med AI-hjälp! Funktionen utvecklas just nu.
          </p>
        </div>
      </div>
    </>
  )

  const renderSparadeSagorView = () => (
    <>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '24px'
      }}>
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          borderRadius: '20px', 
          padding: '40px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          textAlign: 'center',
          width: '400px',
          height: '250px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>💾</div>
          <p style={{ fontSize: '18px', color: '#1f2937', marginBottom: '15px', fontWeight: '600' }}>
            Sparade sagor
          </p>
          <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.5' }}>
            Här kommer dina egna skapade berättelser att visas. Funktionen byggs snart!
          </p>
        </div>
      </div>
    </>
  )

  const renderUniversellaSagorView = () => (
    <>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '24px'
      }}>
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          borderRadius: '20px', 
          padding: '40px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          textAlign: 'center',
          width: '400px',
          height: '250px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🌟</div>
          <p style={{ fontSize: '18px', color: '#1f2937', marginBottom: '15px', fontWeight: '600' }}>
            Universella sagor
          </p>
          <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.5' }}>
            Klassiska sagor för alla barn kommer snart att finnas här!
          </p>
        </div>
      </div>
    </>
  )

  return (
    <div style={mainStyle}>
      <div style={containerStyle}>
        {currentView === 'main' && renderMainView()}
        {currentView === 'bibliotek' && renderBibliotekView()}
        {currentView === 'ny-saga' && renderNySagaView()}
        {currentView === 'sparade-sagor' && renderSparadeSagorView()}
        {currentView === 'universella-sagor' && renderUniversellaSagorView()}
      </div>
    </div>
  )
}

export default CreateStoryPage 