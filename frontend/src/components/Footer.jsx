import React from 'react'

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#4b5563',
    color: 'white',
    padding: '20px',
    marginTop: 'auto',
    textAlign: 'center'
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  }

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <p style={{margin: 0, fontSize: '14px'}}>
          © 2025 AI Stories. Alla rättigheter förbehållna.
        </p>
      </div>
    </footer>
  )
}

export default Footer 