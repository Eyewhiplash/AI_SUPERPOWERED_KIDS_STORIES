import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const themes = {
  candy: {
    name: 'Candy Land',
    description: 'Sweet and colorful',
    icon: '🍬',
    background: 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200'
  },
  tropical: {
    name: 'Tropical Paradise',
    description: 'Sunny beaches',
    icon: '🌴',
    background: 'bg-gradient-to-br from-blue-400 via-green-400 to-yellow-400'
  },
  space: {
    name: 'Space Adventure',
    description: 'Explore cosmos',
    icon: '🚀',
    background: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-black'
  },
  rainbow: {
    name: 'Rainbow Magic',
    description: 'Colorful world',
    icon: '🌈',
    background: 'bg-gradient-to-r from-red-400 via-yellow-400 to-purple-400'
  },
  ocean: {
    name: 'Ocean Depths',
    description: 'Underwater adventure',
    icon: '🐠',
    background: 'bg-gradient-to-br from-blue-600 via-blue-400 to-teal-400'
  }
}

const Header = ({ selectedTheme = 'candy', setSelectedTheme }) => {
  const navigate = useNavigate()
  const { user, login, logout, loading, error, clearError, isAuthenticated } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showThemes, setShowThemes] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const loginDropdownRef = useRef(null)
  const themesDropdownRef = useRef(null)

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    width: '100vw'
  }

  const headerInnerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
  }

  const containerStyle = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '48px'
  }

  const logoStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    margin: 0
  }

  const buttonStyle = {
    padding: '6px 12px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginRight: '8px'
  }

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    marginTop: '8px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    padding: '16px',
    minWidth: '280px',
    zIndex: 1001
  }

  const themeOptionStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '8px'
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    marginBottom: '12px',
    fontSize: '14px'
  }

  const submitButtonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    width: '100%',
    marginBottom: '12px',
    fontWeight: '500'
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target)) {
        setShowLogin(false)
      }
      if (themesDropdownRef.current && !themesDropdownRef.current.contains(event.target)) {
        setShowThemes(false)
      }
    }

    if (showLogin || showThemes) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLogin, showThemes])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    
    try {
      const result = await login(username, password)
      if (result.success) {
    setShowLogin(false)
        setUsername('')
        setPassword('')
      } else {
        setLoginError(result.error || 'Inloggning misslyckades')
      }
    } catch (err) {
      setLoginError('Ett fel inträffade vid inloggning')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleThemeSelect = (themeKey) => {
    if (setSelectedTheme) {
      setSelectedTheme(themeKey)
    }
    setShowThemes(false)
  }

  return (
    <header style={headerStyle}>
      <div style={headerInnerStyle}>
        <div style={containerStyle}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <button 
              style={buttonStyle}
              onClick={() => navigate('/')}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
            >
              🏠 Hem
            </button>
            
            <div style={{position: 'relative'}} ref={themesDropdownRef}>
              <button 
                style={buttonStyle}
                onClick={() => setShowThemes(!showThemes)}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
              >
                {themes[selectedTheme]?.icon} Tema
              </button>
              
              {showThemes && (
                <div style={{...dropdownStyle, left: 0}}>
                  <h3 style={{margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#111827'}}>
                    Välj Tema
                  </h3>
                  {Object.entries(themes).map(([key, theme]) => (
                    <div
                      key={key}
                      style={{
                        ...themeOptionStyle,
                        backgroundColor: selectedTheme === key ? '#f3f4f6' : 'transparent'
                      }}
                      onClick={() => handleThemeSelect(key)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = selectedTheme === key ? '#f3f4f6' : 'transparent'}
                    >
                      <span style={{fontSize: '20px', marginRight: '12px'}}>{theme.icon}</span>
                      <div>
                        <div style={{fontWeight: '500', color: '#111827', fontSize: '14px'}}>{theme.name}</div>
                        <div style={{color: '#6b7280', fontSize: '12px'}}>{theme.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <h1 style={logoStyle}>AI Stories</h1>
          
          <div style={{position: 'relative'}} ref={loginDropdownRef}>
            {!isAuthenticated ? (
            <button 
              style={buttonStyle}
              onClick={() => setShowLogin(!showLogin)}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
            >
              🔐 Logga in
            </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  style={buttonStyle}
                  onClick={() => navigate('/settings')}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
                >
                  ⚙️ Inställningar
                </button>
                <button 
                  style={buttonStyle}
                  onClick={handleLogout}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
                >
                  🚪 Logga ut
                </button>
              </div>
            )}
            
            {showLogin && !isAuthenticated && (
              <div style={{...dropdownStyle, right: 0}}>
                <form onSubmit={handleLogin}>
                  <h3 style={{margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#111827'}}>
                    Logga in
                  </h3>
                  
                  {loginError && (
                    <div style={{
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#dc2626',
                      padding: '8px',
                      borderRadius: '6px',
                      marginBottom: '12px',
                      fontSize: '14px'
                    }}>
                      {loginError}
                    </div>
                  )}
                  
                  <div style={{marginBottom: '12px'}}>
                    <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151'}}>
                      Användarnamn
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={inputStyle}
                      placeholder="Ange användarnamn"
                      disabled={loading}
                    />
                  </div>
                  
                  <div style={{marginBottom: '16px'}}>
                    <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151'}}>
                      Lösenord
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={inputStyle}
                      placeholder="Ange lösenord"
                      disabled={loading}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    style={{
                      ...submitButtonStyle,
                      opacity: loading ? 0.6 : 1,
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Loggar in...' : 'Logga in'}
                  </button>
                  
                  <div style={{textAlign: 'center', paddingTop: '8px', borderTop: '1px solid #e5e7eb'}}>
                    <span style={{fontSize: '14px', color: '#6b7280'}}>
                      Har du inget konto? 
                    </span>
                    <br />
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#3b82f6',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontSize: '14px',
                        marginTop: '4px'
                      }}
                      onClick={() => {
                        setShowLogin(false)
                        navigate('/register')
                      }}
                      disabled={loading}
                    >
                      Registrera dig här
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 