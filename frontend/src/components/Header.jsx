import React from 'react'

const Header = () => {
  const headerStyle = {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '16px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  const logoStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0
  }

  const buttonContainerStyle = {
    display: 'flex',
    gap: '12px'
  }

  const loginButtonStyle = {
    backgroundColor: '#1d4ed8',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500'
  }

  const registerButtonStyle = {
    backgroundColor: '#16a34a',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500'
  }

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <h1 style={logoStyle}>AI Stories</h1>
        <div style={buttonContainerStyle}>
          <button style={loginButtonStyle}>
            Logga in
          </button>
          <button style={registerButtonStyle}>
            Registrera
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header 