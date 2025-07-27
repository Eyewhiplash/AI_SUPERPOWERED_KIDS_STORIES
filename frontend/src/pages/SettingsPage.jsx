import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

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

const SettingsPage = ({ selectedTheme = 'candy' }) => {
  const navigate = useNavigate()
  const { user, updateUserSettings, logout, isAuthenticated } = useAuth()
  const currentTheme = themes[selectedTheme] || themes.candy
  
  const [settings, setSettings] = useState({
    storyAge: user?.settings?.storyAge || 5,
    storyComplexity: user?.settings?.storyComplexity || 'medium'
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSave = async () => {
    try {
      setError(null)
      updateUserSettings(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Kunde inte spara inställningar')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!isAuthenticated) {
    return null
  }

  const mainStyle = {
    background: currentTheme.background,
    minHeight: '100vh',
    paddingTop: '48px',
    paddingBottom: '60px',
    padding: '68px 20px 60px 20px'
  }

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)'
  }

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '24px',
    textAlign: 'center'
  }

  const sectionStyle = {
    marginBottom: '32px',
    padding: '24px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: 'white',
    transition: 'border-color 0.2s ease'
  }

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  }

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '120px'
  }

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
    color: 'white'
  }

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6b7280',
    color: 'white',
    marginRight: '12px'
  }

  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ef4444',
    color: 'white'
  }

  return (
    <div style={mainStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>⚙️ Inställningar</h1>
        
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {saved && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            ✅ Inställningar sparade!
          </div>
        )}

        <div style={sectionStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            👤 Användare
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '12px' }}>
            Inloggad som: <strong>{user?.username}</strong>
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            📚 Sago-inställningar
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              Barnets ålder (år)
            </label>
            <input
              type="number"
              min="3"
              max="12"
              value={settings.storyAge}
              onChange={(e) => setSettings(prev => ({ ...prev, storyAge: parseInt(e.target.value) }))}
              style={inputStyle}
            />
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              Påverkar komplexiteten och ordförrådet i sagorna
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              Berättelsekomplexitet
            </label>
            <select
              value={settings.storyComplexity}
              onChange={(e) => setSettings(prev => ({ ...prev, storyComplexity: e.target.value }))}
              style={selectStyle}
            >
              <option value="simple">Enkel - Korta meningar, grundläggande ordförråd</option>
              <option value="medium">Medium - Balanserad komplexitet</option>
              <option value="advanced">Avancerad - Rikare språk och längre berättelser</option>
            </select>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <button
            onClick={() => navigate('/')}
            style={secondaryButtonStyle}
          >
            🏠 Hem
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSave}
              style={primaryButtonStyle}
            >
              💾 Spara
            </button>
            
            <button
              onClick={handleLogout}
              style={dangerButtonStyle}
            >
              🚪 Logga ut
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage 