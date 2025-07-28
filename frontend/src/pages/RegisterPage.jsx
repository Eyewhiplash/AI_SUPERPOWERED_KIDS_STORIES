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

const RegisterPage = ({ selectedTheme = 'candy' }) => {
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()
  const currentTheme = themes[selectedTheme] || themes.candy
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [success, setSuccess] = useState('')

  const mainStyle = {
    minHeight: '100vh',
    background: currentTheme.background,
    padding: '40px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const containerStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    padding: '32px',
    minWidth: '420px',
    maxWidth: '500px',
    width: '90%',
    textAlign: 'left'
  }

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    border: '2px solid #d1d5db',
    borderRadius: '12px',
    marginBottom: '16px',
    fontSize: '16px',
    minHeight: '56px',
    transition: 'border-color 0.2s ease'
  }

  const buttonStyle = {
    backgroundColor: loading ? '#9ca3af' : '#10b981',
    color: 'white',
    padding: '16px 24px',
    border: 'none',
    borderRadius: '12px',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontSize: '16px',
    width: '100%',
    marginBottom: '16px',
    fontWeight: '600',
    minHeight: '56px',
    transition: 'all 0.2s ease',
    opacity: loading ? 0.7 : 1
  }

  const linkButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '4px'
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegisterError('')
    setSuccess('')
    
    if (password !== confirmPassword) {
      setRegisterError('Lösenorden matchar inte!')
      return
    }
    
    if (password.length < 6) {
      setRegisterError('Lösenordet måste vara minst 6 tecken!')
      return
    }
    
    try {
      const result = await register(username, password)
      if (result.success) {
        setSuccess('Konto skapat! Du kan nu logga in.')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setRegisterError(result.error || 'Registrering misslyckades')
      }
    } catch (err) {
      setRegisterError('Ett fel inträffade vid registrering')
    }
  }

  return (
    <div style={mainStyle}>
      <div style={containerStyle}>
        <form onSubmit={handleRegister}>
          <h3 style={{margin: '0 0 24px 0', fontSize: '24px', fontWeight: '700', color: '#111827', textAlign: 'center'}}>
            🔐 Skapa konto
          </h3>
          
          {registerError && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '2px solid #fecaca',
              color: '#dc2626',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '16px'
            }}>
              {registerError}
            </div>
          )}
          
          {success && (
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '2px solid #bbf7d0',
              color: '#166534',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '16px'
            }}>
              {success}
            </div>
          )}
          
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '600', color: '#374151'}}>
              Användarnamn
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: username ? '#10b981' : '#d1d5db'
              }}
              placeholder="Ange användarnamn"
              required
              disabled={loading}
            />
          </div>
          
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '600', color: '#374151'}}>
              Lösenord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: password.length >= 6 ? '#10b981' : '#d1d5db'
              }}
              placeholder="Minst 6 tecken"
              required
              disabled={loading}
            />
          </div>
          
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '600', color: '#374151'}}>
              Bekräfta lösenord
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: confirmPassword && password === confirmPassword ? '#10b981' : '#d1d5db'
              }}
              placeholder="Upprepa lösenordet"
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Skapar konto...' : 'Skapa konto'}
          </button>
          
          <div style={{textAlign: 'center'}}>
            <span style={{fontSize: '14px', color: '#6b7280'}}>Har du redan ett konto? </span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={linkButtonStyle}
            >
              Logga in här
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage 