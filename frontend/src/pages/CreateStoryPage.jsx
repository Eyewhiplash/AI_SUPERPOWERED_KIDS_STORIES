import React from 'react'
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
    maxWidth: '800px',
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



  const contentStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }

  return (
    <div style={mainStyle}>
      <div style={containerStyle}>

        
        <h1 style={titleStyle}>📚 Skapa Berättelser</h1>
        
        <div style={contentStyle}>
          <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>AI-driven berättelseskapare</h2>
          <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.6' }}>
            Här kommer du att kunna skapa fantastiska berättelser med hjälp av artificiell intelligens. 
            Välj karaktärer, miljöer och teman för att skapa en unik berättelse för ditt barn.
          </p>
          <div style={{ marginTop: '32px', padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '12px' }}>
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
              Funktionen utvecklas fortfarande... 🚧
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateStoryPage 