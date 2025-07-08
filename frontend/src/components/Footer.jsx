import React from 'react'

const Footer = () => {
  const footerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#374151',
    padding: '12px 10px',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    textAlign: 'center',
    width: '100vw'
  }

  const containerStyle = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  }

  const textStyle = {
    margin: 0,
    fontSize: '13px',
    fontWeight: '400',
    opacity: 0.8
  }

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <p style={textStyle}>
          © 2025 AI Stories. Alla rättigheter förbehållna.
        </p>
      </div>
    </footer>
  )
}

export default Footer 