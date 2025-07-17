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

const RegisterPage = ({ selectedTheme = 'candy' }) => {
  const navigate = useNavigate()
  const currentTheme = themes[selectedTheme] || themes.candy
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

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
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    padding: '16px',
    minWidth: '420px',
    textAlign: 'left'
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    marginBottom: '12px',
    fontSize: '14px'
  }

  const buttonStyle = {
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

  const linkButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '4px'
  }

  const handleRegister = (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      alert('Lösenorden matchar inte!')
      return
    }
    
    // Här kommer registrering logik senare
    console.log('Register:', { username, email, password })
    // För nu, gå bara till login-sidan
    navigate('/login')
  }

  return (
    <div style={mainStyle}>
      <div style={containerStyle}>
        <form onSubmit={handleRegister}>
          <h3 style={{margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#111827'}}>
            Skapa konto
          </h3>
          
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
              required
            />
          </div>
          
          <div style={{marginBottom: '12px'}}>
            <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151'}}>
              E-post
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="Ange e-post"
              required
            />
          </div>
          
          <div style={{marginBottom: '12px'}}>
            <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151'}}>
              Lösenord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="Ange lösenord"
              required
            />
          </div>
          
          <div style={{marginBottom: '16px'}}>
            <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151'}}>
              Bekräfta lösenord
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
              placeholder="Bekräfta lösenord"
              required
            />
          </div>
          
          <button type="submit" style={buttonStyle}>
            Skapa konto
          </button>
          
          <div style={{textAlign: 'center', paddingTop: '8px', borderTop: '1px solid #e5e7eb'}}>
            <span style={{fontSize: '14px', color: '#6b7280'}}>
              Har du redan ett konto? 
            </span>
            <br />
            <button
              type="button"
              style={linkButtonStyle}
              onClick={() => navigate('/login')}
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